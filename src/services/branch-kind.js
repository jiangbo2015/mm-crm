import request from '@/utils/request';

export async function getBranchKindList(data) {
    return request('/api/branchKind/getList', {
        method: 'get',
        params: data,
    });
}

export async function add(data) {
    return request('/api/branchKind/add', {
        method: 'post',
        data,
    });
}

export async function del(data) {
    return request('/api/branchKind/delete', {
        method: 'post',
        data,
    });
}

export async function update(data) {
    return request('/api/branchKind/update', {
        method: 'post',
        data,
    });
}
