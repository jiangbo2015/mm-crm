import React, { useState } from 'react';
import { Card, Button, Modal } from 'antd';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import TableBasic from './TableBasic';
import Form from './Form';
import { connect } from 'dva';

const Com = props => {
    const [visible, setVisible] = useState(false);
    const formRef = React.useRef();

    const handleSubmit = () => {
        formRef.current.validateFields((err, values) => {
            console.log(err, values);
            if (!err) {
                setVisible(false);
                props.dispatch({
                    type: 'user/add',
                    payload: {
                        role: 2,
                        ...values,
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
                title="设计人员列表"
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

export default connect(state => ({}))(Com);
