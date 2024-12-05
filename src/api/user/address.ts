import request from '@/utils/request_user'
// 查看地址
export const lookAddress = () =>
    request({
        // /user/addressBook/list
        'url': '/addressBook/list',
        'method': 'get',
    });
export default lookAddress;
// 根据ID查看地址
export const lookAddressById = (id) =>
    request({
        'url': `/addressBook/${id}`,
        'method': 'get',
    });
// 新增地址
export const addAddress = (data) =>
    request({
        'url': '/addressBook',
        'method': 'post',
        data
    });
// 删除地址
export const deleteAddress = (id) =>
    request({
        'url': `/addressBook`,
        'method': 'delete',
        'params': {
            'id': id
        }
    });
// 更新地址
export const updateAddress = (data) =>
    request({
        'url': '/addressBook',
        'method': 'put',
        data
    });
// 设置为默认地址
export const setDefaultAddress = (data) =>
    request({
        'url': '/addressBook/default',
        'method': 'put',
        data
    })
// 查询默认地址
export const lookDefaultAddress = () =>
    request({
        'url': '/addressBook/default',
        'method': 'get',
    })
