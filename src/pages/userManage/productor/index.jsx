import { Card, Typography, Alert, Button, Modal } from 'antd';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import TableBasic from './TableBasic';
import Form from './Form';
import { connect } from 'dva';
import React, { useEffect, useRef, useState } from 'react';
import { intl } from '@/utils/utils'

const Com = props => {
    const [visible, setVisible] = useState(false);
    const formRef = useRef();
    useEffect(() => {
        props.dispatch({
            type: 'channel/getList',
            payload: { limit: 100, page: 1 },
        });
        // props.dispatch({
        //     type: 'goods/getList',
        // });
        // props.dispatch({
        //     type: 'global/fetchCapsuleList',
        // });
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
                title={intl("产品经理")}
                extra={
                    <Button type="primary" onClick={() => setVisible(true)}>
                        {intl("添加")}
                    </Button>
                }
            >
                <TableBasic />
            </Card>

            <Modal
                title={intl("添加")}
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
