import { filterImageUrl } from '@/utils/utils';
import { Form } from '@ant-design/compatible';
import '@ant-design/compatible/assets/index.css';
import {
    Button,
    Checkbox,
    Col,
    Input,
    InputNumber,
    message,
    notification,
    Row,
    Select,
    Upload,
} from 'antd';
import { connect } from 'dva';
import React from 'react';
import { filter } from 'lodash'; 

import { Avatar, UploadBtn, uploadProps } from '../UploadCom';
import { colorSystemList } from '../../colors/From/index';

const ColorOptionLabel = ({ c = {} }) => (
    <div style={{ display: 'flex', alignItems: 'center' }}>
        <div
            style={{
                width: '18px',
                height: '18px',
                background: c.type ? `url(${filterImageUrl(c.value)}?tr=w-50)` : c.value,
            }}
        ></div>
        {`${c.code}(${c.namecn})`}
    </div>
);

@connect(state => ({
    currentSize: state.global.currentSize,
    goodsList: state.goods.list,
    colorList: state.global.colorList,
}))
class RegistrationForm extends React.Component {
    constructor(props) {
        super(props);
        const { colorImgUrl = '', colorImgWidth = 0, colorImgHeight = 0, onLoad = false } = props;
        this.state = {
            colorImgUrl,
            colorImgWidth,
            colorImgHeight,
            onLoad,
        };
    }

    componentDidMount() {
        if (this.props.updateColor) {
            this.props?.onUpdateForm?.();
        }
    }

    // formRef = React.createRef()
    handleSubmit() {
        if (this.props.isBatch) {
            this.props.handleBatchUpdate();
            return;
        }
        this.props.form.validateFields((err, values) => {
            console.log(err, values);
            if (err) return;
            if (this.props.updateColor) {
                console.log('updateColor', values);
                this.updateFlowerColor(values);
            } else {
                if (!values.size) {
                    values.size = values.sizeOrigin;
                }
                this.addFlowerColor(values);
                this.props.onClose();
            }
        });
    }
    updateFlowerColor = params => {
        const { colorImgWidth, colorImgHeight, colorImgUrl } = this.state;
        if (!colorImgUrl) {
            notification.error({
                message: '请先上传图片',
            });
        } else {
            this.props.dispatch({
                type: 'style/updateColor',
                payload: {
                    _id: this.props.colorId,
                    // value,
                    type: 1,
                    value: colorImgUrl,
                    width: colorImgWidth,
                    height: colorImgHeight,
                    ...params,
                },
            });
        }
    };
    handleAdd = info => {
        console.log(info, 'info info info');
        this.setState({
            colorImgUrl: '',
            onLoad: false,
        });
        if (info.file.status === 'uploading') {
            this.setState({ loading: true });
            return;
        }
        if (info.file.status === 'done') {
            this.setState({
                colorImgUrl: info.file.response.data.url,
                loading: false,
            });
        }
    };
    addFlowerColor = params => {
        const { colorImgWidth, colorImgHeight, colorImgUrl } = this.state;
        if (!colorImgUrl) {
            notification.error({
                message: '请先上传图片',
            });
        } else {
            this.props.dispatch({
                type: 'style/addColor',
                payload: {
                    type: 1,
                    value: colorImgUrl,
                    width: colorImgWidth,
                    height: colorImgHeight,
                    ...params,
                },
            });
        }
    };

    imgOnLoad = e => {
        let imgTemp = new Image();
        imgTemp.src = e.target.src;
        // console.log(imgTemp.width, imgTemp.height);

        imgTemp.onload = () => {
            console.log(imgTemp.width, imgTemp.height);
            this.setState({
                colorImgHeight: imgTemp.height,
                colorImgWidth: imgTemp.width,
                onLoad: true,
            });
        };
    };

    beforeUpload = file => {
        const limit = file.size / 1024 < 200;
        if (!limit) {
            message.error('Image must smaller than 200K!');
        }
        return limit;
    };
    render() {
        const { colorList = [], form } = this.props;
        const { getFieldDecorator } = form;
        console.log('colorList', colorList)

        const formItemLayout = {
            labelCol: {
                xs: {
                    span: 24,
                },
                sm: {
                    span: 6,
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
        const { colorImgUrl } = this.state;
        const checkboxOptions = this.props.goodsList.map(good => ({
            label: good.aliasName,
            value: good._id,
        }));
        const checkboxSelector = getFieldDecorator('goodsId')(
            <Checkbox.Group options={checkboxOptions} />,
        );

        return (
            <Form {...formItemLayout} name="inputDesiner" layout="vertical">
                {!this.props.isBatch && (
                    <Row>
                        <Col span="13">
                            <Upload
                                {...uploadProps}
                                beforeUpload={this.beforeUpload}
                                onChange={this.handleAdd}
                            >
                                {colorImgUrl ? (
                                    <Avatar src={colorImgUrl} onLoad={this.imgOnLoad}></Avatar>
                                ) : (
                                    <UploadBtn
                                        type={this.state.loading ? 'loading' : 'plus'}
                                    ></UploadBtn>
                                )}
                            </Upload>
                            <p style={{ textAlign: 'left' }}>花布图</p>
                            <Form.Item label="相关素色">
                                {getFieldDecorator(
                                    'relatedColors',
                                    {},
                                )(
                                    <Select
                                    filterOption={(inputValue, option) => {
                                        // console.log(option)
                                        return option.label.props.c.code.includes(inputValue)
                                     
                    
                                    }} 
                                        mode="multiple"
                                        options={colorList
                                            .filter(x => x.type === 0)
                                            .map(c => ({
                                                label: <ColorOptionLabel c={c} />,
                                                value: c._id,
                                            }))}
                                    />,
                                )}
                            </Form.Item>
                        </Col>
                        <Col span="1"></Col>
                        <Col span="10">
                            {/* 编号改“开发编号”，下面请添加一个非必填项：“印花编号”，供业务人员一旦该花布进入打样环节的时候，可以填写印花厂编号，以备后查 */}
                            <Form.Item label={<span>开发编号</span>}>
                                {getFieldDecorator('code', {
                                    rules: [
                                        {
                                            required: true,
                                            message: 'Please input code!',
                                            whitespace: true,
                                        },
                                    ],
                                })(<Input style={{ width: '160px' }} />)}
                            </Form.Item>
                            <Form.Item label={<span>印花编号</span>}>
                                {getFieldDecorator('flowerCode')(
                                    <Input style={{ width: '160px' }} />,
                                )}
                            </Form.Item>
                            <Form.Item label={<span>原始画布单循环宽度(cm)</span>}>
                                {getFieldDecorator('sizeOrigin', {
                                    rules: [
                                        {
                                            required: true,
                                            message: 'Please input size!',
                                        },
                                    ],
                                })(<InputNumber min={1} step={1} />)}
                            </Form.Item>
                            <Form.Item label={<span>实际画布单循环宽度(cm)</span>}>
                                {getFieldDecorator('size', {})(<InputNumber min={1} step={1} />)}
                            </Form.Item>
                        </Col>
                    </Row>
                )}
                <Row>
                    <Col span="24">
                        <Form.Item label="可用商品">{checkboxSelector}</Form.Item>
                    </Col>
                </Row>
                <Row>
                    <Col span="8">
                        <Form.Item label="色系">
                            {getFieldDecorator(
                                'colorSystem',
                                {},
                            )(<Select options={colorSystemList} />)}
                        </Form.Item>
                    </Col>
                </Row>
                <Row>
                    <Col span="2"></Col>
                    <Col span="8">
                        <Form.Item>
                            <Button
                                loading={this.props.submitFetching}
                                disabled={this.props.isBatch ? false : !this.state.onLoad}
                                type="primary"
                                onClick={this.handleSubmit.bind(this)}
                            >
                                {this.props.updateColor ? '确认修改' : '确认添加'}
                            </Button>
                        </Form.Item>
                    </Col>
                </Row>
            </Form>
        );
    }
}

export default Form.create({
    name: 'inputFlower',
})(RegistrationForm);
