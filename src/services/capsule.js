import request from '@/utils/request';

export async function getList(data) {
    return request('/api/capsule/getList', {
        method: 'get',
        params: data,
    });
}

export async function add(data) {
    return request('/api/capsule/add', {
        method: 'post',
        data,
    });
}

export async function del(data) {
    return request('/api/capsule/delete', {
        method: 'post',
        data,
    });
}

export async function update(data) {
    return request('/api/capsule/update', {
        method: 'post',
        data,
    });
}
// {/* <Icon type="copyright" /> */}