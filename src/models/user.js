import { _query, _review, _mark } from '../services/user'
import { message } from 'antd'
export default {
    namespace: 'user',
    state: {
        count: 0,
        params: {
            page: 1,
            limit: 10,
            status: 'all'
        },
        members: [],
    },

    effects: {
        *query({ params }, { call, put }) {
            yield put({ type: 'saveParams', params })
            if (params.status == 'inside') {
                params.is_review = true;
            }
            if (params.status == 'members') {
                params.is_review = false;
            }
            if (params.status == 'all') {
                delete params.status;
            }

            const data = yield call(_query, params);
            if (data.error.ErrorCode != 0) return;
            yield put({
                type: 'saveData', data: {
                    members: data.members,
                    count: data.count
                }
            })

        },
        *review({ params }, { call, put, select }) {
            const data = yield call(_review, params);
            if (data.error.ErrorCode != 0) return;
            message.success('操作成功')

            const user = yield select(state => state.user)
            const newparams = user.params;
            yield put({ type: 'query', params: newparams })
        },
        *mark({ params }, { call, put, select }) {
            const data = yield call(_mark, params);
            if (data.error.ErrorCode != 0) return;
            message.success('备注成功')
            const user = yield select(state => state.user)
            const newparams = user.params;
            yield put({ type: 'query', params: newparams })
        },
    },
    reducers: {
        saveParams(state, { params }) {
            return { ...state, params: { ...params } }
        },
        saveData(state, { data }) {
            return { ...state, ...data }
        },
    },

    subscriptions: {

    },
};
