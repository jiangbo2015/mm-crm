import React from 'react';
import { Form, Input, message, Row, Col, notification, Upload, Button } from 'antd';
var isHexcolor = require('is-hexcolor');
import { connect } from 'dva';
import { uploadProps, Avatar, UploadBtn } from '../UploadCom';

@connect(state => ({
    currentSize: state.global.currentSize,
}))
class RegistrationForm extends React.Component {
    state = {
        colorImgUrl: '',
        colorImgWidth: 0,
        colorImgHeight: 0,
        onLoad: false,
    };
    // formRef = React.createRef()
    handleSubmit() {
        this.props.form.validateFields((err, values) => {
            console.log(err, values);
            if (err) return;
            if (this.props.colorType) {
                this.addFlowerColor(values);
            } else {
                this.addPlainColor(values);
            }
            this.props.onClose();
        });
    }
    handleAdd = info => {
        console.log(info, 'info info info');
        this.setState({
            colorImgUrl: '',
            onLoad: false,
        });
        if (info.file.status === 'uploading') {
            this.setState({ loading: true });
            return;
        }
        if (info.file.status === 'done') {
            this.setState({
                colorImgUrl: info.file.response.data.url,
                loading: false,
            });
        }
    };
    addFlowerColor = params => {
        const { colorImgWidth, colorImgHeight, colorImgUrl } = this.state;
        if (!colorImgUrl) {
            notification.error({
                message: '请先上传图片',
            });
        } else {
            this.props.dispatch({
                type: 'style/addColor',
                payload: {
                    type: 1,
                    value: colorImgUrl,
                    width: colorImgWidth,
                    height: colorImgHeight,
                    ...params,
                },
            });
        }
    };
    addPlainColor = params => {
        if (isHexcolor(value)) {
            this.props.dispatch({
                type: 'style/addColor',
                payload: {
                    type: 0,
                    value,
                    ...params,
                },
            });
        } else {
            notification.error({
                message: '颜色格式不合法',
            });
        }
    };

    imgOnLoad = e => {
        let imgTemp = new Image();
        imgTemp.src = e.target.src;
        // console.log(imgTemp.width, imgTemp.height);

        imgTemp.onload = () => {
            console.log(imgTemp.width, imgTemp.height);
            this.setState({
                colorImgHeight: imgTemp.height,
                colorImgWidth: imgTemp.width,
                onLoad: true,
            });
        };
    };

    beforeUpload = file => {
        const limit = file.size / 1024 < 200;
        if (!limit) {
            message.error('Image must smaller than 200K!');
        }
        return limit;
    };
    render() {
        const { getFieldDecorator } = this.props.form;

        const formItemLayout = {
            labelCol: {
                xs: {
                    span: 24,
                },
                sm: {
                    span: 8,
                },
            },
            wrapperCol: {
                xs: {
                    span: 24,
                },
                sm: {
                    span: 16,
                },
            },
        };
        const { colorImgUrl } = this.state;
        const { colorType } = this.props;
        return (
            <Form {...formItemLayout} name="inputDesiner">
                <Row>
                    {colorType ? (
                        <>
                            {' '}
                            <Col span="8">
                                <Upload
                                    {...uploadProps}
                                    beforeUpload={this.beforeUpload}
                                    onChange={this.handleAdd}
                                >
                                    {colorImgUrl ? (
                                        <Avatar src={colorImgUrl} onLoad={this.imgOnLoad}></Avatar>
                                    ) : (
                                        <UploadBtn
                                            type={this.state.loading ? 'loading' : 'plus'}
                                        ></UploadBtn>
                                    )}
                                </Upload>
                                <p style={{ textAlign: 'center' }}>花布图</p>
                            </Col>
                            <Col span="16">
                                <Form.Item label={<span>编号</span>}>
                                    {getFieldDecorator('code', {
                                        rules: [
                                            {
                                                required: true,
                                                message: 'Please input code!',
                                                whitespace: true,
                                            },
                                        ],
                                    })(<Input style={{ width: '160px' }} />)}
                                </Form.Item>
                                <Form.Item label={<span>画布单循环宽度(cm)</span>}>
                                    {getFieldDecorator('size', {
                                        rules: [
                                            {
                                                required: true,
                                                message: 'Please input width!',
                                                whitespace: true,
                                            },
                                        ],
                                    })(<Input style={{ width: '160px' }} />)}
                                </Form.Item>
                            </Col>
                        </>
                    ) : (
                        <Col span="8">
                            <Form.Item label={<span>编号</span>}>
                                {getFieldDecorator('code', {
                                    rules: [
                                        {
                                            required: true,
                                            message: 'Please input codex!',
                                            whitespace: true,
                                        },
                                    ],
                                })(<Input style={{ width: '160px' }} />)}
                            </Form.Item>
                            <Form.Item label={<span>颜色值</span>}>
                                {getFieldDecorator('value', {
                                    rules: [
                                        {
                                            required: true,
                                            message: 'Please input value!',
                                            whitespace: true,
                                        },
                                    ],
                                })(<Input style={{ width: '160px' }} />)}
                            </Form.Item>
                        </Col>
                    )}
                </Row>
                <Row>
                    <Col span="2"></Col>
                    <Col span="8">
                        <Form.Item>
                            <Button
                                disabled={!this.state.onLoad}
                                type="primary"
                                onClick={this.handleSubmit.bind(this)}
                            >
                                确认添加
                            </Button>
                        </Form.Item>
                    </Col>
                </Row>
            </Form>
        );
    }
}

export default Form.create({
    name: 'inputFlower',
})(RegistrationForm);
