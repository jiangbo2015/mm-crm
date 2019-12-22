import request from '@/utils/request';

export async function getSizeList(data) {
    return request('/api/goodsbase/size/getList', {
        method: 'get',
        params: data,
    });
}

export async function add(data) {
    return request('/api/goodsbase/size/add', {
        method: 'post',
        data,
    });
}

export async function del(data) {
    return request('/api/goodsbase/size/delete', {
        method: 'post',
        data,
    });
}

export async function update(data) {
    return request('/api/goodsbase/size/update', {
        method: 'post',
        data,
    });
}
