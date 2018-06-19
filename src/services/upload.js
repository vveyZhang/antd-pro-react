import request from '../utils/fetch';

export function uploadBase(params) {
    request('/uploadbase64', params)
}