import React from 'react';
import lodash from 'lodash';
import { Form } from '@ant-design/compatible';
import '@ant-design/compatible/assets/index.css';
import { Input, Checkbox, Select } from 'antd';
const CheckboxGroup = Checkbox.Group;
import { connect } from 'dva';
import { injectIntl } from 'umi';

@connect(state => ({
    channelList: {},
    goodsList: state.goods.list || [],
    branchList: state.global.branchList || [],
    capsuleList: state.global.capsuleList || [],
    productorList: state.user.productorList.docs || [],
}))
class RegistrationForm extends React.Component {
    render() {
        const { intl } = this.props
        const { getFieldDecorator } = this.props.form;
        // const { capsuleList, branchList, goodsList } = this.props;
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

        // const goodsOptions = goodsList?.map(g => ({
        //     label: g.name,
        //     value: g._id,
        // }));
        // const branchOptions = branchList?.map(g => ({
        //     label: g.namecn,
        //     value: g._id,
        // }));
        // const capsuleOptions = capsuleList?.map(g => ({
        //     label: g.namecn,
        //     value: g._id,
        // }));


        return (
            <Form {...formItemLayout}>
                <Form.Item label={intl.formatMessage({id: "账号"})}>
                    {getFieldDecorator('account', {
                        rules: [
                            {
                                required: true,
                                message: 'Please input your account!',
                            },
                        ],
                    })(<Input />)}
                </Form.Item>
                <Form.Item label={<span>{intl.formatMessage({id: '密码'})}</span>}>
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
                <Form.Item label={intl.formatMessage({id: "姓名"})} hasFeedback>
                    {getFieldDecorator('name', {
                        rules: [
                            {
                                required: true,
                                message: 'Please input your name!',
                            },
                        ],
                    })(<Input />)}
                </Form.Item>
                <Form.Item label={intl.formatMessage({id: "所在地"})}>
                    {getFieldDecorator('address', {
                        rules: [],
                    })(<Input />)}
                </Form.Item>
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

                {/* <Form.Item label="可见商品">
                    {getFieldDecorator('goods', {
                        rules: [],
                    })(<CheckboxGroup options={goodsOptions} />)}
                </Form.Item>
                <Form.Item label="可见品牌">
                    {getFieldDecorator('branchs', {
                        rules: [],
                    })(<CheckboxGroup options={branchOptions} />)}
                </Form.Item>
                <Form.Item label="可见胶囊">
                    {getFieldDecorator('capsules', {
                        rules: [],
                    })(<CheckboxGroup options={capsuleOptions} />)}
                </Form.Item> */}
                {/* <Form.Item label="货币">{productorSelector}</Form.Item> */}

                <Form.Item label={intl.formatMessage({id: "备注"})}>
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
})(injectIntl(RegistrationForm));
