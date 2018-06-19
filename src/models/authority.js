import { _query, _add, _editor } from '../services/authority'
import { routerRedux } from 'dva/router'
import { message } from 'antd'
export default {
    namespace: 'authority',
    state: {
        users: []
    },
    effects: {
        *query({ param }, { call, put }) {
            const data = yield call(_query);
            if (data.error.ErrorCode != 0) return;
            yield put({
                type: 'saveData', data: {
                    users: data.users
                }
            })
        },
        *addAuthority({ params }, { call, put }) {
            const data = yield call(_add, params);
            if (data.error.ErrorCode != 0) return;
            message.success('添加成功')

            yield put(routerRedux.push('/authority'))
        },
        *editorAuthority({ params }, { call, put }) {
            const data = yield call(_editor, params);
            if (data.error.ErrorCode != 0) return;
            message.success('修改成功')

            yield put(routerRedux.push('/authority'))
        }
    },

    reducers: {
        saveData(state, { data }) {
            return { ...state, ...data }
        }
    },

    subscriptions: {
    },
};
