import React, { useState, useEffect } from 'react';
import { Card, Button, Modal, message } from 'antd';
import { PageHeaderWrapper } from '@ant-design/pro-layout';

import Form from './Form';
import TableBasic from './TableBasic';
import { connect } from 'dva';

const Com = props => {
    const [visible, setVisible] = useState(false);
    const formRef = React.useRef();

    useEffect(() => {
        props.dispatch({
            type: 'global/fetchSizeList',
        });
        props.dispatch({
            type: 'goods/getList',
        });
    }, []);

    const handleSubmit = () => {
        formRef.current.validateFields((err, values) => {
            console.log(err, values);
            if (!err) {
                console.log('do dispathc');

                const payload = {
                    values: Object.keys(values)
                        .filter(x => x !== 'goods')
                        .map((item, index) => ({
                            name: values[item],
                        })),
                    goods: values['goods'],
                };
                console.log(payload);
                props.dispatch({
                    type: 'global/addSize',
                    payload,
                });
                setVisible(false);
            } else {
                message.error('请填写完整');
            }
        });
    };

    const handleClear = () => {
        formRef.current.resetFields();
        props.dispatch({
            type: 'global/setCurrentSize',
            payload: {
                values: [{}],
            },
        });
    };

    return (
        <PageHeaderWrapper>
            <Card
                title="尺码段列表"
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
