import React, { useEffect, useState, useRef } from 'react';
import { Table, Divider, Tag, Modal, Popconfirm } from 'antd';
import styles from './index.less';
import { connect } from 'dva';
import Form from '../Form';

const Com = props => {
    const columns = [
        {
            title: '账号',
            dataIndex: 'account',
            key: 'account',
            render: text => <a>{text}</a>,
        },
        {
            title: '名字',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: '角色',
            dataIndex: 'role',
            key: 'role',
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
                    type: 'user/update',
                    payload: {
                        role: 1,
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
                    name: data.name,
                    account: data.account,
                    password: data.password,
                    email: data.email,
                    remark: data.remark,
                    address: data.address,
                    channels: data.channels.map(x => x._id),
                });
            });
        }
    }, [visible]);
    useEffect(() => {
        props.dispatch({
            type: 'user/fetch',
            payload: {
                role: 1,
            },
        });
    }, []);
    const handleDelete = record => {
        props.dispatch({
            type: 'user/delete',
            payload: {
                _id: record._id,
                role: 1,
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
            <Table columns={columns} dataSource={props.user.productorList} />;
        </>
    );
};

export default connect(({ user, loading }) => ({
    user,
    fetching: loading.effects['user/fetch'],
}))(Com);
