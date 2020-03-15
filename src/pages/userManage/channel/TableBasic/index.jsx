import React, { useEffect, useState, useRef } from 'react';
import { Table, Divider, Tag, Modal, Popconfirm } from 'antd';
import styles from './index.less';
import { connect } from 'dva';
import Form from '../Form';

const currencys = {
    0: '人民币',
    1: '美元',
    2: '欧元',
};

const Com = props => {
    const columns = [
        {
            title: '通道编号',
            dataIndex: 'code',
            key: 'code',
        },
        {
            title: '名字',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: '货币',
            dataIndex: 'currency',
            key: 'currency',
            render: (text, record) => currencys[record.currency],
        },

        {
            title: '操作',
            dataIndex: 'action',
            key: 'action',
            render: (text, record) => (
                <div>
                    <a onClick={e => handleEdit(record)}>编辑</a>
                    <Divider type="vertical" />
                    <Popconfirm
                        title="确认要删除吗"
                        onConfirm={() => handleDelete(record)}
                        okText="是"
                        cancelText="否"
                    >
                        <a href="#">删除</a>
                    </Popconfirm>
                </div>
            ),
        },
    ];
    const formRef = useRef();
    const [visible, setVisible] = useState(false);
    const [data, setData] = useState({});

    const handleUpdate = () => {
        formRef.current.validateFields((err, values) => {
            if (!err) {
                setVisible(false);
                props.dispatch({
                    type: 'channel/update',
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
                console.log(formRef);
                formRef.current.setFieldsValue({
                    ...data, //将所有字段都分配，会有warning
                });
            }, 100);
        }
    }, [visible]);
    useEffect(() => {
        props.dispatch({
            type: 'channel/getList',
        });
    }, []);
    const handleDelete = record => {
        props.dispatch({
            type: 'channel/delete',
            payload: {
                _id: record._id,
            },
        });
    };

    const handleEdit = record => {
        setVisible(true);
        setData(record);
    };

    const handleClear = () => {
        formRef.current.resetFields();
    };

    return (
        <>
            <Modal
                title="编辑"
                visible={visible}
                onOk={() => {
                    handleUpdate();
                    handleClear();
                }}
                onCancel={() => {
                    setVisible(false);
                    handleClear();
                }}
            >
                <Form ref={v => (formRef.current = v)} />
            </Modal>
            <Table columns={columns} dataSource={props.channelList.docs} />
        </>
    );
};

export default connect(({ channel, loading }) => ({
    channelList: channel.list,
    fetching: loading.effects['channel/getList'],
}))(Com);
