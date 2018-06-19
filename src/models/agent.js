import { _queryAgent, _queryCount } from '../services/agent'
export default {
    namespace: 'agent',
    state: {
        count: 0,
        params: {
            page: 1,
            limit: 10,
            agent_status: '0'
        },
        agents: [],
        amount: {
            0: 0,
            1: 0,
            2: 0,
            3: 0,
            4: 0,
            5: 0
        }
    },

    effects: {
        *queryAgent({ params }, { call, put }) {
            yield put({ type: 'saveParams', params })
            if (params.agent_status == '0') delete params.agent_status;
            const data = yield call(_queryAgent, params);
            if (data.error.ErrorCode != 0) return;
            yield put({
                type: 'saveData', data: {
                    agents: data.agents,
                    count: data.count
                }
            })
            const counts = yield call(_queryCount);
            if (counts.error.ErrorCode != 0) return;
            yield put({
                type: 'saveAmount', amount: counts.count
            })
        }
    },
    reducers: {
        saveParams(state, { params }) {
            return { ...state, params: { ...params } }
        },
        saveData(state, { data }) {
            return { ...state, ...data }
        },
        saveAmount(state, { amount }) {
            let total = 0;
            for (let key in amount) {

                total += amount[key]
            }
            return { ...state, amount: { ...amount, '0': total } }
        }
    },

    subscriptions: {

    },
};
