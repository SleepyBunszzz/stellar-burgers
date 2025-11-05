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

type TUserData = {
  name: string;
  email: string;
};

type UserState = {
  name: string | null;
  email: string | null;
  isAuthChecked: boolean;
  loading: boolean;
  error: string | null;
};

const initialState: UserState = {
  name: null,
  email: null,
  isAuthChecked: false,
  loading: false,
  error: null
};

export const fetchUser = createAsyncThunk<TUserData>(
  'user/fetchUser',
  async (_, { rejectWithValue }) => {
    try {
      const me = await getUserApi();
      if (!me?.user?.email || !me?.user?.name) {
        return rejectWithValue('No user payload');
      }
      return me.user;
    } catch (e: any) {
      return rejectWithValue(e?.message || 'Failed to fetch user');
    }
  }
);

export const login = createAsyncThunk<TUserData, TLoginData>(
  'user/login',
  async (data, { rejectWithValue }) => {
    try {
      await loginUserApi(data);
      const me = await getUserApi();
      if (!me?.user?.email || !me?.user?.name) {
        return rejectWithValue('No user payload after login');
      }
      return me.user;
    } catch (e: any) {
      return rejectWithValue(e?.message || 'Login failed');
    }
  }
);

export const register = createAsyncThunk<TUserData, TRegisterData>(
  'user/register',
  async (data, { rejectWithValue }) => {
    try {
      await registerUserApi(data);
      const me = await getUserApi();
      if (!me?.user?.email || !me?.user?.name) {
        return rejectWithValue('No user payload after register');
      }
      return me.user;
    } catch (e: any) {
      return rejectWithValue(e?.message || 'Register failed');
    }
  }
);

export const updateUser = createAsyncThunk<TUserData, Partial<TRegisterData>>(
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
      s.name = payload.name;
      s.email = payload.email;
      s.isAuthChecked = true;
    });
    b.addCase(fetchUser.rejected, (s) => {
      s.loading = false;
      s.name = null;
      s.email = null;
      s.isAuthChecked = true;
    });

    // login
    b.addCase(login.pending, (s) => {
      s.loading = true;
      s.error = null;
    });
    b.addCase(login.fulfilled, (s, { payload }) => {
      s.loading = false;
      s.name = payload.name;
      s.email = payload.email;
      s.isAuthChecked = true;
    });
    b.addCase(login.rejected, (s, a) => {
      s.loading = false;
      s.error = a.error.message || 'Ошибка входа';
      s.isAuthChecked = true;
    });

    // register
    b.addCase(register.pending, (s) => {
      s.loading = true;
      s.error = null;
    });
    b.addCase(register.fulfilled, (s, { payload }) => {
      s.loading = false;
      s.name = payload.name;
      s.email = payload.email;
      s.isAuthChecked = true;
    });
    b.addCase(register.rejected, (s, a) => {
      s.loading = false;
      s.error = a.error.message || 'Ошибка регистрации';
      s.isAuthChecked = true;
    });

    // updateUser
    b.addCase(updateUser.pending, (s) => {
      s.loading = true;
      s.error = null;
    });
    b.addCase(updateUser.fulfilled, (s, { payload }) => {
      s.loading = false;
      s.name = payload.name;
      s.email = payload.email;
    });
    b.addCase(updateUser.rejected, (s, a) => {
      s.loading = false;
      s.error = a.error.message || 'Ошибка сохранения';
    });

    // logout
    b.addCase(logout.fulfilled, (s) => {
      s.name = null;
      s.email = null;
      s.isAuthChecked = true;
    });
  }
});

export const { setAuthChecked } = slice.actions;

// пользователь считается залогиненным только если у нас есть и name, и email
export const selectUser = (s: RootState) => {
  if (s.user.name && s.user.email) {
    return { name: s.user.name, email: s.user.email };
  }
  return null;
};

export const selectUserLoading = (s: RootState) => s.user.loading;
export const selectAuthChecked = (s: RootState) => s.user.isAuthChecked;

export default slice.reducer;
