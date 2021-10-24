import request from '@/utils/request';

export async function getBranchList(data) {
    return request('/api/branch/getVisibleList', {
        method: 'get',
        params: data,
    });
}

export async function  getBranchAll(data) {
    return request('/api/branch/getList', {
        method: 'get',
        params: data,
    });
}

export async function add(data) {
    return request('/api/branch/add', {
        method: 'post',
        data,
    });
}

export async function del(data) {
    return request('/api/branch/delete', {
        method: 'post',
        data,
    });
}

export async function update(data) {
    return request('/api/branch/update', {
        method: 'post',
        data,
    });
}
