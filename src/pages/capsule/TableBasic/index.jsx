import React, { useEffect, useState, useRef } from 'react';
import { Table, Divider, Modal, Popconfirm, Row, Col, Input } from 'antd';
import styles from './index.less';
import { connect } from 'dva';
import Form from '../Form';
import CapsuleProduct from './capsuleProduct';
import { filterImageUrl } from '@/utils/utils';

const Com = props => {
    const columns = [
        {
            title: '封面图',
            dataIndex: 'covermap',
            key: 'covermap',
            render: url => (
                <img
                    style={{
                        maxWidth: '100px',
                        maxHeight: '100px',
                    }}
                    src={filterImageUrl(url)}
                />
            ),
        },
        {
            title: '中文名',
            dataIndex: 'namecn',
            key: 'namecn',
        },
        {
            title: '英文名',
            dataIndex: 'nameen',
            key: 'nameen',
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
                    {/* <a onClick={e => handleEdit(record)}>编辑</a>*/}
                    <a onClick={() => handleManageStyle(record)}>款式管理</a>
                    <Divider type="vertical" />
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
            type: 'capsule/setCurrentCapsule',
            payload: record,
        });
    };
    const handleManageStyle = record => {
        setVisiblePreview(record);
        props.dispatch({
            type: 'capsule/setCurrentCapsule',
            payload: record,
        });
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
                // visible={true}
                destroyOnClose={true}
                width="1000px"
                footer={null}
                onCancel={() => {
                    setVisiblePreview(null);
                }}
            >
                <CapsuleProduct />
            </Modal>
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
        </>
    );
};

export default connect(({ capsule, loading }) => ({
    capsuleList: capsule.list,
    fetching: loading.effects['capsule/getList'],
}))(Com);
