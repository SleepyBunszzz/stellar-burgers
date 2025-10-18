import { setCookie, getCookie, deleteCookie } from './cookie';
import { TIngredient, TOrder, TOrdersData, TUser } from './types';

const URL = process.env.BURGER_API_URL;

const checkResponse = <T>(res: Response): Promise<T> =>
  res.ok ? res.json() : res.json().then((err) => Promise.reject(err));

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
      setCookie('refreshToken', refreshData.refreshToken);
      setCookie('accessToken', refreshData.accessToken);
      return refreshData;
    });

export const fetchWithRefresh = async <T>(
  url: RequestInfo,
  options: RequestInit
): Promise<T> => {
  try {
    const res = await fetch(url, options);
    return await checkResponse<T>(res);
  } catch (err) {
    if ((err as { message: string }).message === 'jwt expired') {
      const refreshData = await refreshToken();
      if (options.headers) {
        (options.headers as { [key: string]: string }).authorization =
          refreshData.accessToken;
      }
      const res = await fetch(url, options);
      return await checkResponse<T>(res);
    } else {
      return Promise.reject(err);
    }
  }
};

export const getIngredientsApi = (): Promise<TIngredient[]> =>
  fetch(`${URL}/ingredients`)
    .then((res) => checkResponse<TIngredientsResponse>(res))
    .then((data) => {
      if (data?.success) return data.data;
      return Promise.reject(data);
    });

export const getFeedsApi = (): Promise<TOrdersData> =>
  fetch(`${URL}/orders/all`)
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
      authorization: getCookie('accessToken') || ''
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
      authorization: getCookie('accessToken') || ''
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
        setCookie('accessToken', data.accessToken);
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
        setCookie('accessToken', data.accessToken);
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
    headers: { authorization: getCookie('accessToken') || '' } as HeadersInit
  });

export const updateUserApi = (
  user: Partial<TRegisterData>
): Promise<TUserResponse> =>
  fetchWithRefresh<TUserResponse>(`${URL}/auth/user`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
      authorization: getCookie('accessToken') || ''
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
