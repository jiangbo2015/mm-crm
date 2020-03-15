import React from 'react';
import { Form, Input, Select, Upload, Button, Row, Col, Divider } from 'antd';
const { Option } = Select;
import { uploadProps, Avatar, UploadBtn } from '../../colors/UploadCom';
import { connect } from 'dva';

@connect(state => ({
    imgUrl: state.goods.imgUrl,
    category: state.goods.category,
    sizeList: state.global.sizeList,
}))
class RegistrationForm extends React.Component {
    state = {
        imgUrl: '',
        loading: false,
    };

    handleChange = info => {
        console.log(info);
        if (info.file.status === 'uploading') {
            this.setState({ loading: true });
            return;
        }
        if (info.file.status === 'done') {
            this.setState({
                loading: false,
            });
            this.props.dispatch({
                type: 'goods/setImgUrl',
                payload: info.file.response.data.url,
            });
        }
    };

    handleAdd = () => {
        this.props.dispatch({
            type: 'goods/setCategories',
            payload: this.props.category.concat({}),
        });
    };

    handleDelete = (e, index) => {
        console.log(index);
        const copy = [].concat(this.props.category);
        copy.splice(index, 1);
        console.log(copy);
        this.props.dispatch({
            type: 'goods/setCategories',
            payload: copy,
        });
    };

    render() {
        const { imgUrl, category } = this.props;
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
        const { sizeList } = this.props;
        const sizes = sizeList.map(x => ({
            _id: x._id,
            name: x.values.map(i => i.name).join('/'),
        }));
        return (
            <Form {...formItemLayout}>
                <Form.Item label={<span>名称</span>}>
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
                <Form.Item label={<span>展示名字</span>}>
                    {getFieldDecorator('aliasName', {
                        rules: [
                            {
                                required: true,
                                message: 'Please input aliasName!',
                                whitespace: true,
                            },
                        ],
                    })(<Input />)}
                </Form.Item>
                <Form.Item label={<span>商品图</span>}>
                    <Upload {...uploadProps} onChange={this.handleChange}>
                        {imgUrl ? (
                            <Avatar src={imgUrl}></Avatar>
                        ) : (
                            <UploadBtn type={this.state.loading ? 'loading' : 'plus'}></UploadBtn>
                        )}
                    </Upload>
                </Form.Item>
                <Divider orientation="left">商品分类</Divider>
                <Row gutter={[20]}>
                    <Col span="10">名称</Col>
                    <Col span="10">尺码</Col>
                </Row>
                {category.map((item, index) => (
                    <Row gutter={[20]}>
                        <Col span="10">
                            <Form.Item label="">
                                {getFieldDecorator(`cname${index}`, {
                                    rules: [
                                        {
                                            required: true,
                                            message: 'Please input name!',
                                            whitespace: true,
                                        },
                                    ],
                                })(<Input />)}
                            </Form.Item>
                        </Col>
                        <Col span="10">
                            <Form.Item label="">
                                {getFieldDecorator(`size${index}`, {
                                    rules: [
                                        {
                                            required: true,
                                            message: '请选择size',
                                        },
                                    ],
                                })(
                                    <Select placeholder="请选择">
                                        {sizes.map((x, i) => (
                                            <Option value={x._id} key={i}>
                                                {x.name}
                                            </Option>
                                        ))}
                                    </Select>,
                                )}
                            </Form.Item>
                        </Col>
                        <Col span="2">
                            {index > 0 && (
                                <Button
                                    shape="circle"
                                    icon="delete"
                                    type="danger"
                                    onClick={e => this.handleDelete(e, index)}
                                />
                            )}
                        </Col>
                        <Col span="2">
                            {index === category.length - 1 && (
                                <Button
                                    shape="circle"
                                    icon="plus"
                                    type="primary"
                                    onClick={this.handleAdd}
                                />
                            )}
                        </Col>
                    </Row>
                ))}
            </Form>
        );
    }
}

export default Form.create({
    name: 'inputDesiner',
})(RegistrationForm);
