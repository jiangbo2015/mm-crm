import React, { useEffect, useState, useRef } from 'react';
import { Table, Divider, Tag, Modal, Popconfirm } from 'antd';
import styles from './index.less';
import { connect } from 'dva';

const Com = props => {
    const columns = [
        {
            title: '订单编号',
            dataIndex: 'orderNo',
            key: 'orderNo',
        },
        {
            title: '用户名',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: '金额',
            dataIndex: 'price',
            key: 'price',
        },
        {
            title: '时间',
            dataIndex: 'createTime',
            key: 'createTime',
        },

        {
            title: '操作',
            dataIndex: 'action',
            key: 'action',
            render: (text, record) => (
                <div>
                    <a>订单文件</a>
                </div>
            ),
        },
    ];

    return (
        <>
            <Table columns={columns} dataSource={props.orderList} />
        </>
    );
};

export default connect(({ goods, loading }) => ({
    orderList: goods.list,
    fetching: loading.effects['order/getList'],
}))(Com);
