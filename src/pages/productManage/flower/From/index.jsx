import React from 'react';
import {
    Form,
    Input,
    message,
    Row,
    Col,
    notification,
    Upload,
    Button,
    Checkbox,
    Divider,
} from 'antd';
import { connect } from 'dva';
import { uploadProps, Avatar, UploadBtn } from '../UploadCom';

@connect(state => ({
    currentSize: state.global.currentSize,
    goodsList: state.goods.list,
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
            this.props.onUpdateForm();
        }
    }

    // formRef = React.createRef()
    handleSubmit() {
        this.props.form.validateFields((err, values) => {
            console.log(err, values);
            if (err) return;
            if (this.props.updateColor) {
                console.log('updateColor', values);
                this.updateFlowerColor(values);
            } else {
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
        const { colorImgUrl } = this.state;
        // let goodsList = [
        //     {
        //         name: 'AAA',
        //         category: [
        //             { _id: '5eef25742ab395036d644eb0', name: '单衣' },
        //             { _id: '5ef6f9f19e479c06df85b327', name: '单裤' },
        //         ],
        //     },
        //     {
        //         name: 'BBB',
        //         category: [
        //             { _id: '5eef25742ab395036d644eb2', name: '单衣' },
        //             { _id: '5ef6f9f19e479c06df85b328', name: '单裤' },
        //         ],
        //     },
        // ];
        const checkboxOptions = this.props.goodsList.map(good => ({
            label: good.aliasName,
            value: good._id,
        }));
        const checkboxSelector = getFieldDecorator('goodsId')(
            <Checkbox.Group options={checkboxOptions} />,
        );
        return (
            <Form {...formItemLayout} name="inputDesiner">
                <Row>
                    <Col span="8">
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
                        <p style={{ textAlign: 'center' }}>花布图</p>
                    </Col>
                    <Col span="16">
                        <Form.Item label={<span>编号</span>}>
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
                        <Form.Item label={<span>画布单循环宽度(cm)</span>}>
                            {getFieldDecorator('size', {
                                rules: [
                                    {
                                        required: true,
                                        message: 'Please input size!',
                                    },
                                ],
                            })(<Input type="number" style={{ width: '160px' }} />)}
                        </Form.Item>
                    </Col>
                </Row>
                <Row>
                    <Col span="24">
                        <Form.Item label="可用商品">{checkboxSelector}</Form.Item>
                    </Col>
                </Row>
                <Row>
                    <Col span="2"></Col>
                    <Col span="8">
                        <Form.Item>
                            <Button
                                loading={this.props.submitFetching}
                                disabled={!this.state.onLoad}
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
