import request from '../utils/fetch';

export async function _query(params) {
    return request('/admin/wx_member/select', params)
}

export async function _review(params) {
    return request('/admin/wx_member/review', params)
}

export async function _mark(params) {
    return request('/admin/wx_member/mark', params)
}