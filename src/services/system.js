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

export async function getHelpFiles(data) {
    return request('/api/system/getHelpFiles');
}

export async function addHelpFile(data) {
    return request('/api/system/addHelpFile', {
        method: 'post',
        data,
    });
}

export async function deleteHelpfile(data) {
    return request('/api/system/deleteHelpfile', {
        method: 'post',
        data,
    });
}
