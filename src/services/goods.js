import request from '../utils/fetch';
export async function _query(params) {
    return request('/admin/product/get', params);
}

export async function _add(params) {
    return request('/admin/product/create', params)
}
export async function _editor(params) {
    return request('/admin/product/update', params)
}

export async function _top(params) {
    return request('/admin/product/set_up', params)
}
export async function _bottom(params) {
    return request('/admin/product/set_down', params)
}

export async function _delete(params) {
    return request('/admin/product/delete', params)
}