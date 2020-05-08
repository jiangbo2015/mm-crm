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
    Checkbox,
    message,
} from 'antd';
import styles from './index.less';
const { Option } = Select;
const { Search } = Input;
import { connect } from 'dva';
// import ColorCom from '../../colors/Color';
import { uploadProps, Avatar, UploadBtn } from '../../colors/UploadCom';
import { api } from '@/utils/apiconfig';

@connect(state => ({
    colorList: state.style.colorList || [],
    imgUrl: state.style.imgUrl || '',
    svgUrl: state.style.svgUrl || '',
    svgUrlBack: state.style.svgUrlBack || '',
    shadowUrl: state.style.shadowUrl || '',
    shadowUrlBack: state.style.shadowUrlBack || '',
    sizeList: state.global.sizeList,
    goodsList: state.goods.list,
    currentCategorys: state.style.currentCategorys,
}))
class RegistrationForm extends React.Component {
    state = {
        scale: this.props.editData && this.props.editData.scale ? this.props.editData.scale : 58,
        loading: {
            imgUrl: false,
            svgUrl: false,
            shadowUrl: false,
            svUrlBack: false,
            shadowUrlBack: false,
        },
        urls: {
            imgUrl: this.props.editData ? this.props.editData.imgUrl : '',
            svgUrl: this.props.editData ? this.props.editData.svgUrl : '',
            shadowUrl: this.props.editData ? this.props.editData.shadowUrl : '',
            svgUrlBack: this.props.editData ? this.props.editData.svgUrlBack : '',
            shadowUrlBack: this.props.editData ? this.props.editData.shadowUrlBack : '',
        },
    };

    handleChange = (info, type) => {
        console.log(info);
        if (info.file.status === 'uploading') {
            let tempLoading = {};
            tempLoading[type] = true;
            this.setState({
                loading: { ...this.state.loading, ...tempLoading },
                urls: {
                    ...this.state.urls,
                    [type]: '',
                },
            });
            return;
        }
        if (info.file.status === 'done') {
            let tempLoading = {};
            tempLoading[type] = false;
            let tempUrls = {};
            tempUrls[type] = info.file.response.data.url;
            this.setState(
                {
                    loading: { ...this.state.loading, ...tempLoading },
                    urls: { ...this.state.urls, ...tempUrls },
                },
                () => {
                    this.props.dispatch({
                        type: 'style/setStyleImgUrl',
                        payload: { ...this.state.urls },
                    });
                },
            );
        }
    };

    handleCategoryChange = (value, option) => {
        console.log('value', value);
        this.props.dispatch({
            type: 'style/setCurrentCategorys',
            payload: this.props.goodsList.find(x => x._id === value).category,
        });
    };

    beforeUpload = file => {
        const limit = file.size / 1024 < 300;
        if (!limit) {
            message.error('Image must smaller than 200K!');
        }
        return limit;
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

        const { sizeList = [] } = this.props;

        const { imgUrl, svgUrl, svgUrlBack, shadowUrl, shadowUrlBack } = this.state.urls;
        const { scale } = this.state;
        console.log({ scale });
        // const sizeSelector = getFieldDecorator('size', {
        //     rules: [
        //         {
        //             required: true,
        //             message: '请选择尺寸',
        //         },
        //     ],
        // })(
        //     <Select placeholder="请选择">
        //         {sizes.map((item, index) => (
        //             <Option key={index} value={item._id}>
        //                 {item.name}
        //             </Option>
        //         ))}
        //     </Select>,
        // );

        const checkboxOptions = [
            { label: 'SOUTHERN', value: 'SOUTHERN' },
            { label: 'CENTER', value: 'CENTER' },
            { label: 'NORTH', value: 'NORTH' },
        ];

        const checkboxSelector = getFieldDecorator('tags', {
            rules: [
                {
                    required: true,
                    message: '请选择标签!',
                },
            ],
        })(<Checkbox.Group options={checkboxOptions} defaultValue={['']} />);

        return (
            <Form {...formItemLayout} className="wrap">
                <Row>
                    <Col span="6">
                        <Upload
                            {...uploadProps}
                            beforeUpload={this.beforeUpload}
                            onChange={args => this.handleChange(args, 'imgUrl')}
                        >
                            {imgUrl ? (
                                <Avatar
                                    src={imgUrl}
                                    style={{
                                        width: '100%',
                                        transform: `scale(0.${scale})`,
                                    }}
                                ></Avatar>
                            ) : (
                                <UploadBtn
                                    type={this.state.loading.imgUrl ? 'loading' : 'plus'}
                                ></UploadBtn>
                            )}
                        </Upload>
                        <p style={{ textAlign: 'center' }}>款式图</p>
                    </Col>
                    <Col span="8">
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
                        <Form.Item label="缩放比">
                            {getFieldDecorator('scale')(
                                <InputNumber
                                    min={20}
                                    max={100}
                                    step={1}
                                    onChange={val => {
                                        this.setState({
                                            ...this.state,
                                            scale: val,
                                        });
                                    }}
                                />,
                            )}
                            %(默认值58%)
                        </Form.Item>
                    </Col>
                    <Col span="10">
                        <Form.Item
                            label={
                                <Tooltip title="不同通道会根据当时汇率自动转为对应货币价格">
                                    <span>
                                        价格(人民币)&nbsp;
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
                                        `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
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
                </Row>
                <Divider className={styles.divider} orientation="left">
                    正视图
                </Divider>
                <Row>
                    <Col span="8">
                        <Upload
                            {...uploadProps}
                            onChange={args => this.handleChange(args, 'svgUrl')}
                        >
                            {svgUrl ? (
                                <Avatar src={svgUrl}></Avatar>
                            ) : (
                                <UploadBtn
                                    type={this.state.loading.svgUrl ? 'loading' : 'plus'}
                                ></UploadBtn>
                            )}
                        </Upload>
                        <p style={{ textAlign: 'center' }}>SVG轮廓图</p>
                    </Col>
                    <Col span="8">
                        <Upload
                            {...uploadProps}
                            beforeUpload={this.beforeUpload}
                            onChange={args => this.handleChange(args, 'shadowUrl')}
                        >
                            {shadowUrl ? (
                                <Avatar src={shadowUrl}></Avatar>
                            ) : (
                                <UploadBtn
                                    type={this.state.loading.shadowUrl ? 'loading' : 'plus'}
                                ></UploadBtn>
                            )}
                        </Upload>
                        <p style={{ textAlign: 'center' }}>光阴覆盖层</p>
                    </Col>
                </Row>
                <Divider className={styles.divider} orientation="left">
                    后视图
                </Divider>
                <Row>
                    <Col span="8">
                        <Upload
                            {...uploadProps}
                            onChange={args => this.handleChange(args, 'svgUrlBack')}
                        >
                            {svgUrlBack ? (
                                <Avatar src={svgUrlBack}></Avatar>
                            ) : (
                                <UploadBtn
                                    type={this.state.loading.svgUrlBack ? 'loading' : 'plus'}
                                ></UploadBtn>
                            )}
                        </Upload>
                        <p style={{ textAlign: 'center' }}>SVG轮廓图</p>
                    </Col>
                    <Col span="8">
                        <Upload
                            {...uploadProps}
                            beforeUpload={this.beforeUpload}
                            onChange={args => this.handleChange(args, 'shadowUrlBack')}
                        >
                            {shadowUrlBack ? (
                                <Avatar src={shadowUrlBack}></Avatar>
                            ) : (
                                <UploadBtn
                                    type={this.state.loading.shadowUrlBack ? 'loading' : 'plus'}
                                ></UploadBtn>
                            )}
                        </Upload>
                        <p style={{ textAlign: 'center' }}>光阴覆盖层</p>
                    </Col>
                </Row>
                <Divider className={styles.divider} />
                <Row>
                    {/* <Col span="8">
                        <Form.Item label="尺码">{sizeSelector}</Form.Item>
                    </Col> */}
                    <Col span="8">
                        <Form.Item label="商品">{goodsSelector}</Form.Item>
                    </Col>
                    <Col span="8">
                        <Form.Item label="分类">{categorySelector}</Form.Item>
                    </Col>
                </Row>
                <Row style={{ marginLeft: '-14%' }}>
                    <Col span="16">
                        <Form.Item label="标签">{checkboxSelector}</Form.Item>
                    </Col>
                </Row>
            </Form>
        );
    }
}

export default Form.create({
    name: 'inputProductor',
})(RegistrationForm);
