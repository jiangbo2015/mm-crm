import React from 'react';
import {
    Form,
    Input,
    Row,
    Select,
    Col,
    Upload,
    InputNumber,
    Tooltip,
    Divider,
    Icon,
    notification,
} from 'antd';
import styles from './index.less';
const { Option } = Select;
const { Search } = Input;
import { connect } from 'dva';
import ColorCom from './Color';
import { uploadProps, Avatar, UploadBtn } from './UploadCom';
import { api } from '@/utils/apiconfig';

@connect(state => ({
    colorList: state.style.colorList || [],
    styleImgUrl: state.style.styleImgUrl || '',
    sizeList: state.global.sizeList,
    goodsList: state.goods.list,
    currentCategorys: state.style.currentCategorys,
}))
class RegistrationForm extends React.Component {
    state = {
        loading: false,
        // currentCategorys: [],
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
                type: 'style/setStyleImgUrl',
                payload: info.file.response.data.url,
            });
        }
    };

    handleCategoryChange = (value, option) => {
        console.log('value', value);
        this.props.dispatch({
            type: 'style/setCurrentCategorys',
            payload: this.props.goodsList.find(x => x._id === value).category,
        });
    };

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
        const goodsSelector = getFieldDecorator('goodsId', {
            rules: [
                {
                    required: true,
                    message: '请选择商品!',
                },
            ],
        })(
            <Select placeholder="请选择" onChange={this.handleCategoryChange}>
                {this.props.goodsList.map((item, index) => (
                    <Option value={item._id}>{item.name}</Option>
                ))}
            </Select>,
        );
        const categorySelector = getFieldDecorator('categoryId', {
            rules: [
                {
                    required: true,
                    message: '请选择分类!',
                },
            ],
        })(
            <Select placeholder="请选择">
                {this.props.currentCategorys.map((item, index) => (
                    <Option value={item._id}>{item.name}</Option>
                ))}
            </Select>,
        );

        const { sizeList = [], styleImgUrl } = this.props;
        const sizes = sizeList.map(x => ({
            _id: x._id,
            name: x.values.map(i => i.name).join('/'),
        }));
        const sizeSelector = getFieldDecorator('size', {
            rules: [
                {
                    required: true,
                    message: '请选择尺寸',
                },
            ],
        })(
            <Select placeholder="请选择">
                {sizes.map((item, index) => (
                    <Option key={index} value={item._id}>
                        {item.name}
                    </Option>
                ))}
            </Select>,
        );

        return (
            <Form {...formItemLayout} className="wrap">
                <Row>
                    <Col span="12">
                        <Form.Item label={<span>款号</span>}>
                            {getFieldDecorator('styleNo', {
                                rules: [
                                    {
                                        required: true,
                                        message: 'Please input styleNo!',
                                        whitespace: true,
                                    },
                                ],
                            })(<Input />)}
                        </Form.Item>
                        <Form.Item label="名称">
                            {getFieldDecorator('styleName', {
                                rules: [
                                    {
                                        required: true,
                                        message: 'Please input your styleName!',
                                    },
                                ],
                            })(<Input />)}
                        </Form.Item>

                        <Form.Item
                            label={
                                <Tooltip title="不同通道会根据当时汇率自动转为对应货币价格">
                                    <span>
                                        价格(美元)&nbsp;
                                        <Icon
                                            style={{ color: 'red' }}
                                            type="question-circle"
                                        ></Icon>
                                    </span>
                                </Tooltip>
                            }
                        >
                            {getFieldDecorator('price', {
                                rules: [
                                    {
                                        required: true,
                                        message: 'Please input your price!',
                                    },
                                ],
                            })(
                                <InputNumber
                                    formatter={value =>
                                        `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                                    }
                                    parser={value => value.replace(/\$\s?|(,*)/g, '')}
                                />,
                            )}
                        </Form.Item>
                        <Form.Item
                            label="货币"
                            style={{
                                visibility: 'hidden',
                                height: 0,
                                marginTop: '-10px',
                            }}
                        >
                            {getFieldDecorator('currency', {
                                rules: [],
                                initialValue: 1,
                            })(<Input />)}
                        </Form.Item>
                    </Col>
                    <Col span="12">
                        <Upload {...uploadProps} onChange={this.handleChange}>
                            {styleImgUrl ? (
                                <Avatar src={styleImgUrl}></Avatar>
                            ) : (
                                <UploadBtn
                                    type={this.state.loading ? 'loading' : 'plus'}
                                ></UploadBtn>
                            )}
                        </Upload>
                    </Col>
                </Row>
                <Divider className={styles.divider} />
                <Row>
                    <Col span="8">
                        <Form.Item label="尺码">{sizeSelector}</Form.Item>
                    </Col>
                    <Col span="8">
                        <Form.Item label="商品">{goodsSelector}</Form.Item>
                    </Col>
                    <Col span="8">
                        <Form.Item label="分类">{categorySelector}</Form.Item>
                    </Col>
                </Row>
                <Divider className={styles.divider}></Divider>
                <ColorCom></ColorCom>
            </Form>
        );
    }
}

export default Form.create({
    name: 'inputProductor',
})(RegistrationForm);
