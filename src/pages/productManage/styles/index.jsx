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
                const { plainColors, flowerColors, styleImgUrl } = props;
                // console.log(plainColors, flowerColors, styleImgUrl);
                plainColors.map(item => {
                    item.colorId = item._id;
                    delete item._id;
                });
                flowerColors.map(item => {
                    item.colorId = item._id;
                    delete item._id;
                });
                props.dispatch({
                    type: 'style/addStyle',
                    payload: {
                        ...values,
                        plainColors,
                        flowerColors,
                        imgUrl: styleImgUrl,
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
    plainColors: state.style.plainColors,
    flowerColors: state.style.flowerColors,
    styleImgUrl: state.style.styleImgUrl,
}))(Com);
