import React from 'react';
import { Form, Input, Select, Row, Col, notification, Upload, Button } from 'antd';
// var isHexcolor = require('is-hexcolor');
import { connect } from 'dva';

@connect(state => ({
    currentSize: state.global.currentSize,
}))
class RegistrationForm extends React.Component {
    // formRef = React.createRef()
    handleSubmit() {
        this.props.form.validateFields((err, values) => {
            if (err) return;
            this.props.dispatch({
                type: 'system/addHelpFile',
                payload: {
                    ...values,
                },
            });
        });
    }
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
        return (
            <Form {...formItemLayout} name="inputDesiner">
                <Row>
                    <Col span="24">
                        <Form.Item label={<span>文件名</span>}>
                            {getFieldDecorator('name', {
                                rules: [
                                    {
                                        required: true,
                                        message: 'Please input name!',
                                        whitespace: true,
                                    },
                                ],
                            })(<Input style={{ width: '160px' }} />)}
                        </Form.Item>

                        <Form.Item label={<span>类型</span>}>
                            {getFieldDecorator('type', {
                                rules: [
                                    {
                                        required: true,
                                        message: 'Please input codex!',
                                        whitespace: true,
                                    },
                                ],
                            })(
                                <Select style={{ width: '160px' }}>
                                    <Select.Option value="文档">文档</Select.Option>
                                    <Select.Option value="视频">视频</Select.Option>
                                </Select>,
                            )}
                        </Form.Item>
                        <Form.Item label={<span>链接</span>}>
                            {getFieldDecorator('url', {
                                rules: [
                                    {
                                        required: true,
                                        message: 'Please input link!',
                                        whitespace: true,
                                    },
                                ],
                            })(<Input style={{ width: '100%' }} />)}
                        </Form.Item>
                    </Col>
                </Row>
                <Row>
                    <Col span="2"></Col>
                    <Col span="8">
                        <Form.Item>
                            <Button type="primary" onClick={this.handleSubmit.bind(this)}>
                                确认
                            </Button>
                        </Form.Item>
                    </Col>
                </Row>
            </Form>
        );
    }
}

export default Form.create({
    name: 'inputHelp',
})(RegistrationForm);
