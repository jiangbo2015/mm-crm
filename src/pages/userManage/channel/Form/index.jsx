import React from 'react';
import { Form } from '@ant-design/compatible';
import '@ant-design/compatible/assets/index.css';
import { Input, Select } from 'antd';
const { Option } = Select;

class RegistrationForm extends React.Component {
    state = {};

    render() {
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
                <Form.Item label={<span>通道编号</span>}>
                    {getFieldDecorator('code', {
                        rules: [
                            {
                                required: true,
                                message: 'Please input code!',
                                whitespace: true,
                            },
                        ],
                    })(<Input />)}
                </Form.Item>
                <Form.Item label={<span>通道名称</span>}>
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
                <Form.Item label="货币">
                    {getFieldDecorator('currency', {
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
                    )}
                </Form.Item>
            </Form>
        );
    }
}

export default Form.create({
    name: 'inputDesiner',
})(RegistrationForm);
