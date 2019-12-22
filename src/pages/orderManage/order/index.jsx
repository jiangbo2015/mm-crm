import React, { useState, useEffect } from 'react';
import { Card, Button, Modal } from 'antd';
import { PageHeaderWrapper } from '@ant-design/pro-layout';

import TableBasic from './TableBasic';
import { connect } from 'dva';

const Com = props => {
    useEffect(() => {
        props.dispatch({
            type: 'order/getList',
        });
    }, []);

    return (
        <PageHeaderWrapper>
            <Card
                // title="订单列表"
                // extra={
                //     <Button type="primary" onClick={() => setVisible(true)}>
                //         添加
                //     </Button>
                // }
                style={{ marginBottom: '20px' }}
            >
                <TableBasic />
            </Card>
        </PageHeaderWrapper>
    );
};

export default connect(state => ({
    category: state.goods.category,
    imgUrl: state.goods.imgUrl,
}))(Com);
