import request from '@/utils/request';



export async function getCapsuleById(data) {
    return request('/api/capsule/findById', {
        method: 'get',
        params: data,
    });
}

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

export async function getCapsuleItemList(data) {
    return request('/api/capsuleItem/getList', {
        method: 'get',
        params: data,
    });
}

export async function addCapsuleItem(data) {
    return request('/api/capsuleItem/add', {
        method: 'post',
        data,
    });
}

export async function delCapsuleItem(data) {
    return request('/api/capsuleItem/delete', {
        method: 'post',
        data,
    });
}

export async function updateCapsuleItem(data) {
    return request('/api/capsuleItem/update', {
        method: 'post',
        data,
    });
}

export async function sortCapsuleItem(data) {
    return request('/api/capsuleItem/sort', {
        method: 'post',
        data,
    });
}

export async function applyForPublication(data) {
    return request('/api/capsule/applyForPublication', {
        method: 'post',
        data,
    });
}


