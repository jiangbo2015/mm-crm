import request from '@/utils/request';
import { api } from '@/utils/apiconfig';

export async function getList(data) {
    return request('/api/style/getList', {
        method: 'get',
        params: data,
    });
}

export async function add(data) {
    return request('/api/style/add', {
        method: 'post',
        data,
    });
}

export async function del(data) {
    return request('/api/style/delete', {
        method: 'post',
        data,
    });
}

export async function detail(data) {
    return request('/api/style/detail', {
        method: 'get',
        params: data,
    });
}

export async function update(data) {
    return request('/api/style/update', {
        method: 'post',
        data,
    });
}

export async function updateArr(data) {
    return request('/api/style/updateAttr', {
        method: 'post',
        data,
    });
}

export async function getSvgText(url) {
    console.log(url);
    return request('/' + url, {
        method: 'get',
    });
}

// color
export async function colorList(data) {
    return request('/api/color/getList', {
        method: 'get',
        params: data,
    });
}

export async function colorAdd(data) {
    return request('/api/color/add', {
        method: 'post',
        data,
    });
}

export async function colorUpdate(data) {
    return request('/api/color/update', {
        method: 'post',
        data,
    });
}

export async function colorDel(data) {
    return request('/api/color/delete', {
        method: 'post',
        data,
    });
}
