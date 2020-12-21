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
        // props.dispatch({
        //     type: 'style/get',
        //     payload: {
        //         limit: 10,
        //     },
        // });
        // props.dispatch({
        //     type: 'style/getColorList',
        // });
        // props.dispatch({
        //     type: 'global/fetchSizeList',
        // });
        // props.dispatch({
        //     type: 'goods/getList',
        // });
        // props.dispatch({
        //     type: 'style/getTagList',
        // });
    }, []);

    const handleSearch = value => {
        setStyleNo(value);
        props.dispatch({
            type: 'style/get',
            payload: {
                styleNo: value,
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
        // props.dispatch({
        //     type: 'style/get',
        //     payload: {
        //         page,
        //         limit: 10,
        //         styleNo: styleNo ? styleNo : '',
        //     },
        // });
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
                width="900px"
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
                <Form />
            </Modal>
        </PageHeaderWrapper>
    );
};

export default connect(state => ({
    capsuleList: state.capsule.list,
}))(Com);
