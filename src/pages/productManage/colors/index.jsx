import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { Button, Card, Col, Input, Modal, Row } from 'antd';
import { connect } from 'dva';
import React, { useEffect, useState } from 'react';
import Form from './From';
import TableBasic from './TableBasic';

const { Search } = Input;

const Com = props => {
    const [visible, setVisible] = useState(false);
    const [code, setCode] = useState(false);
    const [selectedKeys, setSelectedKeys] = useState([]);
    const [batchVisible, setBatchVisible] = useState(false);
    const [addColorType, setAddColorType] = useState(0); //0:素色  1: 画布

    const formRef = React.useRef();

    useEffect(() => {
        handleSearch();
        props.dispatch({
            type: 'goods/getList',
        });
        props.dispatch({
            type: 'global/fetchColorList',
        });
    }, []);
    const handlePageChange = (page, pageSize) => {
        props.dispatch({
            type: 'style/getColorList',
            payload: {
                page,
                code,
                limit: pageSize,
                type: 0,
            },
        });
    };
    const handleSearch = code => {
        setCode(code);
        props.dispatch({
            type: 'style/getColorList',
            payload: { limit: 10, page: 1, type: 0, code },
        });
    };

    // const handleSubmit = () => {
    //     formRef.current.validateFields((err, values) => {
    //         console.log(err, values);
    //         if (!err) {
    //             // const { imgUrl, svgUrl, svgUrlBack, shadowUrl, shadowUrlBack } = props;
    //             props.dispatch({
    //                 type: 'style/addStyle',
    //                 payload: {
    //                     ...values,
    //                 },
    //             });
    //             setVisible(false);
    //         }
    //     });
    // };

    const handleClear = () => {
        setVisible(false);
    };

    const handleDeleteBatch = () => {
        if (selectedKeys.length < 1) {
            return;
        }
        props.dispatch({
            type: 'style/deleteColor',
            payload: {
                ids: selectedKeys,
                type: 0,
            },
        });
    };

    const handleBatchUpdate = () => {
        formRef.current.validateFields((err, values) => {
            if (!err) {
                console.log(values, 'vlues');
                props.dispatch({
                    type: 'style/updateColor',
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
                        placeholder="请输入编码"
                        onSearch={value => handleSearch(value)}
                        enterButton
                    />
                </Col>
            </Row>
            <Card
                title="颜色列表"
                extra={
                    <>
                        <Button
                            style={{ marginRight: '10px' }}
                            type="primary"
                            onClick={() => {
                                setVisible(true);
                                setAddColorType(0);
                            }}
                        >
                            添加素色
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
                style={{ marginBottom: '20px' }}
            >
                <TableBasic
                    onPageChange={(page, pageSize) => {
                        handlePageChange(page, pageSize);
                    }}
                    setSelectedKeys={setSelectedKeys}
                />
            </Card>
            <Modal
                title="批量编辑"
                visible={batchVisible}
                width="800px"
                footer={null}
                destroyOnClose={true}
                onCancel={() => {
                    setBatchVisible(false);
                }}
            >
                <Form
                    ref={v => (formRef.current = v)}
                    isBatch
                    updateColor={true}
                    handleBatchUpdate={handleBatchUpdate}
                />
            </Modal>
            <Modal
                title="添加"
                visible={visible}
                width="800px"
                footer={false}
                onCancel={handleClear}
            >
                <Form colorType={addColorType} onClose={handleClear} />
            </Modal>
        </PageHeaderWrapper>
    );
};
// colorList: state.style.colorList || [],
export default connect(state => ({ colorList: state.style.colorList || [] }))(Com);
