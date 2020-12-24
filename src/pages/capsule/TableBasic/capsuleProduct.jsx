import React, { useEffect, useState, useRef } from 'react';
import { Table, Divider, Modal, Popconfirm, Card, Button, Input } from 'antd';
import styles from './index.less';
import { connect } from 'dva';
import Form from '../Form/capsuleProduct';
import { filterImageUrl } from '@/utils/utils';

const Com = props => {
    const columns = [
        // {
        //     title: '产品',
        //     dataIndex: 'covermap',
        //     key: 'covermap',
        //     render: url => <img width="100px" src={filterImageUrl(url)} />,
        // },
        {
            title: '编号',
            dataIndex: 'code',
            key: 'code',
        },
        {
            title: '单价',
            dataIndex: 'price',
            key: 'price',
        },
        {
            title: '尺码段',
            dataIndex: 'sizeList',
            key: 'sizeList',
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
    const [visible, setVisible] = useState(visible);
    const [data, setData] = useState({});
    const [visiblePreview, setVisiblePreview] = useState(null);

    const handleEdit = record => {
        setVisible(true);
        setData(record);
    };

    const handleDelete = record => {
        props.dispatch({
            type: 'capsule/delete',
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
                width="800px"
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
            <Modal
                title={visiblePreview ? `${visiblePreview.namecn}-款式管理` : ''}
                visible={Boolean(visiblePreview)}
                width="1000px"
                footer={null}
                onCancel={() => {
                    setVisiblePreview(null);
                }}
            >
                <div style={{ display: 'flex', justifyContent: 'center' }}>
                    <div
                        style={{
                            width: '200px',
                            height: '200px',
                            background: visiblePreview && visiblePreview.value,
                        }}
                    />
                </div>
            </Modal>
            <Card
                title="款式列表"
                extra={
                    <Button
                        type="primary"
                        onClick={() => {
                            setVisible(true);
                        }}
                    >
                        添加
                    </Button>
                }
            >
                <Table
                    rowKey={record => record._id}
                    columns={columns}
                    loading={props.fetching}
                    dataSource={props.capsuleList.docs}
                    pagination={{
                        total: props.capsuleList.total,
                        current: parseInt(props.capsuleList.page, 10),
                        pageSize: props.capsuleList.limit,
                        onChange: props.onPageChange,
                    }}
                />
            </Card>
        </>
    );
};

export default connect(({ capsule, loading }) => ({
    capsuleList: capsule.list,
    fetching: loading.effects['capsule/getList'],
}))(Com);
