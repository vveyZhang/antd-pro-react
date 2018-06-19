import { routerRedux } from 'dva/router';
import { _login, _changePassword } from '../services/login';
import { setAuthority } from '../utils/authority';
import { reloadAuthorized } from '../utils/Authorized';
import { message } from 'antd'
export default {
  namespace: 'login',
  state: {
    status: undefined,
  },

  effects: {
    *login({ payload }, { call, put }) {
      const data = yield call(_login, payload);
      if (data.error.ErrorCode != 0) {
        yield put({
          type: 'changeLoginStatus',
          payload: {
            status: 'error'
          },
        });
        return;
      }
      yield put({
        type: 'changeLoginStatus',
        payload: {
          status: 'ok',
          currentAuthority: data.access ? data.access : []
        },
      });
      localStorage.setItem('username', data.admin.username)
      yield put(routerRedux.push('/'));
    },
    *logout(_, { put, select }) {
      try {
        // get location pathname
        const urlParams = new URL(window.location.href);
        const pathname = yield select(state => state.routing.location.pathname);
        // add the parameters in the url
        urlParams.searchParams.set('redirect', pathname);
        window.history.replaceState(null, 'login', urlParams.href);
      } finally {

        yield put({
          type: 'changeLoginStatus',
          payload: {
            status: false,
            currentAuthority: 'guest',
          },
        });
        yield put(routerRedux.push('/user/login'));
      }
    },
    *changePassword({ params }, { call, put }) {
      const data = yield call(_changePassword, params);
      if (data.error.ErrorCode != 0) return;
      message.success('修改成功')
      yield put({
        type: 'changeLoginStatus',
        payload: {
          status: false,
          currentAuthority: 'guest',
        },
      });

      yield put(routerRedux.push('/user/login'));
    }
  },
  reducers: {
    changeLoginStatus(state, { payload }) {
      const currentAuthority = payload.currentAuthority ? payload.currentAuthority : "guest"
      setAuthority(currentAuthority);
      reloadAuthorized();
      return {
        ...state,
        status: payload.status,
        type: payload.type,
      };
    },
  },
};
