import React, { useEffect, useState, useRef } from 'react';
import { Table, Divider, Tag, Modal, Popconfirm } from 'antd';
import styles from './index.less';
import { connect } from 'dva';
import Form from '../Form';

const Com = props => {
    // 客户名称、客户类型、国家、所属产品经理、通道
    const columns = [
        {
            title: '客户名称',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: '客户类型',
            dataIndex: 'customerType',
            key: 'customerType',
        },
        {
            title: '国家',
            dataIndex: 'countries',
            key: 'countries',
        },
        {
            title: '所属产品经理',
            dataIndex: 'map',
            key: 'map',
            render: (text, record) => <a>{props.channels.map[record.channels[0]._id]}</a>,
        },
        {
            title: '所属通道',
            dataIndex: 'role',
            render: (text, record) => {
                const channelsName = record.channels.map(c => c.name);
                return <div>{channelsName.toString()}</div>;
            },
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
                        role: 3,
                        _id: data._id,
                        ...values,
                        channels: [values.channels],
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
                    channels: data.channels[0]._id,
                });
            }, 1300);
        }
    }, [visible]);
    useEffect(() => {
        props.dispatch({
            type: 'user/fetch',
            payload: {
                role: 3,
            },
        });
    }, []);
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
                    channelId={visible ? data.channels[0]._id : ''}
                />
            </Modal>
            <Table columns={columns} dataSource={props.user.customerList.docs} />
        </>
    );
};

export default connect(({ user, loading, channel }) => ({
    user,
    channels: channel.list,
    fetching: loading.effects['user/fetch'],
}))(Com);
