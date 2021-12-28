import React, { useEffect, useState, useRef } from 'react';
import { Divider, Modal, Popconfirm, Card, Button, Input } from 'antd';
import styles from './index.less';
import { connect } from 'dva';
import Form from '../Form/capsuleProduct';
import { filterImageUrl } from '@/utils/utils';
import Table from '@/components/Table/SortTable';
const Com = props => {
    const columns = [
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
            dataIndex: 'size',
            key: 'size',
        },
        {
            title: '分类',
            valueType: 'option',
            render: (text, record, _, action) => {
                return record.goodCategory ? record.goodCategory.name : '';
            },
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
    const [data, setData] = useState(false);
    // const [visiblePreview, setVisiblePreview] = useState(null);

    const handleEdit = record => {
        // setVisible(true);
        setData(record);
    };

    const handleDelete = record => {
        props.dispatch({
            type: 'capsule/deleteCapsuleStyle',
            payload: {
                _id: record._id,
                type: 0,
            },
        });
    };

    useEffect(() => {
        //capsule/getCapsuleStyleList
        props.dispatch({
            type: 'capsule/getCapsuleStyleList',
            payload: {
                limit: 1000
            }
        });
    }, []);

    const handleSort = options => {
        props.dispatch({
            type: 'capsule/sortCapsuleStyle',
            payload: options,
        });
    };

    return (
        <>
            <Modal
                title="编辑胶囊款式"
                visible={Boolean(data)}
                width="960px"
                footer={null}
                destroyOnClose={true}
                onCancel={() => {
                    setData(false);
                    // handleClear();
                }}
            >
                <Form
                    ref={v => (formRef.current = v)}
                    editData={data}
                    onClose={() => {
                        setData(false);
                        // handleClear();
                    }}
                />
            </Modal>
            <Modal
                title="添加胶囊款式"
                visible={visible}
                width="960px"
                footer={null}
                destroyOnClose={true}
                onCancel={() => {
                    setVisible(false);
                    // handleClear();
                }}
            >
                <Form
                    ref={v => (formRef.current = v)}
                    onClose={() => {
                        setVisible(false);
                        // handleClear();
                    }}
                />
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
                    dataSource={props.currentCapsuleStyleList.docs}
                    pagination={{
                        total: props.currentCapsuleStyleList.total,
                        current: parseInt(props.currentCapsuleStyleList.page, 10),
                        pageSize: props.currentCapsuleStyleList.limit,
                        onChange: props.onPageChange,
                    }}
                    onMoveArray={handleSort} 
                />
            </Card>
        </>
    );
};

export default connect(({ capsule, loading }) => ({
    currentCapsuleStyleList: capsule.currentCapsuleStyleList,
    fetching: loading.effects['capsule/getCapsuleStyleList'],
}))(Com);
