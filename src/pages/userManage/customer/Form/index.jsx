import React from 'react';
import { Form, Input, Row, Select, Col } from 'antd';
// import wcc from 'world-countries-capitals';
import { connect } from 'dva';

const { Option } = Select;
// const allCountries = wcc.getAllCountries();
// console.log(allCountries);
@connect(state => ({
    channelList: state.channel.list || [],
}))
class RegistrationForm extends React.Component {
    state = {
        productorName: this.props.channelId,
    };
    render() {
        const { channelList = { docs: [], map: {} } } = this.props;
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
            <Select
                placeholder="请选择"
                onChange={val => {
                    this.setState({
                        productorName: val,
                    });
                }}
            >
                {channelList.docs.map((item, index) => (
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

        console.log('-----channelList-----');
        console.log(channelList);
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
                <Row></Row>
                <Row>
                    <Col span="12">
                        <Form.Item label="通道">
                            {tdSelector}
                            <div>
                                产品经理：
                                {channelList.map[this.state.productorName]
                                    ? channelList.map[this.state.productorName]
                                    : ''}
                            </div>
                        </Form.Item>
                    </Col>
                    <Col span="12">
                        <Form.Item label="客户类型">
                            {getFieldDecorator('customerType', {
                                rules: [],
                            })(<Input />)}
                        </Form.Item>
                    </Col>
                </Row>

                <Row>
                    <Col span="12">
                        <Form.Item label="地址">
                            {/* {allCountriesSelector} */}

                            {getFieldDecorator('address', {
                                rules: [],
                            })(<Input placeholder="详细地址" />)}
                            {getFieldDecorator('postcode', {
                                rules: [],
                            })(<Input placeholder="邮编" />)}
                        </Form.Item>
                    </Col>
                    {/* Shipping address */}
                    <Col span="12">
                        <Form.Item label="备注">
                            {getFieldDecorator('remark', {
                                rules: [],
                            })(<Input.TextArea />)}
                        </Form.Item>
                    </Col>
                </Row>
                <Row>
                    <Col span="12">
                        <Form.Item label="税号">
                            {getFieldDecorator('dutyparagraph', {
                                rules: [],
                            })(<Input />)}
                        </Form.Item>
                    </Col>
                    <Col span="12">
                        <Form.Item label="托运地址">
                            {/* {allShippingCountriesSelector} */}

                            {getFieldDecorator('shippingaddress', {
                                rules: [],
                            })(<Input placeholder="详细地址" />)}
                            {getFieldDecorator('shippingpostcode', {
                                rules: [],
                            })(<Input placeholder="邮编" />)}
                        </Form.Item>
                    </Col>
                    {/* Shipping address */}
                </Row>
            </Form>
        );
    }
}

export default Form.create({
    name: 'inputProductor',
})(RegistrationForm);
