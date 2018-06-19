import { _queryOrder, _queryCount, _mark, _payment, _delivery, _cancel } from '../services/order';
import { message } from 'antd'
import { delay } from '../utils/utils'
export default {
    namespace: 'orderAgent',
    state: {
        order_status: '0',
        page: 1,
        count: 0,
        limit: 5,
        orders: [],
        products: [],
        agents: [],
        order_id: null,
        amount: {
            0: 0, 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0
        },
        orderDetails: {
            orders: [],
            products: [],
            agents: [],
        }
    },

    effects: {
        *queryAmount({ params }, { call, put }) {
            const data = yield call(_queryCount);
            if (data.error.ErrorCode != 0) return;
            let total = 0;
            for (let i in data.count) {
                total += data.count[i];
            }
            yield put({
                type: 'saveAmount', data: {
                    ...data.count,
                    0: total
                }
            })
        },
        *queryDetails({ params }, { call, put }) {
            const data = yield call(_queryOrder, params);
            if (data.error.ErrorCode != 0) return;
     
            yield put({
                type: 'saveData', data: {
                    order_id: params.order_id,
                    orderDetails: {
                        orders: data.orders,
                        products: data.products,
                        agents: data.agents,
                    }
                }
            })
        },
        * query({ params }, { call, put }) {
            if (params.order_id) {
                delete params.order_id
            }
            if (params.order_status == 0) {
                yield put({
                    type: 'saveData', data: {
                        ...params
                    }
                })
                delete params.order_status;
            }
            const data = yield call(_queryOrder, params);
            if (data.error.ErrorCode != 0) return;
            yield put({
                type: 'saveData', data: {
                    count: data.count,
                    orders: data.orders,
                    products: data.products,
                    agents: data.agents,
                    ...params
                }
            })
        },
        * mark({ params, details }, { call, put, select }) {
            const data = yield call(_mark, params);
            if (data.error.ErrorCode != 0) return;
            message.success('备注成功');
            yield call(delay, 100);
            const order = yield select(state => state.orderAgent);
            const { page, limit, order_id, order_status } = order;
            yield put({ type: 'queryAmount' })
            yield put({ type: 'query', params: { page, limit, order_status } })
            if (order_id) yield put({ type: 'queryDetails', params: { order_id } })

        },
        * payment({ params, details }, { call, put, select }) {
            const data = yield call(_payment, params);
            if (data.error.ErrorCode != 0) return;
            message.success('审核成功');
            yield call(delay, 100);
            const order = yield select(state => state.orderAgent);
            const { page, limit, order_id, order_status } = order;
            yield put({ type: 'queryAmount' })
            yield put({ type: 'query', params: { page, limit, order_status } })
            if (order_id) yield put({ type: 'queryDetails', params: { order_id } })

        },
        * delivery({ params, details }, { call, put, select }) {
            const data = yield call(_delivery, params);
 
            if (data.error.ErrorCode != 0) return;
            message.success('发货成功');
            yield call(delay, 100);
            const order = yield select(state => state.orderAgent);
            const { page, limit, order_id, order_status } = order;
            yield put({ type: 'queryAmount' })
            yield put({ type: 'query', params: { page, limit, order_status } })
            if (order_id) yield put({ type: 'queryDetails', params: { order_id } })

        },
        * cancel({ params, details }, { call, put, select }) {
            const data = yield call(_cancel, params);
            if (data.error.ErrorCode != 0) return;
            message.success('取消成功');
            yield call(delay, 100);
            const order = yield select(state => state.orderAgent);
            const { page, limit, order_id, order_status } = order;
            yield put({ type: 'queryAmount' })
            yield put({ type: 'query', params: { page, limit, order_status } })
            if (order_id) yield put({ type: 'queryDetails', params: { order_id } })

        },
    },
    reducers: {
        saveData(state, { data }) {
            return { ...state, ...data }
        },
        saveAmount(state, { data }) {
            return { ...state, amount: { ...data } }
        }
    }
};
