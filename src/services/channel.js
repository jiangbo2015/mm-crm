import request from '@/utils/request';

export async function getList(data) {
    return request('/api/channel/getMyAdminList', {
        method: 'get',
        params: data,
    });
}

export async function getAllList(data) {
    return request('/api/channel/getList', {
        method: 'get',
        params: data,
    });
}

export async function findById(data) {
    return request('/api/channel/findById', {
        method: 'get',
        params: data,
    });
}

export async function add(data) {
    return request('/api/channel/add', {
        method: 'post',
        data,
    });
}

export async function del(data) {
    return request('/api/channel/delete', {
        method: 'post',
        data,
    });
}

export async function update(data) {
    return request('/api/channel/update', {
        method: 'post',
        data,
    });
}

export async function updateCostomers(data) {
    return request('/api/channel/updateCostomers', {
        method: 'post',
        data,
    });
}
