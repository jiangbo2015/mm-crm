import React from 'react';
import { Form } from '@ant-design/compatible';
import '@ant-design/compatible/assets/index.css';
import { Input, Select } from 'antd';
import { injectIntl } from 'umi'


class ChannelForm extends React.Component {
    componentDidMount() {
        // 在组件挂载后设置初始值
        if (this.props.form && this.props.code) {
            this.props.form.setFieldsValue({ code: this.props.code });
        }
    }
    render() {
        const { intl } = this.props
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
            <Form {...formItemLayout}>
                <Form.Item label={<span>{intl.formatMessage({id: '通道编号'})}</span>}>
                    {getFieldDecorator('code', {
                        rules: [
                            {
                                required: true,
                                message: 'Please input code!',
                                whitespace: true,
                            },
                        ],
                    })(<Input disabled/>)}
                </Form.Item>
                <Form.Item label={<span>{intl.formatMessage({id: '通道名称'})}</span>}>
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
                <Form.Item label={intl.formatMessage({id: "备注"})}>
                    {getFieldDecorator('remark', {
                        rules: [
                            {
                                required: false
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
})(injectIntl(ChannelForm));
