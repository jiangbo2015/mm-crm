import React from 'react';
import { Form } from '@ant-design/compatible';
import '@ant-design/compatible/assets/index.css';
import { Input, Row, Select, Col } from 'antd';
import { get,map } from 'lodash';
import { connect } from 'dva';
import { injectIntl } from 'umi'

const { Option } = Select;
// const allCountries = wcc.getAllCountries();
// console.log(allCountries);
@connect(({ channel }) => ({
    channelList: get(channel, "list"),
}))
class RegistrationForm extends React.Component {
    state = {
        productorName: this.props.channelId,
    };
    render() {
        const { channelList, intl } = this.props;
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
        const tdSelector = getFieldDecorator('channel', {
            rules: [
                {
                    required: false
                },
            ],
        })(
            <Select
                placeholder="请选择"
                onChange={val => {
                    this.setState({
                        productorName: val,
                    });
                }}
            >
                {map(channelList, (item, index) => (
                    <Option value={item._id}>{item.name}</Option>
                ))}
            </Select>,
        );

        // const allCountriesSelector = getFieldDecorator('countries', {
        //     rules: [
        //         {
        //             message: '请选择国家!',
        //         },
        //     ],
        // })(
        //     <Select
        //         placeholder="请选择国家"
        //         showSearch
        //         filterOption={(input, option) =>
        //             option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
        //         }
        //     >
        //         {allCountries.map((item, index) => (
        //             <Option value={item.toUpperCase()} key={`${item}-${index}`}>
        //                 {item.toUpperCase()}
        //             </Option>
        //         ))}
        //     </Select>,
        // );
        // const allShippingCountriesSelector = getFieldDecorator('shippingcountries', {
        //     rules: [
        //         {
        //             message: '请选择国家!',
        //         },
        //     ],
        // })(
        //     <Select
        //         placeholder="请选择国家"
        //         showSearch
        //         filterOption={(input, option) =>
        //             option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
        //         }
        //     >
        //         {allCountries.map((item, index) => (
        //             <Option value={item.toUpperCase()} key={`${item}-${index}`}>
        //                 {item.toUpperCase()}
        //             </Option>
        //         ))}
        //     </Select>,
        // );
        // const productorSelector = getFieldDecorator('currency', {
        //     rules: [
        //         {
        //             required: true,
        //             message: '请选择货币',
        //         },
        //     ],
        // })(
        //     <Select placeholder="请选择">
        //         <Option value={0}>人民币</Option>
        //         <Option value={1}>美元</Option>
        //         <Option value={2}>欧元</Option>
        //     </Select>,
        // );

        return (
            <Form {...formItemLayout}>
                <Row>
                    <Col span="12">
                        <Form.Item label={<span>{intl.formatMessage({id: '账号'})}</span>}>
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
                    </Col>
                </Row>
                <Row>
                    <Col span="12">
                        <Form.Item label={intl.formatMessage({id: "姓名"})}>
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
                        <Form.Item label={intl.formatMessage({id: "邮箱"})}>
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
                <Row></Row>
                <Row>
                    <Col span="12">
                        <Form.Item label={intl.formatMessage({id: "通道"})}>
                            {tdSelector}
                        </Form.Item>
                    </Col>
                </Row>
            </Form>
        );
    }
}

export default Form.create({
    name: 'inputProductor',
})(injectIntl(RegistrationForm));
