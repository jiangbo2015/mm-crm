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

export async function queryNotices({id}) {
    return request(`/api/v2/users/${id}/messages`);
}

export async function readMessage(id) {
    return request(`/api/v2//messages/${id}/read`, {
        method: 'patch',
    });
}

export async function download() {
    return request('/api/user/download');
}

export async function feedback(data) {
    return request('/api/user/feedback', {
        method: 'post',
        data,
    });
}

export async function changePwd(data) {
    return request('/api/user/changePwd', {
        method: 'post',
        data,
    });
}
    

