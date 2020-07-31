import React from 'react';
import {
    Form,
    Input,
    Row,
    Col,
    Upload,
    InputNumber,
    Tooltip,
    Divider,
    Icon,
    Checkbox,
    message,
    Popover,
    Button,
} from 'antd';
import styles from './index.less';
import { connect } from 'dva';
// import ColorCom from '../../colors/Color';
import { uploadProps, Avatar, UploadBtn } from '../../colors/UploadCom';

@connect(state => ({
    colorList: state.style.colorList || [],
    imgUrl: state.style.imgUrl || '',
    svgUrl: state.style.svgUrl || '',
    svgUrlBack: state.style.svgUrlBack || '',
    shadowUrl: state.style.shadowUrl || '',
    shadowUrlBack: state.style.shadowUrlBack || '',
    sizeList: state.global.sizeList,
    tagList: state.style.tagList || [],
    goodsList: state.goods.list,
    currentCategorys: state.style.currentCategorys,
}))
class RegistrationForm extends React.Component {
    state = {
        addTagName: '',
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
    checkboxOptions = this.props.goodsList.map(good => {
        let checkList = good.category.map(tag => ({ label: tag.name, value: tag._id }));
        return {
            name: good.name,
            id: good._id,
            checkList,
        };
    });

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

    // handleCategoryChange = (value, option) => {
    //     console.log('value', value);
    //     this.props.dispatch({
    //         type: 'style/setCurrentCategorys',
    //         payload: this.props.goodsList.find(x => x._id === value).category,
    //     });
    // };

    beforeUpload = file => {
        const limit = file.size / 1024 < 300;
        if (!limit) {
            message.error('Image must smaller than 200K!');
        }
        return limit;
    };

    handleAddTag = () => {
        const { addTagName } = this.state;
        this.props.dispatch({
            type: 'style/addStyleTag',
            payload: { name: addTagName },
        });
    };

    handleSelectAllByGoodId = (goodId, bool) => {
        let temp = {};
        if (bool) {
            let obj = this.checkboxOptions.find(c => c.id === goodId);
            if (obj) {
                temp[`goods-${goodId}`] = obj.checkList.map(c => c.value);
            }
        } else {
            temp[`goods-${goodId}`] = [];
        }

        this.props.form.setFieldsValue({
            ...temp,
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

        // const checkboxOptions = [
        //     { label: 'SOUTHERN', value: 'SOUTHERN' },
        //     { label: 'CENTER', value: 'CENTER' },
        //     { label: 'NORTH', value: 'NORTH' },
        // ];

        const checkboxOptions = this.props.tagList.map(tag => ({ label: tag, value: tag }));
        const checkboxSelector = getFieldDecorator('tags', {
            rules: [
                {
                    required: true,
                    message: '请选择标签!',
                },
            ],
        })(<Checkbox.Group options={checkboxOptions} />);

        return (
            <Form {...formItemLayout} className="wrap">
                <Row>
                    <Col span="4">
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
                            {'默认值58'}
                        </Form.Item>
                    </Col>
                    <Col span="12" style={{ paddingLeft: '12px' }}>
                        <Form.Item
                            label={
                                <Tooltip title="不同通道会根据系统设施汇率显示价格">
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
                            label="款式宽"
                            style={{
                                height: 0,
                                marginTop: '-10px',
                            }}
                        >
                            {getFieldDecorator('styleSize', {
                                rules: [],
                                initialValue: 27,
                            })(
                                <InputNumber
                                    formatter={value =>
                                        `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                                    }
                                    parser={value => value.replace(/\$\s?|(,*)/g, '')}
                                />,
                            )}
                            cm
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
                <Divider className={styles.divider} orientation="left">
                    商品分类
                </Divider>
                <Row>
                    <Col span="2"></Col>
                    <Col span="22">
                        <Form.Item>
                            {this.checkboxOptions.map((options, index) => (
                                <>
                                    <Divider orientation="left" plain style={{ margin: 0 }}>
                                        {options.name}
                                    </Divider>
                                    <div
                                        style={{
                                            lineHeight: '20px',
                                            textDecorationLine: 'underline',
                                        }}
                                    >
                                        <a
                                            style={{
                                                color: 'rgba(0, 0, 0, 0.65)',
                                            }}
                                            onClick={() => {
                                                this.handleSelectAllByGoodId(options.id, true);
                                            }}
                                        >
                                            全选
                                        </a>
                                        |
                                        <a
                                            onClick={() => {
                                                this.handleSelectAllByGoodId(options.id, false);
                                            }}
                                            style={{
                                                color: 'rgba(0, 0, 0, 0.65)',
                                            }}
                                        >
                                            全不选
                                        </a>
                                    </div>
                                    {getFieldDecorator(`goods-${options.id}`, {
                                        // rules: [
                                        //     {
                                        //         required: true,
                                        //         message: '请选择标签!',
                                        //     },
                                        // ],
                                    })(<Checkbox.Group options={options.checkList} />)}
                                </>
                            ))}
                        </Form.Item>
                    </Col>
                </Row>
                <Divider className={styles.divider} />
                <Row style={{ marginLeft: '-14%' }}>
                    <Col span="16">
                        <Form.Item label="标签">{checkboxSelector}</Form.Item>
                    </Col>
                    <Col span="8">
                        <div style={{ lineHeight: '36px' }}>
                            <Popover
                                content={
                                    <div style={{ display: 'flex' }}>
                                        <Input
                                            onChange={e => {
                                                this.setState({
                                                    ...this.state,
                                                    addTagName: e.target.value,
                                                });
                                            }}
                                        />
                                        <Button
                                            onClick={this.handleAddTag.bind(this)}
                                            style={{ marginLeft: '4px' }}
                                            type="primary"
                                        >
                                            确认
                                        </Button>
                                    </div>
                                }
                            >
                                <Icon type="plus-square" />
                            </Popover>
                        </div>
                    </Col>
                </Row>
            </Form>
        );
    }
}

export default Form.create({
    name: 'inputProductor',
})(RegistrationForm);
