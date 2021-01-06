import React, { useEffect, useState, useRef } from 'react';
import { Table, Divider, Modal, Popconfirm, Row, Col, Input } from 'antd';
import styles from './index.less';
import { connect } from 'dva';
import Form from '../Form';
import { filterImageUrl } from '@/utils/utils';

const Com = props => {
    const columns = [
        {
            title: '编号',
            dataIndex: 'code',
            key: 'code',
            // render: url => <img width="100px" src={filterImageUrl(url)} />,
        },
        {
            title: '中包数',
            dataIndex: 'bagsNum',
            key: 'bagsNum',
        },
        {
            title: '装箱数',
            dataIndex: 'caseNum',
            key: 'caseNum',
        },
        {
            title: '单价',
            dataIndex: 'price',
            key: 'price',
        },
        {
            title: '总数量',
            dataIndex: 'total',
            key: 'total',
        },
        {
            title: '状态',
            dataIndex: 'status',
            key: 'status',
            // render: (val) => (<div className={styles.color} style={{background: val}}></div>)
        },
        {
            title: '创建日期',
            dataIndex: 'create_time',
            key: 'create_time',
            // render: (val) => (<div className={styles.color} style={{background: val}}></div>)
        },
        {
            title: '操作',
            dataIndex: 'action',
            key: 'action',
            render: (text, record) => (
                <div>
                    <a onClick={() => handleEdit(record)}>编辑</a>
                    <Divider type="vertical" />
                    <Popconfirm
                        title="确认要删除吗"
                        onConfirm={() => handleDelete(record)}
                        okText="是"
                        cancelText="否"
                    >
                        <a>删除</a>
                    </Popconfirm>
                </div>
            ),
        },
    ];
    const formRef = useRef();
    const [visible, setVisible] = useState(false);
    const [data, setData] = useState({});
    const [visiblePreview, setVisiblePreview] = useState(null);

    const handleEdit = record => {
        setVisible(true);
        setData(record);
        props.dispatch({
            type: 'shop/setCurrentShopStyle',
            payload: record,
        });
    };

    const handleDelete = record => {
        props.dispatch({
            type: 'shop/deleteShopStyle',
            payload: {
                _id: record._id,
                type: 0,
            },
        });
    };

    return (
        <>
            <Modal
                title="编辑"
                visible={visible}
                width="1100px"
                footer={null}
                destroyOnClose={true}
                onCancel={() => {
                    setVisible(false);
                    // handleClear();
                }}
            >
                <Form
                    ref={v => (formRef.current = v)}
                    editData={data}
                    onClose={() => {
                        setVisible(false);
                        // handleClear();
                    }}
                />
            </Modal>
            <Table
                rowKey={record => record._id}
                columns={columns}
                loading={props.fetching}
                dataSource={props.styleList.docs}
                pagination={{
                    total: props.styleList.total,
                    current: parseInt(props.styleList.page, 10),
                    pageSize: props.styleList.limit,
                    onChange: props.onPageChange,
                }}
            />
        </>
    );
};

export default connect(({ shop, loading }) => ({
    styleList: shop.currentShopStyleList,
    fetching: loading.effects['shop/getShopStyleList'],
}))(Com);
