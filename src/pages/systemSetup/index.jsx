import React, { useState, useEffect } from 'react';
import { Card, Input, Button, Icon, notification, Row, Col, Upload } from 'antd';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { connect } from 'dva';
import { uploadProps, Avatar, UploadBtn } from '../productManage/colors/UploadCom';

const Com = props => {
    useEffect(() => {
        props.dispatch({
            type: 'system/get',
        });
    }, []);

    const [email, setEmail] = useState(props.email);
    const [meiyuan, setMeiyuan] = useState();
    const [ouyuan, setOuyuan] = useState();
    const [loading, setLoading] = useState(false);
    const [colorImgUrl, setColorImgUrl] = useState(false);

    useEffect(() => {
        setEmail(props.email);
        setMeiyuan(props.meiyuan);
        setOuyuan(props.ouyuan);
        setColorImgUrl(props.img);
    }, [props.email, props.meiyuan, props.ouyuan, props.img]);

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
                img: colorImgUrl,
            },
        });
    };
    console.log(props.email);

    const handleAdd = info => {
        if (info.file.status === 'uploading') {
            setLoading(true);
            return;
        }
        if (info.file.status === 'done') {
            setLoading(false);
            setColorImgUrl(info.file.response.data.url);
        }
    };
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
                <Row style={{ marginTop: '20px' }}>
                    <Col span="2">封面图</Col>
                    <Col span="4">
                        <Upload {...uploadProps} onChange={handleAdd}>
                            {colorImgUrl ? (
                                <Avatar src={colorImgUrl}></Avatar>
                            ) : (
                                <UploadBtn type={loading ? 'loading' : 'plus'}></UploadBtn>
                            )}
                        </Upload>
                    </Col>
                </Row>
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
