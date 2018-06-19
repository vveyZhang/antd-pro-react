import { _queryWx, _queryCountWx, _markWx, _deliveryWx, _cancelWx, } from '../services/order';
import { message } from 'antd'
import { delay } from '../utils/utils'
export default {
    namespace: 'orderWx',
    state: {
        order_status: '0',
        page: 1,
        count: 0,
        limit: 5,
        orders: [],
        products: [],
        order_id: null,
        amount: {
            0: 0, 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0
        },
        orderDetails: {
            orders: [],
            products: []
        }
    },

    effects: {
        *queryAmount({ params }, { call, put }) {
            const data = yield call(_queryCountWx);
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
            const data = yield call(_queryWx, params);
            if (data.error.ErrorCode != 0) return;
            yield put({
                type: 'saveData', data: {
                    order_id: params.order_id,
                    orderDetails: {
                        orders: data.orders,
                        products: data.products
                    }
                }
            })
        },
        *query({ params }, { call, put }) {
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
            const data = yield call(_queryWx, params);
            if (data.error.ErrorCode != 0) return;
            yield put({
                type: 'saveData', data: {
                    count: data.count,
                    orders: data.orders,
                    products: data.products,
                    ...params
                }
            })
        },
        *mark({ params }, { call, put, select }) {
            const data = yield call(_markWx, params);
            if (data.error.ErrorCode != 0) return;
            message.success('备注成功');
            yield call(delay, 100);
            const order = yield select(state => state.orderWx);
            const { page, limit, order_id, order_status } = order;

            yield put({ type: 'queryAmount' })
            yield put({ type: 'query', params: { page, limit, order_status } })
            if (order_id) yield put({ type: 'queryDetails', params: { order_id } })
        },
        *delivery({ params, details }, { call, put, select }) {
            const data = yield call(_deliveryWx, params);
            if (data.error.ErrorCode != 0) return;
            message.success('发货成功');
            yield call(delay, 100);
            const order = yield select(state => state.orderWx);
            const { page, limit, order_id, order_status } = order;
            yield put({ type: 'queryAmount' })
            yield put({ type: 'query', params: { page, limit, order_status } })
            if (order_id) yield put({ type: 'queryDetails', params: { order_id } })
        },
        *cancel({ params, details }, { call, put, select }) {
            const data = yield call(_cancelWx, params);
            if (data.error.ErrorCode != 0) return;
            message.success('取消成功');
            yield call(delay, 100);
            const order = yield select(state => state.orderWx);
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
        saveDtails(state, { data }) {
            return { ...state, ...data }
        },
        saveAmount(state, { data }) {
            return { ...state, amount: { ...data } }
        }
    }
};
