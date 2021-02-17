import request from '@/utils/request';

export async function getAllCapsule(data) {
    return request('/api/capsule/getVisibleList', {
        method: 'get',
        params: data,
    });
}

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

export async function getCapsuleStyleList(data) {
    return request('/api/capsuleStyle/getList', {
        method: 'get',
        params: data,
    });
}

export async function addCapsuleStyle(data) {
    return request('/api/capsuleStyle/add', {
        method: 'post',
        data,
    });
}

export async function delCapsuleStyle(data) {
    return request('/api/capsuleStyle/delete', {
        method: 'post',
        data,
    });
}

export async function updateCapsuleStyle(data) {
    return request('/api/capsuleStyle/update', {
        method: 'post',
        data,
    });
}
// {/* <Icon type="copyright" /> */}
