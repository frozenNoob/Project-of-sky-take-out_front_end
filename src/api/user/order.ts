import request from '@/utils/request_user'

export const orderSubmit = (data) =>
    request({
        'url': '/order/submit',
        'method': 'post',
        data
    });
export const lookHistoryOrders = (params) =>
    request({
        'url': '/order/historyOrders',
        'method': 'get',
        'params': params
    });
export const lookOrderDetail = (id) =>
    request({
        'url': `/order/orderDetail/${id}`,
        'method': 'get',
    });
export const remindOrder = (id) =>
    request({
        'url': `/order/reminder/${id}`,
        'method': 'get',
    });
