import { setCookie, getCookie, deleteCookie } from './cookie';
import { TIngredient, TOrder, TOrdersData, TUser } from './types';

export const URL = (
  process.env.BURGER_API_URL || 'https://norma.education-services.ru/api'
).replace(/\/+$/, '');

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

const checkResponse = async <T>(res: Response): Promise<T> => {
  let data: any = {};
  try {
    data = await res.json();
  } catch {}
  if (res.ok) return data as T;
  throw { status: res.status, ...data };
};

const buildAuthHeader = () => {
  const raw = getCookie('accessToken');
  if (!raw) return {};
  const value = raw.startsWith('Bearer ') ? raw : `Bearer ${raw}`;
  return { Authorization: value } as Record<string, string>;
};

const toHeaders = (init?: HeadersInit) => new Headers(init || {});

const request = async <T>(
  endpoint: string,
  options?: RequestInit
): Promise<T> => {
  const res = await fetch(`${URL}/${endpoint.replace(/^\/+/, '')}`, options);
  const data = await checkResponse<TServerResponse<any>>(res);
  if (typeof data === 'object' && data !== null && 'success' in data) {
    if ((data as any).success) return data as T;
    throw data;
  }
  return data as T;
};

export type TRegisterData = { email: string; name: string; password: string };
export type TLoginData = { email: string; password: string };

export const refreshToken = (): Promise<TRefreshResponse> =>
  request<TRefreshResponse>('auth/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json;charset=utf-8' },
    body: JSON.stringify({ token: getCookie('refreshToken') })
  }).then((refreshData) => {
    if (!refreshData.success) return Promise.reject(refreshData);
    setCookie('refreshToken', refreshData.refreshToken);
    setCookie('accessToken', refreshData.accessToken);
    return refreshData;
  });

export const fetchWithRefresh = async <T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> => {
  try {
    const res = await fetch(`${URL}/${endpoint.replace(/^\/+/, '')}`, options);
    return await checkResponse<T>(res);
  } catch (err: any) {
    const shouldRefresh =
      err?.status === 401 ||
      err?.message === 'jwt expired' ||
      err?.message === 'jwt malformed' ||
      err?.message === 'invalid token';

    if (!shouldRefresh) throw err;

    const refreshData = await refreshToken();

    const headers = toHeaders(options.headers);
    headers.set('Authorization', refreshData.accessToken);

    const res2 = await fetch(`${URL}/${endpoint.replace(/^\/+/, '')}`, {
      ...options,
      headers
    });
    return await checkResponse<T>(res2);
  }
};

export const getIngredientsApi = (): Promise<TIngredient[]> =>
  request<TIngredientsResponse>('ingredients', { method: 'GET' }).then(
    (data) => data.data
  );

export const getFeedsApi = (): Promise<TOrdersData> =>
  request<TFeedsResponse>('orders/all', { method: 'GET' });

export const getOrdersApi = (): Promise<TOrder[]> =>
  fetchWithRefresh<TFeedsResponse>('orders', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
      ...buildAuthHeader()
    } as HeadersInit
  }).then((data) => data.orders);

export const orderBurgerApi = (data: string[]): Promise<TNewOrderResponse> =>
  fetchWithRefresh<TNewOrderResponse>('orders', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
      ...buildAuthHeader()
    } as HeadersInit,
    body: JSON.stringify({ ingredients: data })
  });

export const createOrderApi = orderBurgerApi;

export const getOrderByNumberApi = (number: number): Promise<TOrderResponse> =>
  request<TOrderResponse>(`orders/${number}`, { method: 'GET' });

export const registerUserApi = (data: TRegisterData): Promise<TAuthResponse> =>
  request<TAuthResponse>('auth/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json;charset=utf-8' },
    body: JSON.stringify(data)
  }).then((res) => {
    if (res.success) {
      setCookie('accessToken', res.accessToken);
      setCookie('refreshToken', res.refreshToken);
    }
    return res;
  });

export const loginUserApi = (data: TLoginData): Promise<TAuthResponse> =>
  request<TAuthResponse>('auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json;charset=utf-8' },
    body: JSON.stringify(data)
  }).then((res) => {
    if (res.success) {
      setCookie('accessToken', res.accessToken);
      setCookie('refreshToken', res.refreshToken);
    }
    return res;
  });

export const forgotPasswordApi = (data: {
  email: string;
}): Promise<TServerResponse<{}>> =>
  request<TServerResponse<{}>>('password-reset', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json;charset=utf-8' },
    body: JSON.stringify(data)
  });

export const resetPasswordApi = (data: {
  password: string;
  token: string;
}): Promise<TServerResponse<{}>> =>
  request<TServerResponse<{}>>('password-reset/reset', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json;charset=utf-8' },
    body: JSON.stringify(data)
  });

export const getUserApi = (): Promise<TUserResponse> =>
  fetchWithRefresh<TUserResponse>('auth/user', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
      ...buildAuthHeader()
    } as HeadersInit
  });

export const updateUserApi = (
  user: Partial<TRegisterData>
): Promise<TUserResponse> =>
  fetchWithRefresh<TUserResponse>('auth/user', {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
      ...buildAuthHeader()
    } as HeadersInit,
    body: JSON.stringify(user)
  });

export const logoutApi = (): Promise<TServerResponse<{}>> =>
  request<TServerResponse<{}>>('auth/logout', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json;charset=utf-8' },
    body: JSON.stringify({ token: getCookie('refreshToken') })
  }).then((data) => {
    if (data.success) {
      deleteCookie('accessToken');
      deleteCookie('refreshToken');
    }
    return data;
  });
