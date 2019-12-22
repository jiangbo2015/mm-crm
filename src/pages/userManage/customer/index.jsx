import React, { useState, useEffect } from 'react';
import { Card, Button, Modal } from 'antd';
import { PageHeaderWrapper } from '@ant-design/pro-layout';

import Form from './Form';
import TableBasic from './TableBasic';
import { connect } from 'dva';

const Com = props => {
    const [visible, setVisible] = useState(false);
    const formRef = React.useRef();
    useEffect(() => {
        props.dispatch({
            type: 'channel/getList',
            payload: {},
        });
    }, []);
    const handleSubmit = () => {
        formRef.current.validateFields((err, values) => {
            console.log(err, values);
            if (!err) {
                setVisible(false);
                props.dispatch({
                    type: 'user/add',
                    payload: {
                        role: 3,
                        ...values,
                        channels: [values.channels], //要以数组的形式发送
                    },
                });
            }
        });
    };

    const handleClear = () => {
        formRef.current.resetFields();
    };

    return (
        <PageHeaderWrapper>
            <Card
                title="客户列表"
                extra={
                    <Button type="primary" onClick={() => setVisible(true)}>
                        添加
                    </Button>
                }
                style={{ marginBottom: '20px' }}
            >
                <TableBasic />
            </Card>
            <Modal
                title="添加"
                visible={visible}
                width="800px"
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

export default connect(state => ({}))(Com);
