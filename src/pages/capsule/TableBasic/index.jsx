import React, { useEffect, useState, useRef } from 'react';
import { Table, Divider, Modal, Popconfirm, Row, Col, Input } from 'antd';
import styles from './index.less';
import { connect } from 'dva';
import { history } from 'umi';
import Form from '../Form';
import CapsuleProduct from './capsuleProduct';
import { filterImageUrl } from '@/utils/utils';

const PENDING_MAP = {
    draft: '默认状态',
    pending: '申请发布中',
    published: '已发布'
}

const Com = props => {
    const columns = [
        // {
        //     title: '封面图',
        //     dataIndex: 'covermap',
        //     key: 'covermap',
        //     render: url =>
        //         url ? (
        //             <img
        //                 style={{
        //                     maxWidth: '100px',
        //                     maxHeight: '100px',
        //                 }}
        //                 src={filterImageUrl(url)}
        //             />
        //         ) : (
        //             '未设置'
        //         ),
        // },
        {
            title: '名称',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: '状态',
            dataIndex: 'status',
            key: 'status',
            render: d => PENDING_MAP[d]
        },
        {
            title: '创建日期',
            dataIndex: 'createdAt',
            key: 'createdAt',
            render: (val) => (<div>{val.slice(0,10)}</div>)
        },
        {
            title: '操作',
            dataIndex: 'action',
            key: 'action',
            render: (text, record) => (
                <div>
                    <a onClick={() => {
                        history.push(`/diy/${record?._id}`)
                    }}>查看</a>
                    <Divider type="vertical" />
                    {
                        record.status === 'pending' && (
                            <Popconfirm
                                title="确认要通过吗"
                                onConfirm={() => handleApprove(record)}
                                okText="是"
                                cancelText="否"
                            >
                                <a>通过</a>
                            </Popconfirm>
                        )
                    }
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
    const handleApprove = record => {
        props.dispatch({
            type: 'capsule/update',
            payload: {
                _id: record._id,
                status: 'published',
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
