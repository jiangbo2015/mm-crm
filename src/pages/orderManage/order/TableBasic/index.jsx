import React, { useEffect, useState, useRef } from 'react';
import { Table, Row, Col, Button, Input, Divider, Tag, Modal, Popconfirm } from 'antd';
import styles from './index.less';
import { connect } from 'dva';

const Com = props => {
    const columns = [
        {
            title: '订单编号',
            dataIndex: '_id',
            key: '_id',
        },
        {
            title: '用户名',
            dataIndex: 'name',
            key: 'name',
            render: (text, record) => {
                return record.user.name;
            },
        },
        {
            title: '金额',
            dataIndex: 'price',
            key: 'price',
            render: (text, record) => {
                let price = 0;
                record.orderData.map(x => (price += x.totalPrice));
                return price;
            },
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
                    <a href={`http://${location.hostname}:4000/download?_id=${record._id}`}>
                        订单文件
                    </a>
                </div>
            ),
        },
    ];

    const [styleNo, setStyleNo] = useState('');
    const [userName, setUserName] = useState('');

    const handleSearch = () => {
        props.getOrderList({
            styleNo,
            userName,
        });
    };

    return (
        <>
            <Row style={{ marginBottom: '20px' }}>
                <Col span="6">
                    <Input
                        addonBefore="订单号"
                        value={styleNo}
                        onChange={e => setStyleNo(e.target.value)}
                    />
                </Col>
                <Col span="2"></Col>
                <Col span="6">
                    <Input
                        addonBefore="下单人"
                        value={userName}
                        onChange={e => setUserName(e.target.value)}
                    />
                </Col>
                <Col span="2"></Col>
                <Col span="2">
                    <Button onClick={handleSearch} type="primary">
                        搜索
                    </Button>
                </Col>
            </Row>
            <Table columns={columns} dataSource={props.orderList} bordered />
        </>
    );
};

export default connect(({ order, loading }) => ({
    orderList: order.list,
    fetching: loading.effects['order/getList'],
}))(Com);
