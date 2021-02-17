import React, { useState, useEffect, useRef } from 'react';
import { Card, Typography, Alert, Button, Modal } from 'antd';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import TableBasic from './TableBasic';
import Form from './Form';
import { connect } from 'dva';

const Com = props => {
    const [visible, setVisible] = useState(false);
    const formRef = useRef();
    useEffect(() => {
        props.dispatch({
            type: 'channel/getList',
            payload: { limit: 100, page: 1 },
        });
        props.dispatch({
            type: 'goods/getList',
        });
        props.dispatch({
            type: 'global/fetchBranchList',
        });
        props.dispatch({
            type: 'global/fetchCapsuleList',
        });
    }, []);

    const handleSubmit = () => {
        console.log(formRef);
        formRef.current.validateFields((err, values) => {
            if (!err) {
                console.log(values);
                setVisible(false);
                props.dispatch({
                    type: 'user/add',
                    payload: {
                        role: 1,
                        ...values,
                    },
                });
            } else {
                console.log(err);
            }
        });
    };

    const handleClear = () => {
        formRef.current.resetFields();
    };

    return (
        <PageHeaderWrapper>
            <Card
                title="产品经理列表"
                extra={
                    <Button type="primary" onClick={() => setVisible(true)}>
                        添加
                    </Button>
                }
            >
                <TableBasic />
            </Card>

            <Modal
                title="添加"
                visible={visible}
                onOk={() => {
                    handleSubmit();
                    handleClear();
                }}
                onCancel={() => {
                    setVisible(false);
                    handleClear();
                }}
            >
                <Form ref={v => (formRef.current = v)} />
            </Modal>
        </PageHeaderWrapper>
    );
};

export default connect(state => state)(Com);
