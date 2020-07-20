import request from '@/utils/request';

export async function getList(data) {
    return request('/api/order/getAllList', {
        method: 'get',
        params: data,
    });
}

export async function del(data) {
    return request('/api/order/delete', {
        method: 'post',
        data,
    });
}

export async function orderDownload(data) {
    return request('/api/order/download', {
        method: 'get',
        params: data,
    });
}
