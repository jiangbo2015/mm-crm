import React from 'react';
import { Form, Input, Checkbox, Divider, Row, Col, notification, Upload, Button } from 'antd';
var isHexcolor = require('is-hexcolor');
import { connect } from 'dva';

@connect(state => ({
    currentSize: state.global.currentSize,
    goodsList: state.goods.list,
}))
class RegistrationForm extends React.Component {
    state = {
        colorImgUrl: '',
        colorImgWidth: 0,
        colorImgHeight: 0,
    };
    checkboxOptions = this.props.goodsList.map(good => {
        let checkList = good.category.map(tag => ({ label: tag.name, value: tag._id }));
        return {
            name: good.name,
            id: good._id,
            checkList,
        };
    });
    // formRef = React.createRef()
    handleSubmit() {
        this.props.form.validateFields((err, values) => {
            if (err) return;
            if (this.props.updateColor) {
                this.updatePlainColor(values);
            } else {
                this.addPlainColor(values);
            }
            this.props.onClose();
        });
    }
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
    handleAdd = info => {
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

    updatePlainColor = params => {
        if (isHexcolor(params.value)) {
            this.props.dispatch({
                type: 'style/updateColor',
                payload: {
                    _id: this.props.colorId,
                    // value,
                    ...params,
                },
            });
        } else {
            notification.error({
                message: '颜色格式不合法',
            });
        }
    };

    addPlainColor = params => {
        if (isHexcolor(params.value)) {
            this.props.dispatch({
                type: 'style/addColor',
                payload: {
                    type: 0,
                    // value,
                    ...params,
                },
            });
        } else {
            notification.error({
                message: '颜色格式不合法',
            });
        }
    };

    imgOnLoad = e => {
        let imgTemp = new Image();
        imgTemp.src = e.target.src;
        console.log(imgTemp.width, imgTemp.height);
        this.setState({
            colorImgHeight: imgTemp.height,
            colorImgWidth: imgTemp.width,
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
        return (
            <Form {...formItemLayout} name="inputDesiner">
                <Row>
                    <Col span="8">
                        <Form.Item label={<span>编号</span>}>
                            {getFieldDecorator('code', {
                                rules: [
                                    {
                                        required: true,
                                        message: 'Please input codex!',
                                        whitespace: true,
                                    },
                                ],
                            })(<Input style={{ width: '160px' }} />)}
                        </Form.Item>
                        <Form.Item label={<span>颜色值</span>}>
                            {getFieldDecorator('value', {
                                rules: [
                                    {
                                        required: true,
                                        message: 'Please input value!',
                                        whitespace: true,
                                    },
                                ],
                            })(<Input style={{ width: '160px' }} />)}
                        </Form.Item>
                        <Form.Item label={<span>中文名</span>}>
                            {getFieldDecorator('namecn', {
                                rules: [
                                    {
                                        required: true,
                                        message: 'Please input namecn!',
                                        whitespace: true,
                                    },
                                ],
                            })(<Input style={{ width: '160px' }} />)}
                        </Form.Item>
                        <Form.Item label={<span>英文名</span>}>
                            {getFieldDecorator('nameen', {
                                rules: [
                                    {
                                        required: true,
                                        message: 'Please input nameen!',
                                        whitespace: true,
                                    },
                                ],
                            })(<Input style={{ width: '160px' }} />)}
                        </Form.Item>
                    </Col>
                </Row>
                <Row>
                    <Col span="16">
                        <Form.Item label="商品分类">
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
                                    })(
                                        <Checkbox.Group
                                            options={options.checkList}
                                            defaultValue={['']}
                                        />,
                                    )}
                                </>
                            ))}
                        </Form.Item>
                    </Col>
                </Row>
                <Row>
                    <Col span="2"></Col>
                    <Col span="8">
                        <Form.Item>
                            <Button type="primary" onClick={this.handleSubmit.bind(this)}>
                                确认
                            </Button>
                        </Form.Item>
                    </Col>
                </Row>
            </Form>
        );
    }
}

export default Form.create({
    name: 'inputColor',
})(RegistrationForm);
