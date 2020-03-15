import React from 'react';
import { Form, Input, Row, Select, Col } from 'antd';

const { Option } = Select;

import { connect } from 'dva';

@connect(state => ({
    channelList: state.channel.list || [],
}))
class RegistrationForm extends React.Component {
    
    render() {
        const { channelList = { docs: [] }} = this.props;
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
        const tdSelector = getFieldDecorator('channels', {
            rules: [
                {
                    required: true,
                    message: '请选择通道!',
                },
            ],
        })(
            <Select placeholder="请选择">
                {channelList.docs.map((item, index) => (
                    <Option value={item._id}>{item.name}</Option>
                ))}
            </Select>,
        );

        const productorSelector = getFieldDecorator('currency', {
            rules: [
                {
                    required: true,
                    message: '请选择货币',
                },
            ],
        })(
            <Select placeholder="请选择">
                <Option value={0}>人民币</Option>
                <Option value={1}>美元</Option>
                <Option value={2}>欧元</Option>
            </Select>,
        );
        
        console.log('-----channelList-----')
        console.log(channelList)
        return (
            <Form {...formItemLayout}>
                <Row>
                    <Col span="12">
                        <Form.Item label={<span>账号</span>}>
                            {getFieldDecorator('account', {
                                rules: [
                                    {
                                        required: true,
                                        message: 'Please input account!',
                                        whitespace: true,
                                    },
                                ],
                            })(<Input />)}
                        </Form.Item>
                    </Col>
                    <Col span="12">
                        <Form.Item label="密码">
                            {getFieldDecorator('password', {
                                rules: [
                                    {
                                        required: true,
                                        message: 'Please input your password!',
                                    },
                                ],
                            })(<Input />)}
                        </Form.Item>
                    </Col>
                </Row>
                <Row>
                    <Col span="12">
                        <Form.Item label="姓名">
                            {getFieldDecorator('name', {
                                rules: [
                                    {
                                        required: true,
                                        message: 'Please input your name!',
                                    },
                                ],
                            })(<Input />)}
                        </Form.Item>
                    </Col>
                    <Col span="12">
                        <Form.Item label="邮箱">
                            {getFieldDecorator('email', {
                                rules: [
                                    {
                                        type: 'email',
                                        message: 'The input is not valid E-mail!',
                                    },
                                ],
                            })(<Input />)}
                        </Form.Item>
                    </Col>
                </Row>
                <Row>
                    <Col span="12">
                        <Form.Item label="联系人">
                            {getFieldDecorator('contact', {
                                rules: [],
                            })(<Input />)}
                        </Form.Item>
                    </Col>
                    <Col span="12">
                        <Form.Item label="联系电话">
                            {getFieldDecorator('phone', {
                                rules: [],
                            })(<Input />)}
                        </Form.Item>
                    </Col>
                </Row>
                <Row>
                    <Col span="12">
                        <Form.Item label="客户类型">
                            {getFieldDecorator('customerType', {
                                rules: [],
                            })(<Input />)}
                        </Form.Item>
                    </Col>
                    <Col span="12">
                        <Form.Item label="地址">
                            {getFieldDecorator('address', {
                                rules: [],
                            })(<Input />)}
                        </Form.Item>
                    </Col>
                </Row>
                <Row>
                    <Col span="12">
                        <Form.Item label="通道">{tdSelector}</Form.Item>
                    </Col>
                    <Col span="12">
                        <Form.Item label="货币">{productorSelector}</Form.Item>
                    </Col>
                </Row>

                <Row>
                    <Col span="12">
                        <Form.Item label="备注">
                            {getFieldDecorator('remark', {
                                rules: [],
                            })(<Input.TextArea />)}
                        </Form.Item>
                    </Col>
                </Row>
            </Form>
        );
    }
}

export default Form.create({
    name: 'inputProductor',
})(RegistrationForm);
