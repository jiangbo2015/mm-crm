import request from '@/utils/request';

export async function getList(data) {
    return request('/api/order/getAllList', {
        method: 'get',
        params: data,
    });
}

export async function getCapsuleList(data) {
    return request('/api/capsuleOrder/getAllList', {
        method: 'get',
        params: data,
    });
}

export async function getShopList(data) {
    return request('/api/shopOrder/getAllList', {
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

export async function diyOrderDownload(data) {
    return request('/api/order/postDownload', {
        method: 'post',
        data,
    });
}

export async function shopOrderDownload(data) {
    return request('/api/shopOrder/postDownload', {
        method: 'post',
        data,
    });
}


export async function capsuleOrderDownload(data) {
    return request('/api/capsuleOrder/postDownload', {
        method: 'post',
        data,
    });
}