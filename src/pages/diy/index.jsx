import React, { useState, useEffect } from 'react';
import { Card, Button, Modal } from 'antd';
import { PageHeaderWrapper } from '@ant-design/pro-layout';

import { connect } from 'dva';

const Com = props => {
    
    useEffect(() => {
        //
    }, []);

    return (
        <PageHeaderWrapper>
            <Card style={{ marginBottom: '20px' }}>
                内容组件
            </Card>
        </PageHeaderWrapper>
    );
};

export default connect(state => ({
    ...state.creativeCapsule
}))(Com);
