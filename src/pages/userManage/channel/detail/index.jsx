import React, { useState, useEffect } from 'react';
import { get, filter, map } from 'lodash';
import { Card, Button, Tag, Select, Form } from 'antd';
import { PageHeaderWrapper } from '@ant-design/pro-layout';

import {
    UserOutlined,
} from '@ant-design/icons';

import { connect } from 'dva';
import { useParams } from 'umi';

import useFormModal from '@/hooks/useFormModal'
import styles from './index.less';

const tagRender = (props) => {
    const { label, value, closable, onClose } = props;
    const onPreventMouseDown = (event) => {
      event.preventDefault();
      event.stopPropagation();
    };
    return (
      <Tag
        color="geekblue"
        onMouseDown={onPreventMouseDown}
        closable={closable}
        onClose={onClose}
        style={{ fontSize: '14px', lineHeight: '30px', marginRight: 8 }} 
        className={styles.tag} 
        icon={<UserOutlined />}
      >
        {label}
      </Tag>
    );
  };

const Com = ({dispatch, currentChannel = {}, currentUser, customerList}) => {
    const { costomers,flowerColors,plainColors,styles } = currentChannel
    const [visible, setVisible] = useState(false);
    const params = useParams()
    const [FormModal, showModal] = useFormModal({}, {
        title: '分配客户',
        onOk: (values) => {
            onFinishAssginCostomer(values)
        },
      }, {costomers: map(costomers, c => (c._id))});
    
    
    const onFinishAssginCostomer = (values) => {
        dispatch({
            type: 'channel/updateCostomers',
            payload: { _id: params.id, ...values }
        })
        console.log('Received values of form: ', values);
    };

    useEffect(() => {
        dispatch({
            type: 'user/fetch',
            payload: {
                role: 3,
            },
        });
    }, [])
    
    useEffect(() => {
        dispatch({
            type: 'channel/findById',
            payload: {_id: params.id}
        })
    }, [params.id])

    return (
        <PageHeaderWrapper >
            <Card
                title="客户"
                extra={
                    <Button type="primary" onClick={showModal}>
                        分配
                    </Button>
                }
                style={{ marginBottom: '20px' }}
            >
                {map(costomers, c => (<Tag
                    color="geekblue"
                    style={{ fontSize: '14px', lineHeight: '30px', marginRight: 8 }} 
                    className={styles.tag} 
                    icon={<UserOutlined />}
                >
                    {c?.name}
                </Tag>))}
                <FormModal>
                    <Form.Item
                        name="costomers"
                    >
                        <Select
                            mode="multiple"
                            showArrow
                            tagRender={tagRender}
                            style={{ width: '100%', lineHeight: '38px' }}
                            options={map(customerList, c => ({label: c?.name, value: c?._id}))}
                        />
                    </Form.Item>
                </FormModal>
            </Card>
            <Card
                title="款式"
                extra={
                    <Button type="primary" onClick={showModal}>
                        分配
                    </Button>
                }
                style={{ marginBottom: '20px' }}
            >

            </Card>
            <Card
                title="颜色"
                extra={
                    <Button type="primary" onClick={showModal}>
                        分配
                    </Button>
                }
                style={{ marginBottom: '20px' }}
            >

            </Card>
            <Card
                title="花布"
                extra={
                    <Button type="primary" onClick={showModal}>
                        分配
                    </Button>
                }
                style={{ marginBottom: '20px' }}
            >

            </Card>
        </PageHeaderWrapper>
    );
};

export default connect(({ channel, user }) => ({
    currentUser: get(user, 'currentUser'),
    customerList: get(user, "customerList", []),
    channelList: get(channel, "list"),
    currentChannel: get(channel, "currentChannel", {})
}))(Com);
