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
                type: 1,
            },
        });
    };

    const handleSearch = code => {
        setCode(code);
        props.dispatch({
            type: 'style/getColorList',
            payload: { limit: 10, page: 1, type: 1, code },
        });
    };

    const handleSubmit = () => {
        formRef.current.validateFields((err, values) => {
            console.log(err, values);
            if (!err) {
                const { imgUrl, svgUrl, svgUrlBack, shadowUrl, shadowUrlBack } = props;
                // console.log(plainColors, flowerColors, styleImgUrl);
                props.dispatch({
                    type: 'style/addStyle',
                    payload: {
                        ...values,
                    },
                });
                setVisible(false);
            }
        });
    };

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
                type: 1,
            },
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
                title="花布列表"
                extra={
                    <>
                        <Button
                            type="primary"
                            onClick={() => {
                                setVisible(true);
                                setAddColorType(1);
                            }}
                        >
                            添加花布
                        </Button>

                        <Button
                            style={{ marginLeft: '10px' }}
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
                title="添加"
                visible={visible}
                width="800px"
                destroyOnClose={true}
                footer={false}
                onOk={() => {
                    handleSubmit();
                    handleClear();
                }}
                onCancel={() => {
                    setVisible(false);
                    handleClear();
                }}
            >
                <Form
                    colorType={addColorType}
                    onClose={handleClear}
                    submitFetching={props.submitFetching}
                />
            </Modal>
        </PageHeaderWrapper>
    );
};
// colorList: state.style.colorList || [],
export default connect(state => ({
    colorList: state.style.colorList || [],
    submitFetching: state.loading.effects['style/add'],
}))(Com);
