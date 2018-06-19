import request from '../utils/fetch';

//--微信订单--
//查询订单
export async function _queryWx(params) {
    return request('/admin/wxorder/get', params);
}
//查询订单数目

export function _queryCountWx() {
    return request('/admin/wxorder/count')
}

// 卖家备注

export function _markWx(params) {
    return request('/admin/wxorder/update-mark', {
        order_id: params.order_id,
        mark: params.mark
    })
}

// 标记发货

export function _deliveryWx(params) {
    return request('/admin/wxorder/delivery-mark', {
        order_id: params.order_id,
        delivery: params.delivery,
        express_id: params.express_id
    })
}

// 取消订单

export function _cancelWx(params) {
    return request('/admin/wxorder/cancel', {
        order_id: params.order_id
    })
}



// 代理订单
// 查询订单
export function _queryOrder(params) {
    return request('/admin/order/get', params)
}

//查询订单数目

export function _queryCount() {
    return request('/admin/order/count')
}

// 打款审核

export function _payment(params) {
    return request('/admin/order/payment-verify', params)
}

// 卖家备注

export function _mark(params) {
    return request('/admin/order/update-mark', params)
}

// 标记发货

export function _delivery(params) {
    return request('/admin/order/delivery-mark', params)
}

// 取消订单

export function _cancel(params) {
    return request('/admin/order/cancel', params)
}
