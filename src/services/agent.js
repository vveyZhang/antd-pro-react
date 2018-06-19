import request from '../utils/fetch';

export async function _queryAgent(params) {
    return request('/admin/agent/get', params)
}
export async function _queryCount() {
    return request('/admin/agent/count')
} 