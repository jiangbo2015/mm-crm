import React, { useState, useEffect, useRef } from 'react';
import { Card, Typography, Alert, Button, Modal, Row, Col, Input } from 'antd';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import TableBasic from './TableBasic';
import Form from './Form/index';
import { connect } from 'umi';

const { Search } = Input;

const Com = props => {
    const formRef = useRef();
    const [visible, setVisible] = useState(false);
    const [styleNo, setStyleNo] = useState(false);
    useEffect(() => {
        if (props.dispatch) {
            props.dispatch({
                type: 'capsule/getList',
            });
        }
    }, []);

    const handleSearch = value => {
        setStyleNo(value);
        props.dispatch({
            type: 'capsule/getList',
            payload: {
                namecn: value,
                nameen: value,
                limit: 10,
            },
        });
    };
    const handleClear = () => {
        console.log('handleClear');
        // formRef.current.resetFields();
    };
    const handleSubmit = () => {
        // console.log('handleSubmit');
        formRef.current.validateFields((err, values) => {
            if (!err) {
                console.log('values', values);
                props.dispatch({
                    type: 'capsule/add',
                    payload: values,
                });
                setVisible(false);
                this.handleClear();
            }
        });
    };

    const handlePageChange = page => {
        let queries = {};
        if (styleNo) {
            queries.namecn = styleNo;
            queries.nameen = styleNo;
        }
        props.dispatch({
            type: 'capsule/getList',
            payload: {
                page,
                limit: 10,
                ...queries,
            },
        });
    };
    return (
        <PageHeaderWrapper>
            <Row style={{ marginBottom: '10px' }}>
                <Col span="8">
                    <Search
                        placeholder="请输入款式编号"
                        onSearch={value => handleSearch(value)}
                        enterButton
                    />
                </Col>
            </Row>
            <Card
                title="胶囊列表"
                extra={
                    <Button type="primary" onClick={() => setVisible(true)}>
                        添加
                    </Button>
                }
            >
                <TableBasic
                    onPageChange={page => {
                        handlePageChange(page);
                    }}
                />
            </Card>

            <Modal
                title="添加"
                visible={visible}
                width="800px"
                destroyOnClose={true}
                footer={null}
                onOk={() => {
                    handleSubmit();
                }}
                onCancel={() => {
                    setVisible(false);
                    handleClear();
                }}
            >
                <Form onClose={() => {
                    setVisible(false);
                    // handleClear();
                }}/>
            </Modal>
        </PageHeaderWrapper>
    );
};

export default connect(state => ({
    capsuleList: state.capsule.list,
}))(Com);
