import request from '@/utils/request';

export async function getList(data) {
    return request('/api/user/getList', {
        method: 'get',
        params: data,
    });
}

export async function add(data) {
    return request('/api/user/add', {
        method: 'post',
        data,
    });
}

export async function del(data) {
    return request('/api/user/delete', {
        method: 'post',
        data,
    });
}

export async function update(data) {
    return request('/api/user/update', {
        method: 'post',
        data,
    });
}

export async function queryCurrent() {
    return request('/api/user/getCurrentUser');
}

export async function queryNotices() {
    return request('/api/notices');
}

export async function download() {
    return request('/api/user/download');
}
