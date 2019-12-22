import request from '@/utils/request';

export async function getList(data) {
    return request('/api/order/getList', {
        method: 'get',
        params: data,
    });
}
