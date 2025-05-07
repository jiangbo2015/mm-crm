import React, { useEffect, useState, useRef } from 'react';
import { Table, Divider, Tag, Modal, Popconfirm, message } from 'antd';
import { intl } from '@/utils/utils';
import { connect } from 'dva';
import Form from '../Form';

const Com = props => {
    const columns = [
        {
            title: intl('账号'),
            dataIndex: 'account',
            key: 'account',
            render: text => <a>{text}</a>,
        },
        {
            title: intl('姓名'),
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: intl('操作'),
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
            } else {
                console.log(err);
                message.error('请填写完整');
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
                    currency: data.currency,
                    channels: data.channels?.map(x => x._id),
                    goods: data.goods,
                    branchs: data.branchs,
                    capsules: data.capsules,
                });
            }, 600);
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

    console.log("productorList", props.user.productorList)
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
                <Form ref={v => (formRef.current = v)} editId={data._id} />
            </Modal>
            <Table columns={columns} dataSource={props.user.productorList} />
        </>
    );
};

export default connect(({ user, loading }) => ({
    user,
    fetching: loading.effects['user/fetch'],
}))(Com);
