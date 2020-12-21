import React, { useEffect, useState, useRef } from 'react';
import { Table, Divider, Modal, Popconfirm, Row, Col, Input } from 'antd';
import styles from './index.less';
import { connect } from 'dva';
import Form from '../Form';
import { getGoodsParamsToValue } from '@/utils/utils';

const Com = props => {
    const columns = [
        {
            title: '封面图',
            dataIndex: 'covermap',
            key: 'covermap',
            render: url => <img width="100" src={url} />,
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

                    <a onClick={() => handleEdit(record)}>编辑</a>
                    <Divider type="vertical" />
                    <a onClick={() => setVisiblePreview(record)}>预览</a>
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
    };

    const handleUpdate = () => {
        formRef.current.validateFields((err, values) => {
            if (!err) {
                setVisible(false);
                const { currentSize } = props;
                props.dispatch({
                    type: 'color/update',
                    payload: {
                        _id: data._id,
                        ...values,
                    },
                });
            }
        });
    };

    useEffect(() => {
        if (visible) {
            setTimeout(() => {
                if (formRef && formRef.current) {
                    // let goods = getGoodsParamsToValue(data.goodsId, data.categoryId);
                    formRef.current.setFieldsValue({
                        code: data.code,
                        value: data.value,
                        namecn: data.namecn,
                        nameen: data.nameen,
                        goodsId: data.goodsId,
                        // ...goods,
                    });
                }
            }, 100);
        }
    }, [visible]);

    const handleDelete = record => {
        props.dispatch({
            type: 'style/deleteColor',
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
                onOk={() => {
                    handleUpdate();
                    // handleClear();
                }}
                onCancel={() => {
                    setVisible(false);
                    // handleClear();
                }}
            >
                <Form ref={v => (formRef.current = v)} colorId={data._id} updateColor={true} />
            </Modal>
            <Modal
                title="预览"
                visible={Boolean(visiblePreview)}
                width="400px"
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
