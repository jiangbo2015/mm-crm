import request from '@/utils/request';

export async function getRecordList(data) {
    return request('/api/v2/changeLogs/getChangeLogs', {
        method: 'get',
        params: data,
    });
}