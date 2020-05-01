import React, { useEffect, useState, useRef } from 'react';
import { Table, Divider, Modal, Popconfirm, Row, Col, Input } from 'antd';
import styles from './index.less';
import { connect } from 'dva';
import Form from '../From';
import { api } from '@/utils/apiconfig';

const Com = props => {
    const columns = [
        {
            title: '色块',
            dataIndex: 'value',
            key: 'value',
            render: (val, obj) => (
                <div
                    className={styles.color}
                    style={{ background: obj.type === 1 ? `url(${api}/${val})` : val }}
                />
            ),
        },
        {
            title: '编码',
            dataIndex: 'code',
            key: 'code',
            // render: (val) => (<div className={styles.color} style={{background: val}}></div>)
        },
        {
            title: '色值',
            dataIndex: 'value',
            key: 'value',
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
            title: '操作',
            dataIndex: 'action',
            key: 'action',
            render: (text, record) => (
                <div>
                    {/* <a onClick={e => handleEdit(record)}>编辑</a>
                    <Divider type="vertical" /> */}
                    <Popconfirm
                        title="确认要删除吗"
                        onConfirm={() => handleDelete(record)}
                        okText="是"
                        cancelText="否"
                    >
                        <a href="#">删除</a>
                    </Popconfirm>
                    <a style={{ marginLeft: '5px' }} href="#" onClick={() => handleEdit(record)}>
                        编辑
                    </a>
                </div>
            ),
        },
    ];
    const formRef = useRef();
    const [visible, setVisible] = useState(false);
    const [data, setData] = useState({});

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
                    type: 'style/update',
                    payload: {
                        _id: data._id,
                        ...values,
                    },
                });
            }
        });
    };

    const doSet = () => {
        console.log('doSet');
        setTimeout(() => {
            console.log(formRef);
            if (formRef && formRef.current) {
                formRef.current.setFieldsValue({
                    code: data.code,
                    value: data.value,
                });
            } else {
                doSet();
            }
        }, 500);
    };

    useEffect(() => {
        if (visible) {
            doSet();
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

    const onPageChange = page => {
        props.dispatch({
            type: 'style/getColorList',
            payload: {
                page,
                limit: props.colorList.limit,
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
                onOk={() => {
                    handleUpdate();
                    // handleClear();
                }}
                onCancel={() => {
                    setVisible(false);
                    // handleClear();
                }}
            >
                <Form ref={v => (formRef.current = v)} />
            </Modal>

            <Table
                columns={columns}
                dataSource={props.colorList.docs}
                pagination={{
                    total: props.colorList.total,
                    current: props.colorList.page,
                    pageSize: props.colorList.limit,
                    onChange: onPageChange,
                }}
            />
        </>
    );
};

export default connect(({ style }) => ({
    colorList: style.colorList,
}))(Com);
