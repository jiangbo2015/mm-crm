import React, { useEffect, useState, useRef } from 'react';
import { Table, Divider, Tag, Modal, Popconfirm } from 'antd';
import styles from './index.less';
import { get } from 'lodash';
import { Link } from 'umi';
import { connect } from 'dva';
import Form from '../Form';
import {intl} from '@/utils/utils'

const Com = props => {
    const columns = [
        {
            title: intl('通道编号'),
            dataIndex: 'code',
            key: 'code',
        },
        {
            title: intl('通道名'),
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: intl('说明'),
            dataIndex: 'remark',
            key: 'remark',
            
        },
        {
            title: intl('操作'),
            dataIndex: '_id',
            key: '_id',
            render: (id, record) => (
                <div>
                    {props?.isAllData? null: <> 
                        <a onClick={e => handleEdit(record)}>{intl('编辑')}</a>
                            <Divider type="vertical" />
                            <Popconfirm
                                title="确认要删除吗"
                                onConfirm={() => handleDelete(record)}
                                okText="是"
                                cancelText="否"
                            >
                                <a href="#">{intl('删除')}</a>
                            </Popconfirm>
                            <Divider type="vertical" />
                        </>
                    }
                    <Link to={`/userManage/channel/detail/${id}`}>详情</Link>
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
            type: props?.isAllData? 'channel/getAllList' : 'channel/getList',
        });
    }, [props?.isAllData]);
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
                title={intl("编辑")}
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
            <Table columns={columns} dataSource={props?.isAllData ? get(props, "allChannelList", []) : get(props, "channelList", [])} />
        </>
    );
};

export default connect(({  loading, channel }) => ({
    channelList: get(channel, "list"),
    allChannelList: get(channel, "allList"),
    fetching: loading.effects['channel/getList'],
}))(Com);
