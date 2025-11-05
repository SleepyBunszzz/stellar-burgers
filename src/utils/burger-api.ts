import { setCookie, getCookie, deleteCookie } from './cookie';
import { TIngredient, TOrder, TOrdersData, TUser } from './types';

const URL = process.env.BURGER_API_URL;

// Унифицируем ответ: при ошибке пробрасываем и status, и тело
const checkResponse = async <T>(res: Response): Promise<T> => {
  let data: any = {};
  try {
    data = await res.json();
  } catch {
    // тело пустое — оставим {}
  }
  if (res.ok) return data as T;
  throw { status: res.status, ...data };
};

// Структуры ответов
type TServerResponse<T> = { success: boolean } & T;
type TRefreshResponse = TServerResponse<{
  refreshToken: string;
  accessToken: string;
}>;
type TIngredientsResponse = TServerResponse<{ data: TIngredient[] }>;
type TFeedsResponse = TServerResponse<TOrdersData>;
type TOrderResponse = TServerResponse<{ orders: TOrder[] }>;
type TNewOrderResponse = TServerResponse<{ order: TOrder; name: string }>;
type TAuthResponse = TServerResponse<{
  refreshToken: string;
  accessToken: string;
  user: TUser;
}>;
type TUserResponse = TServerResponse<{ user: TUser }>;

// Нормализуем accessToken из cookie в правильный Authorization
const buildAuthHeader = () => {
  const raw = getCookie('accessToken');
  if (!raw) return {};
  const value = raw.startsWith('Bearer ') ? raw : `Bearer ${raw}`;
  return { Authorization: value } as Record<string, string>;
};

// Превращаем любые HeadersInit в реальный Headers, чтобы безопасно модифицировать
const toHeaders = (init?: HeadersInit) => new Headers(init || {});

export type TRegisterData = { email: string; name: string; password: string };
export type TLoginData = { email: string; password: string };

export const refreshToken = (): Promise<TRefreshResponse> =>
  fetch(`${URL}/auth/token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json;charset=utf-8' },
    body: JSON.stringify({ token: getCookie('refreshToken') })
  })
    .then((res) => checkResponse<TRefreshResponse>(res))
    .then((refreshData) => {
      if (!refreshData.success) return Promise.reject(refreshData);
      // Практикум присылает accessToken уже с "Bearer "
      setCookie('refreshToken', refreshData.refreshToken);
      setCookie('accessToken', refreshData.accessToken);
      return refreshData;
    });

export const fetchWithRefresh = async <T>(
  url: RequestInfo,
  options: RequestInit = {}
): Promise<T> => {
  try {
    const res = await fetch(url, options);
    return await checkResponse<T>(res);
  } catch (err: any) {
    // Решаем, нужен ли рефреш
    const shouldRefresh =
      err?.status === 401 ||
      err?.message === 'jwt expired' ||
      err?.message === 'jwt malformed' ||
      err?.message === 'invalid token';

    if (!shouldRefresh) {
      throw err;
    }

    const refreshData = await refreshToken();

    // Пересобираем заголовки начального запроса с новым токеном
    const headers = toHeaders(options.headers);
    headers.set('Authorization', refreshData.accessToken); // уже "Bearer <jwt>"

    const res2 = await fetch(url, { ...options, headers });
    return await checkResponse<T>(res2);
  }
};

// -------- Публичные API-функции --------

export const getIngredientsApi = (): Promise<TIngredient[]> =>
  fetch(`${URL}/ingredients`, { method: 'GET' })
    .then((res) => checkResponse<TIngredientsResponse>(res))
    .then((data) => {
      if (data?.success) return data.data;
      return Promise.reject(data);
    });

export const getFeedsApi = (): Promise<TOrdersData> =>
  fetch(`${URL}/orders/all`, { method: 'GET' })
    .then((res) => checkResponse<TFeedsResponse>(res))
    .then((data) => {
      if (data?.success) return data;
      return Promise.reject(data);
    });

export const getOrdersApi = (): Promise<TOrder[]> =>
  fetchWithRefresh<TFeedsResponse>(`${URL}/orders`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
      ...buildAuthHeader()
    } as HeadersInit
  }).then((data) => {
    if (data?.success) return data.orders;
    return Promise.reject(data);
  });

export const orderBurgerApi = (data: string[]): Promise<TNewOrderResponse> =>
  fetchWithRefresh<TNewOrderResponse>(`${URL}/orders`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
      ...buildAuthHeader()
    } as HeadersInit,
    body: JSON.stringify({ ingredients: data })
  });

export const createOrderApi = orderBurgerApi;

export const getOrderByNumberApi = (number: number): Promise<TOrderResponse> =>
  fetch(`${URL}/orders/${number}`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' }
  }).then((res) => checkResponse<TOrderResponse>(res));

export const registerUserApi = (data: TRegisterData): Promise<TAuthResponse> =>
  fetch(`${URL}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json;charset=utf-8' },
    body: JSON.stringify(data)
  })
    .then((res) => checkResponse<TAuthResponse>(res))
    .then((data) => {
      if (data?.success) {
        setCookie('accessToken', data.accessToken); // уже "Bearer ..."
        setCookie('refreshToken', data.refreshToken);
        return data;
      }
      return Promise.reject(data);
    });

export const loginUserApi = (data: TLoginData): Promise<TAuthResponse> =>
  fetch(`${URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json;charset=utf-8' },
    body: JSON.stringify(data)
  })
    .then((res) => checkResponse<TAuthResponse>(res))
    .then((data) => {
      if (data?.success) {
        setCookie('accessToken', data.accessToken); // уже "Bearer ..."
        setCookie('refreshToken', data.refreshToken);
        return data;
      }
      return Promise.reject(data);
    });

export const forgotPasswordApi = (data: {
  email: string;
}): Promise<TServerResponse<{}>> =>
  fetch(`${URL}/password-reset`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json;charset=utf-8' },
    body: JSON.stringify(data)
  }).then((res) => checkResponse<TServerResponse<{}>>(res));

export const resetPasswordApi = (data: {
  password: string;
  token: string;
}): Promise<TServerResponse<{}>> =>
  fetch(`${URL}/password-reset/reset`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json;charset=utf-8' },
    body: JSON.stringify(data)
  }).then((res) => checkResponse<TServerResponse<{}>>(res));

export const getUserApi = (): Promise<TUserResponse> =>
  fetchWithRefresh<TUserResponse>(`${URL}/auth/user`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
      ...buildAuthHeader()
    } as HeadersInit
  }).then((data) => {
    if (data?.success && data.user) return data;
    throw { status: 400, message: 'Failed to get user' };
  });

export const updateUserApi = (
  user: Partial<TRegisterData>
): Promise<TUserResponse> =>
  fetchWithRefresh<TUserResponse>(`${URL}/auth/user`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
      ...buildAuthHeader()
    } as HeadersInit,
    body: JSON.stringify(user)
  });

export const logoutApi = (): Promise<TServerResponse<{}>> =>
  fetch(`${URL}/auth/logout`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json;charset=utf-8' },
    body: JSON.stringify({ token: getCookie('refreshToken') })
  })
    .then((res) => checkResponse<TServerResponse<{}>>(res))
    .then((data) => {
      if (data.success) {
        deleteCookie('accessToken');
        deleteCookie('refreshToken');
      }
      return data;
    });
