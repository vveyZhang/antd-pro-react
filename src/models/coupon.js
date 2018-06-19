
import { _queryCoupon, _updateCoupon, _createCoupon, _updateRangeCoupon, _queryDiscount, _updateDiscount } from '../services/wxManage';
import { message } from 'antd'

export default {
    namespace: 'coupon',

    state: {
        origins: [],
        staffDiscount: {
            id: null,
            items: []
        }
    },

    effects: {
        *query({ params }, { call, put }) {
            const data = yield call(_queryCoupon);
            const discountData = yield call(_queryDiscount);
            if (data.error.ErrorCode != 0) return;
            if (discountData.error.ErrorCode != 0) return;
            yield put({
                type: 'saveData', data: {
                    origins: data.origins,
                    staffDiscount: { ...discountData.config }
                }
            })
        },
        *updateDiscount({ params }, { call, put }) {
            const data = yield call(_updateDiscount, params);
            if (data.error.ErrorCode != 0) return;
            message.success('设置成功')
            yield put({ type: 'query' })
        },
        *update({ params }, { call, put }) {
            const data = yield call(_updateCoupon, params);
            if (data.error.ErrorCode != 0) return;
            message.success('操作成功')
            yield put({ type: 'query' })
        },
        *create({ params }, { call, put }) {
            const data = yield call(_createCoupon, params);
            if (data.error.ErrorCode != 0) return;
            message.success('添加成功')
            yield put({ type: 'query' })
        },
        *updateRangeCoupon({ params }, { call, put }) {
            const data = yield call(_updateRangeCoupon, params);
            if (data.error.ErrorCode != 0) return;
            message.success('修改成功')
            yield put({ type: 'query' })
        },
    },

    reducers: {
        saveData(state, { data }) {
            return { ...state, ...data }
        }
    },

    subscriptions: {
    }
};
