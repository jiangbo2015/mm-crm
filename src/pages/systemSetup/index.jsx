import React, { useState, useEffect } from 'react';
import { Card, Input, Button, Icon, notification, Row, Col } from 'antd';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { connect } from 'dva';

const Com = props => {
    useEffect(() => {
        props.dispatch({
            type: 'system/get',
        });
    }, []);

    const [email, setEmail] = useState(props.email);
    const [meiyuan, setMeiyuan] = useState();
    const [ouyuan, setOuyuan] = useState();

    useEffect(() => {
        setEmail(props.email);
        setMeiyuan(props.meiyuan);
        setOuyuan(props.ouyuan);
    }, [props.email, props.meiyuan, props.ouyuan]);

    const handleSubmit = () => {
        if (!/^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/.test(email)) {
            notification.error({
                message: '邮箱格式不合法',
            });
            return;
        }
        if (!meiyuan || !ouyuan || isNaN(meiyuan) || isNaN(ouyuan)) {
            notification.error({
                message: '汇率不合法',
            });
            return;
        }
        props.dispatch({
            type: 'system/update',
            payload: {
                email,
                ouyuan: parseFloat(ouyuan),
                meiyuan: parseFloat(meiyuan),
            },
        });
    };
    console.log(props.email);
    return (
        <PageHeaderWrapper>
            <Card>
                <Input.Search
                    placeholder="输入系统邮箱"
                    enterButton="邮箱"
                    type="email"
                    size="default"
                    value={email || ''}
                    onChange={e => setEmail(e.target.value)}
                />
                <Input
                    style={{ margin: '20px 0' }}
                    addonBefore="1美元等于"
                    addonAfter="人民币"
                    value={meiyuan}
                    onChange={e => setMeiyuan(e.target.value)}
                />
                <Input
                    addonBefore="1欧元等于"
                    addonAfter="人民币"
                    value={ouyuan}
                    onChange={e => setOuyuan(e.target.value)}
                />
                <Row type="flex" justify="center" style={{ margin: '20px' }}>
                    <Button type="primary" onClick={() => handleSubmit()}>
                        确认更新
                    </Button>
                </Row>
            </Card>
        </PageHeaderWrapper>
    );
};

export default connect(state => ({
    ...state.system,
}))(Com);
