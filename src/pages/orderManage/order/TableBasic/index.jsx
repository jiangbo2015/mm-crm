import React, { useState, useRef } from 'react';
import { Table, Row, Col, Button, Input, Select, Tag, Modal, Popconfirm } from 'antd';
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
            render: (text, record) => {
                if (record.user) {
                    return record.user.name;
                } else {
                    return '无效用户';
                }
            },
        },
        {
            title: '金额/¥',
            dataIndex: 'sumPrice',
            key: 'sumPrice',
        },
        {
            title: '时间',
            dataIndex: 'date',
            key: 'date',
        },

        {
            title: '操作',
            dataIndex: 'action',
            key: 'action',
            render: (text, record) => (
                <div>
                    <Popconfirm
                        title="确认要删除吗"
                        onConfirm={() => handleDelete(record)}
                        okText="是"
                        cancelText="否"
                    >
                        <a>删除</a>
                    </Popconfirm>
                    <a
                        style={{ marginLeft: '10px' }}
                        // href={
                        //     location.hostname.indexOf('we-idesign') >= 0
                        //         ? `http://we-idesign.com/download?id=${record._id}`
                        //         : `http://${location.hostname}:4000/download?id=${record._id}`
                        // }
                        onClick={() => {
                            props.getOrderDownLoadUrl({ _id: record._id });
                        }}
                    >
                        订单文件
                    </a>
                </div>
            ),
        },
    ];

    const [orderType, setOrderType] = useState('order');
    const [styleNo, setStyleNo] = useState('');
    const [userName, setUserName] = useState('');

    const handleSearch = () => {
        props.getOrderList({
            styleNo,
            userName,
            orderType,
        });
    };

    const handleDelete = record => {
        props.dispatch({
            type: 'order/del',
            payload: {
                _id: record._id,
            },
        });
    };

    return (
        <>
            <Row style={{ marginBottom: '20px' }}>
                <Col span="5">
                    <Select
                        style={{ width: 160 }}
                        options={[
                            { label: '定制', value: 'order' },
                            { label: '胶囊', value: 'capsule' },
                            { label: '网店', value: 'shop' },
                        ]}
                        value={orderType}
                        onChange={val => setOrderType(val)}
                    />
                </Col>
                <Col span="5">
                    <Input
                        addonBefore="订单号"
                        value={styleNo}
                        onChange={e => setStyleNo(e.target.value)}
                    />
                </Col>
                <Col span="2"></Col>
                <Col span="5">
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
            <Table
                rowKey={record => record._id}
                columns={columns}
                dataSource={props.orderList}
                bordered
            />
        </>
    );
};

export default connect(({ order, loading }) => ({
    orderList: order.list,
    fetching: loading.effects['order/getList'],
}))(Com);
