import React, { useState, useEffect } from 'react';
import { Card, Button, Modal } from 'antd';
import { PageHeaderWrapper } from '@ant-design/pro-layout';

import TableBasic from './TableBasic';
import { connect } from 'dva';

const Com = props => {
    const getOrderList = (payload = {}) => {
        props.dispatch({
            type: 'order/getList',
            payload,
        });
    };
    const getOrderDownLoadUrl = (payload = {}) => {
        props.dispatch({
            type: 'order/download',
            payload,
        });
    };
    useEffect(() => {
        getOrderList();
    }, []);

    return (
        <PageHeaderWrapper>
            <Card style={{ marginBottom: '20px' }}>
                <TableBasic getOrderList={getOrderList} getOrderDownLoadUrl={getOrderDownLoadUrl} />
            </Card>
        </PageHeaderWrapper>
    );
};

export default connect(state => ({
    category: state.goods.category,
    imgUrl: state.goods.imgUrl,
}))(Com);
