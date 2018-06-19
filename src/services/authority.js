import request from '../utils/fetch';


export function _query() {
    return request('/admin/permit/select')
}

export function _add(params) {
    return request('/admin/permit/create', params)
}
export function _editor(params) {
    return request('/admin/permit/update', params)
}