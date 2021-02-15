import React from 'react';
import { PlusSquareOutlined, QuestionCircleOutlined } from '@ant-design/icons';
import { Form } from '@ant-design/compatible';
import '@ant-design/compatible/assets/index.css';
import {
    Input,
    Row,
    Col,
    Upload,
    InputNumber,
    Tooltip,
    Divider,
    Checkbox,
    message,
    Popover,
    Button,
    Select,
} from 'antd';
import styles from './index.less';
import { connect } from 'dva';
// import ColorCom from '../../colors/Color';
import { uploadProps, Avatar, UploadBtn } from '../../colors/UploadCom';
import SizeSelect from '@/components/SizeSelect';
import { filterImageUrl } from '@/utils/utils';
const Option = Select.Option;

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
        vposition:
            this.props.editData && this.props.editData.vposition
                ? this.props.editData.vposition
                : 'center',
        styleSize:
            this.props.editData && this.props.editData.styleSize
                ? this.props.editData.styleSize
                : 27,
        styleBackSize:
            this.props.editData && this.props.editData.styleBackSize
                ? this.props.editData.styleBackSize
                : 27,
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
            name: `${good.name}-${good.aliasName}`,
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
        const { vposition, styleSize, styleBackSize } = this.state;
        // console.log({ scale });

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
                                <Avatar src={imgUrl}></Avatar>
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
                    </Col>
                    <Col span="12">
                        <Form.Item
                            label={
                                <Tooltip title="不同通道会根据系统设施汇率显示价格">
                                    <span>
                                        价格(人民币)&nbsp;
                                        <QuestionCircleOutlined
                                            style={{ color: 'red' }}
                                        ></QuestionCircleOutlined>
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
                        <Form.Item label="尺码段" name="size">
                            {getFieldDecorator('size', {
                                rules: [
                                    {
                                        message: 'Please input size!',
                                    },
                                ],
                            })(<SizeSelect />)}
                        </Form.Item>
                    </Col>
                </Row>
                <Divider className={styles.divider} orientation="left">
                    款式显示相关
                </Divider>
                <Row>
                    {/* <Col span="6">
                        <Form.Item label="缩放比">
                            {getFieldDecorator('scale', { initialValue: 58 })(
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
                        </Form.Item>
                    </Col> */}
                    <Col span="12">
                        <Row>
                            <Col span="12">
                                <Form.Item label="款式正面宽">
                                    {getFieldDecorator('styleSize', {
                                        rules: [],
                                        initialValue: 27,
                                    })(
                                        <InputNumber
                                            formatter={value =>
                                                `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                                            }
                                            parser={value => value.replace(/\$\s?|(,*)/g, '')}
                                            onChange={val => {
                                                this.setState({
                                                    ...this.state,
                                                    styleSize: val,
                                                });
                                            }}
                                        />,
                                    )}
                                    cm
                                </Form.Item>
                            </Col>
                            <Col span="12">
                                <Form.Item label="款式背面宽">
                                    {getFieldDecorator('styleBackSize', {
                                        rules: [],
                                        initialValue: 27,
                                    })(
                                        <InputNumber
                                            formatter={value =>
                                                `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                                            }
                                            parser={value => value.replace(/\$\s?|(,*)/g, '')}
                                            onChange={val => {
                                                this.setState({
                                                    ...this.state,
                                                    styleBackSize: val,
                                                });
                                            }}
                                        />,
                                    )}
                                    cm
                                </Form.Item>
                            </Col>
                        </Row>

                        <Row>
                            <Col span="20">
                                <Form.Item label="正背面对齐方式" info="决定搭配页面正背面对齐方式">
                                    {getFieldDecorator('vposition', { initialValue: 'center' })(
                                        <Select
                                            onChange={val => {
                                                this.setState({
                                                    ...this.state,
                                                    vposition: val,
                                                });
                                            }}
                                        >
                                            <Option value="center">垂直居中</Option>
                                            <Option value="flex-start">顶部对齐</Option>
                                            <Option value="flex-end">底部对齐</Option>
                                        </Select>,
                                    )}
                                </Form.Item>
                            </Col>
                        </Row>
                    </Col>
                    <Col
                        span="12"
                        style={{ display: 'flex', padding: '0 50px', alignItems: vposition }}
                    >
                        <div
                            style={{
                                color: 'rgba(0,0,0,0.2)',
                                position: 'absolute',
                                top: '20px',
                                left: '160px',
                            }}
                        >
                            预览显示区
                        </div>
                        <div
                            style={{
                                width: '160px',
                            }}
                        >
                            {shadowUrl ? (
                                <img
                                    src={filterImageUrl(shadowUrl)}
                                    style={{ width: `${styleSize * 2}%` }}
                                />
                            ) : null}
                        </div>
                        <div
                            style={{
                                width: '160px',
                            }}
                        >
                            {shadowUrlBack ? (
                                <img
                                    src={filterImageUrl(shadowUrlBack)}
                                    style={{ width: `${styleBackSize * 2}%` }}
                                />
                            ) : null}
                        </div>
                        {/* </div> */}
                    </Col>

                    {/* <Col span="6"> */}
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
                    {/* </Col> */}
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
                                <PlusSquareOutlined />
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
