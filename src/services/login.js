import request from '../utils/fetch';
export async function _login(params) {
    return request('/admin/login', params);
}
export async function _changePassword(params) {
    return request('/admin/change-passsword', params);
}