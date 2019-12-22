import request from '@/utils/request';

export async function updateSystem(data) {
    return request('/api/system/update', {
        method: 'post',
        data,
    });
}

export async function querySystem(data) {
    return request('/api/system/detail');
}
