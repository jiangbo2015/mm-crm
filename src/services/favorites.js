import request from '@/utils/request';

export async function getList(data) {
    return request('/api/v2/favorites', {
        method: 'get',
        params: data,
    });
}

export async function add(data) {
    return request('/api/v2/favorites', {
        method: 'post',
        data,
    });
}

export async function del(id) {
    return request(`/api/v2/favorites/${id}`, {
        method: 'delete'
    });
}

