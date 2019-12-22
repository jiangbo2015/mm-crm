import React, { useState, useEffect } from 'react';
import { Card, Button, Modal } from 'antd';
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
    }, []);

    const handleSubmit = () => {
        formRef.current.validateFields((err, values) => {
            console.log(err, values);
            if (!err) {
                setVisible(false);
                const { category = [], imgUrl } = props;
                const newCategory = category.map((item, index) => ({
                    name: values[`cname${index}`],
                    sizeId: values[`size${index}`],
                }));
                props.dispatch({
                    type: 'goods/add',
                    payload: {
                        name: values.name,
                        aliasName: values.aliasName,
                        imgUrl,
                        category: newCategory,
                    },
                });
            } else {
                console.log(err);
            }
        });
    };

    const handleClear = () => {
        formRef.current.resetFields();
        props.dispatch({
            type: 'goods/setImgUrl',
            payload: '',
        });
        props.dispatch({
            type: 'goods/setCategories',
            payload: [{}],
        });
    };

    return (
        <PageHeaderWrapper>
            <Card
                title="商品列表"
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
    category: state.goods.category,
    imgUrl: state.goods.imgUrl,
}))(Com);
