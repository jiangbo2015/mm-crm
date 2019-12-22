import React, { useState, useEffect } from 'react';
import { Card, Input, Alert, Icon, notification } from 'antd';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { connect } from 'dva';

const Com = props => {
    useEffect(() => {
        props.dispatch({
            type: 'system/get',
        });
    }, []);

    const [email, setEmail] = useState(props.email);

    useEffect(() => {
        setEmail(props.email);
    }, [props.email]);

    const handleSubmit = value => {
        if (!/^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/.test(value)) {
            notification.error({
                message: '邮箱格式不合法',
            });
            return;
        }
        props.dispatch({
            type: 'system/update',
            payload: {
                email: value,
            },
        });
    };
    console.log(props.email);
    return (
        <PageHeaderWrapper>
            <Card>
                <Input.Search
                    placeholder="输入系统邮箱"
                    enterButton="提交"
                    type="email"
                    size="default"
                    value={email || ''}
                    onChange={e => setEmail(e.target.value)}
                    onSearch={value => handleSubmit(value)}
                />
            </Card>
        </PageHeaderWrapper>
    );
};

export default connect(state => ({
    email: state.system.email,
}))(Com);
