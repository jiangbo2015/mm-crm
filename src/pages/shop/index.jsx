import React, { useState, useEffect, useRef } from 'react';
import { Card, Typography, Alert, Button, Modal, Row, Col, Input } from 'antd';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import TableBasic from './TableBasic';
import Form from './Form';
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

    const handlePageChange = page => {
        props.dispatch({
            type: 'style/get',
            payload: {
                page,
                limit: 10,
                styleNo: styleNo ? styleNo : '',
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
                title="网店商品管理"
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
                width="1100px"
                destroyOnClose={true}
                footer={false}
                onCancel={() => {
                    setVisible(false);
                    // handleClear();
                }}
            >
                <Form />
            </Modal>
        </PageHeaderWrapper>
    );
};

export default connect(state => ({
    imgUrl: state.style.imgUrl,
    svgUrl: state.style.svgUrl,
    shadowUrl: state.style.shadowUrl,
    svgUrlBack: state.style.svgUrlBack,
    shadowUrlBack: state.style.shadowUrlBack,
    currentCategorys: state.style.currentCategorys,
}))(Com);
