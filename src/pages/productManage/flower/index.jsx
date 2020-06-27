import React, { useState, useEffect } from 'react';
import { Card, Button, Modal, Row, Col, Input } from 'antd';
import { PageHeaderWrapper } from '@ant-design/pro-layout';

import Form from './From';
import TableBasic from './TableBasic';
import { connect } from 'dva';
const { Search } = Input;

const Com = props => {
    const [visible, setVisible] = useState(false);
    const [addColorType, setAddColorType] = useState(0); //0:素色  1: 画布

    const formRef = React.useRef();

    useEffect(() => {
        handleSearch();
    }, []);

    const handleSearch = code => {
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
                        {/* <Button
                            style={{ marginRight: '10px' }}
                            type="primary"
                            onClick={() => {
                                setVisible(true);
                                setAddColorType(0);
                            }}
                        >
                            添加素色
                        </Button> */}

                        <Button
                            type="primary"
                            onClick={() => {
                                setVisible(true);
                                setAddColorType(1);
                            }}
                        >
                            添加花布
                        </Button>
                    </>
                }
                style={{ marginBottom: '20px' }}
            >
                <TableBasic />
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
                <Form colorType={addColorType} onClose={handleClear} />
            </Modal>
        </PageHeaderWrapper>
    );
};
// colorList: state.style.colorList || [],
export default connect(state => ({ colorList: state.style.colorList || [] }))(Com);
