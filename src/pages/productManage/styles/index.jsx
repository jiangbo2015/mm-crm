import React, { useState, useEffect, useRef } from 'react';
import { Card, Typography, Alert, Button, Modal } from 'antd';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import TableBasic from './TableBasic';
import Form from './Form';
import { connect } from 'dva';

const Com = props => {
    const formRef = useRef();
    const [visible, setVisible] = useState(false);
    useEffect(() => {
        props.dispatch({
            type: 'style/get',
        });
        props.dispatch({
            type: 'style/getColorList',
        });
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
                const {
                    imgUrl,
                    svgUrl,
                    svgUrlBack,
                    shadowUrl,
                    shadowUrlBack,
                    currentCategorys,
                } = props;
                // console.log(plainColors, flowerColors, styleImgUrl);
                props.dispatch({
                    type: 'style/addStyle',
                    payload: {
                        ...values,
                        categoryName: currentCategorys.find(x => x._id === values.categoryId).name,
                        imgUrl,
                        svgUrl,
                        svgUrlBack,
                        shadowUrl,
                        shadowUrlBack,
                    },
                });
                setVisible(false);
            }
        });
    };
    const handleClear = () => {
        formRef.current.resetFields();
        props.dispatch({
            type: 'style/resetFields',
        });
    };
    return (
        <PageHeaderWrapper>
            <Card
                title="款式管理"
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
                width="900px"
                destroyOnClose={true}
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

export default connect(state => ({
    imgUrl: state.style.imgUrl,
    svgUrl: state.style.svgUrl,
    shadowUrl: state.style.shadowUrl,
    svgUrlBack: state.style.svgUrlBack,
    shadowUrlBack: state.style.shadowUrlBack,
    currentCategorys: state.style.currentCategorys,
}))(Com);
