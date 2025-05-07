import React, { useEffect, useState, useRef } from 'react';
import { Table, Divider, Tag, Modal, Popconfirm } from 'antd';
import styles from './index.less';
import { get } from 'lodash';
import { connect } from 'dva';
import Form from '../Form';
import {intl} from '@/utils/utils'


const Com = props => {
    // 客户名称、客户类型、国家、所属产品经理、通道
    const columns = [
        {
            title: intl('客户账号'),
            dataIndex: 'account',
            key: 'account',
        },
        {
            title: intl('客户名称'),
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: intl('所属产品经理'),
            dataIndex: 'owner',
            key: 'owner',
            render: (owner) => (
                <div>
                    {owner?.name}
                </div>
            ),
        },
        {
            title: intl('所属通道'),
            dataIndex: 'channel',
            render: (channel) => {
                return <div>{channel?.name}</div>;
            },
        },
        {
            title: intl('邮箱'),
            dataIndex: 'email',
            render: (email) => {
                return <div>{email}</div>;
            },
        },
    ].concat(props.isAllData ? [] : [{
        title: intl('操作'),
        dataIndex: 'action',
        key: 'action',
        render: (text, record) => (
            <div>
                <a onClick={e => handleEdit(record)}>{intl('编辑')}</a>
                <Divider type="vertical" />
                <Popconfirm
                    title="确认要删除吗"
                    onConfirm={() => handleDelete(record)}
                    okText="是"
                    cancelText="否"
                >
                    <a href="#">{intl("删除")}</a>
                </Popconfirm>
            </div>
        ),
    }])
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
                        role: data.role,
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
                console.log(data);
                formRef.current.setFieldsValue({
                    ...data, //将所有字段都分配，会有warning
                    channel: get(data, 'channel._id'),
                });
            }, 1300);
        }
    }, [visible]);
    useEffect(() => {
        console.log('user/fetch', props.isAllData)
        console.log('user/fetch', props?.user?.currentUser?._id)
        if(props?.user?.currentUser?._id) {
            props.dispatch({
                type: 'user/fetch',
                payload: {
                    role: 3,
                    owner: props.isAllData ? undefined : props?.user?.currentUser?._id
                },
            });
        }
    }, [props.isAllData, props?.user?.currentUser?._id]);
    const handleDelete = record => {
        props.dispatch({
            type: 'user/delete',
            payload: {
                _id: record._id,
                role: 3,
            },
        });
    };

    const handleEdit = record => {
        setData(record);
        setVisible(true);
    };

    const handleClear = () => {
        formRef.current.resetFields();
    };

    return (
        <>
            <Modal
                title="编辑"
                width="800px"
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
                <Form
                    ref={v => (formRef.current = v)}
                    channelId={visible ? get(data, 'channels.0._id') : ''}
                />
            </Modal>
            <Table columns={columns} dataSource={get(props, "user.customerList", [])} />
        </>
    );
};

export default connect(({ user, loading, channel }) => ({
    user,
    channels: get(channel, "list", []),
    fetching: loading.effects['user/fetch'],
}))(Com);
