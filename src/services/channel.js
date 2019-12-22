import request from '@/utils/request';

export async function getList(data) {
    return request('/api/channel/getList', {
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
