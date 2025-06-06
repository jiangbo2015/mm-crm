import React from 'react';
import { Form } from '@ant-design/compatible';
import '@ant-design/compatible/assets/index.css';
import { Input } from 'antd';
import { injectIntl } from 'umi'
// import { intl } from '@/utils/utils'

class RegistrationForm extends React.Component {
    state = {};

    render() {
        const {intl} = this.props
        const { getFieldDecorator } = this.props.form;
        console.log(this.props);
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
            <Form {...formItemLayout}>
                <Form.Item label={<span>{intl.formatMessage({id: "账号"})}</span>}>
                    {getFieldDecorator('account', {
                        rules: [
                            {
                                required: true,
                                message: 'Please input accent!',
                                whitespace: true,
                            },
                        ],
                    })(<Input />)}
                </Form.Item>
                <Form.Item label={<span>{intl.formatMessage({id: "姓名"})}</span>}>
                    {getFieldDecorator('name', {
                        rules: [
                            {
                                required: true,
                                message: 'Please input name!',
                                whitespace: true,
                            },
                        ],
                    })(<Input />)}
                </Form.Item>
                <Form.Item label={intl.formatMessage({id: "密码"})}>
                    {getFieldDecorator('password', {
                        rules: [
                            {
                                required: true,
                                message: 'Please input your password!',
                            },
                        ],
                    })(<Input />)}
                </Form.Item>
            </Form>
        );
    }
}

export default Form.create({
    name: 'inputDesiner',
})(injectIntl(RegistrationForm));
