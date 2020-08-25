import request from '@/utils/request';

export async function getList(data) {
    return request('/api/goods/getList', {
        method: 'get',
        params: data,
    });
}

export async function add(data) {
    return request('/api/goods/add', {
        method: 'post',
        data,
    });
}

export async function del(data) {
    return request('/api/goods/delete', {
        method: 'post',
        data,
    });
}

export async function update(data) {
    return request('/api/goods/update', {
        method: 'post',
        data,
    });
}

export async function sort(data) {
    return request('/api/goods/sort', {
        method: 'post',
        data,
    });
}
