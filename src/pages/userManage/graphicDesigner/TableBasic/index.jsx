import React, { useEffect, useState, useRef } from 'react';
import { Table, Divider, Tag, Modal, Popconfirm } from 'antd';
import styles from './index.less';
import { get } from 'lodash';
import { connect } from 'dva';
import { intl } from '@/utils/utils';
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
            key: 'action',
            dataIndex: 'action',
            render: (text, record) => (
                <div>
                    <a onClick={e => handleEdit(record)}>{intl('编辑')}</a>
                    <Divider type="vertical" />
                    <Popconfirm
                        title={intl("确认要删除吗")}
                        onConfirm={() => handleDelete(record)}
                        okText={intl("是")}
                        cancelText={intl("否")}
                    >
                        <a href="#">{intl("删除")}</a>
                    </Popconfirm>
                </div>
            ),
        },
    ];
    const formRef = useRef();
    const [visible, setVisible] = useState(false);
    const [data, setData] = useState({});

    const handleDelete = record => {
        props.dispatch({
            type: 'user/delete',
            payload: {
                _id: record._id,
                role: 5,
            },
        });
    };

    const handleEdit = record => {
        setVisible(true);
        setData(record);
    };

    const handleUpdate = () => {
        formRef.current.validateFields((err, values) => {
            if (!err) {
                setVisible(false);
                props.dispatch({
                    type: 'user/update',
                    payload: {
                        role: 2,
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
                });
            });
        }
    }, [visible]);

    useEffect(() => {
        props.dispatch({
            type: 'user/fetch',
            payload: {
                role: 5,
            },
        });
    }, []);

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
            <Table columns={columns} dataSource={get(props, "user.graphicDesignerList", [])} />
        </>
    );
};

export default connect(({ user, loading }) => ({
    user,
    fetching: loading.effects['user/fetch'],
}))(Com);
