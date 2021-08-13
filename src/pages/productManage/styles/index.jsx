import React, { useState, useEffect, useRef } from 'react';
import { Card, Typography, Alert, Button, Modal, Row, Col, Input } from 'antd';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import TableBasic from './TableBasic';
import Form from './Form';
import { connect } from 'dva';

const { Search } = Input;

const Com = props => {
    const formRef = useRef();
    const formRef2 = useRef();
    const [visible, setVisible] = useState(false);
    const [styleNo, setStyleNo] = useState(false);
    const [selectedKeys, setSelectedKeys] = useState([]);
    const [batchVisible, setBatchVisible] = useState(false);

    useEffect(() => {
        props.dispatch({
            type: 'style/get',
            payload: {
                limit: 10,
            },
        });
        // props.dispatch({
        //     type: 'style/getColorList',
        // });
        props.dispatch({
            type: 'global/fetchSizeList',
        });
        props.dispatch({
            type: 'goods/getList',
        });
        props.dispatch({
            type: 'style/getTagList',
        });
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

    const handleSubmit = () => {
        console.log('handleSubmit');
        formRef.current.validateFields((err, values) => {
            console.log(err, values);
            if (!err) {
                const { imgUrl, svgUrl, svgUrlBack, shadowUrl, shadowUrlBack } = props;
                // console.log(plainColors, flowerColors, styleImgUrl);
                props.dispatch({
                    type: 'style/addStyle',
                    payload: {
                        ...values,

                        imgUrl,
                        svgUrl,
                        svgUrlBack,
                        shadowUrl,
                        shadowUrlBack,
                    },
                });
                setVisible(false);
                this.handleClear();
            }
        });
    };
    const handleClear = () => {
        console.log('handleClear');
        formRef.current.resetFields();
        props.dispatch({
            type: 'style/resetFields',
        });
    };
    const handlePageChange = (page,limit) => {
        // console.log('others', others)
        props.dispatch({
            type: 'style/get',
            payload: {
                page,
                limit: limit,
                styleNo: styleNo ? styleNo : '',
            },
        });
    };

    const handleDeleteBatch = () => {
        if (selectedKeys.length < 1) {
            return;
        }
        props.dispatch({
            type: 'style/delete',
            payload: {
                ids: selectedKeys,
            },
        });
    };

    const handleBatchUpdate = () => {
        formRef2.current.validateFields((err, values) => {
            if (!err) {
                console.log(values, 'vlues');
                props.dispatch({
                    type: 'style/updateMany',
                    payload: {
                        ids: selectedKeys,
                        type: 0,
                        ...values,
                    },
                });
                setBatchVisible(false);
            }
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
                title="款式管理"
                extra={
                    <>
                        
                        <Button style={{ marginRight: '10px' }} type="primary" onClick={() => setVisible(true)}>
                            添加
                        </Button>
                        <Button
                            style={{ marginRight: '10px' }}
                            type="primary"
                            onClick={() => {
                                setBatchVisible(true);
                            }}
                        >
                            批量编辑
                        </Button>
                        <Button
                            type="danger"
                            onClick={() => {
                                handleDeleteBatch();
                            }}
                        >
                            批量删除
                        </Button>
                    </>
                }
            >
                <TableBasic
                    onPageChange={(page, pageSize) => {
                        handlePageChange(page, pageSize);
                    }}
                    setSelectedKeys={setSelectedKeys}
                />
            </Card>

            <Modal
                title="添加"
                visible={visible}
                width="900px"
                destroyOnClose={true}
                onOk={() => {
                    handleSubmit();
                }}
                onCancel={() => {
                    setVisible(false);
                    handleClear();
                }}
            >
                <Form ref={v => (formRef.current = v)} />
            </Modal>
            <Modal
                title="批量编辑"
                visible={batchVisible}
                width="800px"
                // footer={null}
                destroyOnClose={true}
                onCancel={() => {
                    setBatchVisible(false);
                    handleClear();
                }}
                onOk={() => {
                    handleBatchUpdate();
                }}
            >
                <Form
                    ref={v => (formRef2.current = v)}
                    isBatch
                    updateColor={true}
                    handleBatchUpdate={handleBatchUpdate}
                />
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
