import request from '../utils/fetch';

export function _queryBanner() {
    return request('/admin/wxbanner/get');
}

export function _createBanner(params) {
    return request('/admin/wxbanner/create', params);
}

export function _updateBanner(params) {
    return request('/admin/wxbanner/update', params);
}

export function _deleteBanner(params) {
    return request('/admin/wxbanner/delete', params);
}



export function _queryArticle() {
    return request('/admin/wx_mp_media/select')
}
export function _articleUpdate(params) {
    return request('/admin/wx_mp_media/update', params)
}
export function _articleRefresh() {
    return request('/admin/wx_mp_media/refresh')
}
// 优惠卷
export function _queryCoupon() {
    return request('/admin/wx_coupon_origin/get')
}
export function _updateCoupon(params) {
    return request('/admin/wx_coupon_origin/update', params)
}
export function _createCoupon(params) {
    return request('/admin/wx_coupon_origin/create', params)
}
export function _updateRangeCoupon(params) {
    return request('/admin/wx_coupon_origin/update_target', params)
}

// 折扣
export function _queryDiscount() {
    return request('/admin/wxorder/discount-select')
}

export function _updateDiscount(params) {
    return request('/admin/wxorder/discount-update', params)
}

// 视频

export function _queryVideo(params) {

    return request('/admin/wxvideo/select', params)

}
export function _createVideo(params) {
    return request('/admin/wxvideo/create', params)
}
export function _deleteVideo(params) {
    return request('/admin/wxvideo/delete', params)
}
export function _updateVideo(params) {
    return request('/admin/wxvideo/enable', params)
}
