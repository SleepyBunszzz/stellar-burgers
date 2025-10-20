import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {
  registerUserApi,
  loginUserApi,
  getUserApi,
  updateUserApi,
  logoutApi,
  type TRegisterData,
  type TLoginData
} from '../../utils/burger-api';
import type { RootState } from '../store';

type TUser = { name: string; email: string };

type UserState = {
  user: TUser | null;
  isAuthChecked: boolean;
  loading: boolean;
  error: string | null;
};

const initialState: UserState = {
  user: null,
  isAuthChecked: false,
  loading: false,
  error: null
};

export const fetchUser = createAsyncThunk<TUser>('user/fetchUser', async () => {
  const res = await getUserApi();
  return res.user;
});

export const login = createAsyncThunk<TUser, TLoginData>(
  'user/login',
  async (data) => {
    const res = await loginUserApi(data);
    return res.user;
  }
);

export const register = createAsyncThunk<TUser, TRegisterData>(
  'user/register',
  async (data) => {
    const res = await registerUserApi(data);
    return res.user;
  }
);

export const updateUser = createAsyncThunk<TUser, Partial<TRegisterData>>(
  'user/update',
  async (data) => {
    const res = await updateUserApi(data);
    return res.user;
  }
);

export const logout = createAsyncThunk('user/logout', async () => {
  await logoutApi();
});

const slice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setAuthChecked(state, action) {
      state.isAuthChecked = action.payload as boolean;
    }
  },
  extraReducers: (b) => {
    // fetchUser
    b.addCase(fetchUser.pending, (s) => {
      s.loading = true;
      s.error = null;
    });
    b.addCase(fetchUser.fulfilled, (s, { payload }) => {
      s.loading = false;
      s.user = payload;
      s.isAuthChecked = true;
    });
    b.addCase(fetchUser.rejected, (s) => {
      s.loading = false;
      s.user = null;
      s.isAuthChecked = true;
    });

    // login
    b.addCase(login.pending, (s) => {
      s.loading = true;
      s.error = null;
    });
    b.addCase(login.fulfilled, (s, { payload }) => {
      s.loading = false;
      s.user = payload;
      s.isAuthChecked = true;
    });
    b.addCase(login.rejected, (s, a) => {
      s.loading = false;
      s.error = a.error.message || 'Ошибка входа'; // ✅ ИСПРАВЛЕНО
      s.isAuthChecked = true;
    });

    // register
    b.addCase(register.pending, (s) => {
      s.loading = true;
      s.error = null;
    });
    b.addCase(register.fulfilled, (s, { payload }) => {
      s.loading = false;
      s.user = payload;
      s.isAuthChecked = true;
    });
    b.addCase(register.rejected, (s, a) => {
      s.loading = false;
      s.error = a.error.message || 'Ошибка регистрации'; // ✅ ИСПРАВЛЕНО
      s.isAuthChecked = true;
    });

    // updateUser
    b.addCase(updateUser.pending, (s) => {
      s.loading = true;
      s.error = null;
    });
    b.addCase(updateUser.fulfilled, (s, { payload }) => {
      s.loading = false;
      s.user = payload;
    });
    b.addCase(updateUser.rejected, (s, a) => {
      s.loading = false;
      s.error = a.error.message || 'Ошибка сохранения';
    });

    // logout
    b.addCase(logout.fulfilled, (s) => {
      s.user = null;
    });
  }
});

export const { setAuthChecked } = slice.actions;

export const selectUser = (s: RootState) => s.user.user;
export const selectUserLoading = (s: RootState) => s.user.loading;
export const selectAuthChecked = (s: RootState) => s.user.isAuthChecked;

export default slice.reducer;
