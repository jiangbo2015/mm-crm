import React from 'react';
import { Form, Input, Checkbox } from 'antd';
const CheckboxGroup = Checkbox.Group;
import { connect } from 'dva';

@connect(state => ({
    channelList: state.channel.list || [],
}))
class RegistrationForm extends React.Component {
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

        const plainOptions = this.props.channelList.map(x => {
            return {
                label: x.name,
                value: x._id,
            };
        });

        return (
            <Form {...formItemLayout}>
                <Form.Item label="账号">
                    {getFieldDecorator('account', {
                        rules: [
                            {
                                required: true,
                                message: 'Please input your account!',
                            },
                        ],
                    })(<Input />)}
                </Form.Item>
                <Form.Item label={<span>密码</span>}>
                    {getFieldDecorator('password', {
                        rules: [
                            {
                                required: true,
                                message: 'Please input password!',
                                whitespace: true,
                            },
                        ],
                    })(<Input />)}
                </Form.Item>
                <Form.Item label="姓名" hasFeedback>
                    {getFieldDecorator('name', {
                        rules: [
                            {
                                required: true,
                                message: 'Please input your name!',
                            },
                        ],
                    })(<Input />)}
                </Form.Item>
                <Form.Item label="所在地">
                    {getFieldDecorator('address', {
                        rules: [],
                    })(<Input />)}
                </Form.Item>
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

                <Form.Item label="通道">
                    {getFieldDecorator('channels', {
                        rules: [],
                    })(<CheckboxGroup options={plainOptions} />)}
                </Form.Item>

                <Form.Item label="备注">
                    {getFieldDecorator('remark', {
                        rules: [],
                    })(<Input.TextArea />)}
                </Form.Item>
            </Form>
        );
    }
}

export default Form.create({
    name: 'inputProductor',
})(RegistrationForm);
