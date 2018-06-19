import { _query, _add, _editor, _bottom, _top, _delete } from '../services/goods';
import { message } from 'antd'
import { routerRedux } from 'dva/router'
import { delay } from '../utils/utils'
export default {
    namespace: 'goods',
    state: {
        count: 0,
        product: [],
        current: 1,
        status: '0',
        showProduct: []
    },

    effects: {
        *query({ payload }, { call, put }) {
            const data = yield call(_query, payload);
            yield put({
                type: 'queryList',
                data: {
                    product: data.product,
                    count: data.count
                },
            });
        },
        *add({ params }, { call, put }) {
            const data = yield call(_add, params);
            if (data.error.ErrorCode != 0) return;
            message.success('添加成功');
            // yield call(delay, 300)
            yield put(routerRedux.push('/goods/product/list'))

        },
        *editor({ params }, { call, put }) {
            const data = yield call(_editor, params);
            if (data.error.ErrorCode != 0) return;
            message.success('修改成功');
            // yield call(delay, 300)
            yield put(routerRedux.push('/goods/product/list'))
        },
        *delete({ params }, { call, put }) {
            const data = yield call(_delete, params);
            if (data.error.ErrorCode != 0) return;
            message.success('下架成功');
            yield put({type:'query'})
        },
        *top({ params }, { call, put }) {
            const data = yield call(_top, params);
            if (data.error.ErrorCode != 0) return;
            message.success('操作成功');
            yield put({type:'query'})
        },
        *bottom({ params }, { call, put }) {
            const data = yield call(_bottom, params);
            if (data.error.ErrorCode != 0) return;
            message.success('操作成功');
            yield put({type:'query'})
        }
    },

    reducers: {
        queryList(state, { data }) {
            const status = state.state;
            return {
                ...state,
                ...data,
                showProduct: data.product
            };
        },
        changePage(state, { page }) {
            return { ...state, current: page }
        },
        changeStatus(state, { status }) {
            if (state.status == status) return;
            const showProduct = status == 0 ? state.product : state.product.filter(item => item.product_status == status);
            const count = showProduct.length
            return { ...state, status: status, showProduct: showProduct, count: count, current: 1 }
        }
    },
};
