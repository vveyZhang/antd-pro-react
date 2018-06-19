import request from '../utils/fetch';

export function queryWx(params) {
    return request('/admin/wxorder/group', params)
}