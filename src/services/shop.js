import request from '@/utils/request';

export async function getBranchList(data) {
    return request('/api/branch/getList', {
        method: 'get',
        params: data,
    });
}

// export async function getList(data) {
//     return request('/api/capsule/getList', {
//         method: 'get',
//         params: data,
//     });
// }

// export async function add(data) {
//     return request('/api/capsule/add', {
//         method: 'post',
//         data,
//     });
// }

// export async function del(data) {
//     return request('/api/capsule/delete', {
//         method: 'post',
//         data,
//     });
// }

// export async function update(data) {
//     return request('/api/capsule/update', {
//         method: 'post',
//         data,
//     });
// }

export async function getShopStyleList(data) {
    return request('/api/shopStyle/getList', {
        method: 'get',
        params: data,
    });
}

export async function addShopStyle(data) {
    return request('/api/shopStyle/add', {
        method: 'post',
        data,
    });
}

export async function delShopStyle(data) {
    return request('/api/shopStyle/delete', {
        method: 'post',
        data,
    });
}

export async function updateShopStyle(data) {
    return request('/api/shopStyle/update', {
        method: 'post',
        data,
    });
}
// {/* <Icon type="copyright" /> */}
