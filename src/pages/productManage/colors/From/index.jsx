import { filterImageUrl } from '@/utils/utils';
import { Form } from '@ant-design/compatible';
import '@ant-design/compatible/assets/index.css';
import { Button, Checkbox, Col, Input, notification, Row, Select } from 'antd';
import { connect } from 'dva';
import React from 'react';

import { injectIntl } from 'umi';

var isHexcolor = require('is-hexcolor');
export const colorSystemList = [
    { label: '红色系', value: 6 },
    { label: '黄色系', value: 5 },
    { label: '蓝色系', value: 4 },
    { label: '绿色系', value: 3 },
    { label: '棕色系', value: 2 },
    { label: '紫色系', value: 1 },
];
const ColorOptionLabel = ({ c = {} }) => (
    <div style={{ display: 'flex', alignItems: 'center' }}>
        <div
            style={{
                width: '18px',
                height: '18px',
                background: c.type ? `url(${filterImageUrl(c.value)}?tr=w-50)` : c.value,
            }}
        />
        {`${c.code}`}
    </div>
);

@connect(state => ({
    currentSize: state.global.currentSize,
    goodsList: state.goods.list,
    colorList: state.global.colorList,
}))
class RegistrationForm extends React.Component {
    state = {
        colorImgUrl: '',
        colorImgWidth: 0,
        colorImgHeight: 0,
    };
    checkboxOptions = this.props.goodsList.map(good => ({
        label: good.aliasName,
        value: good._id,
    }));

    // formRef = React.createRef()
    handleSubmit() {
        if (this.props.isBatch) {
            this.props.handleBatchUpdate();
            return;
        }
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
        const { colorList = [],intl } = this.props;
        const { getFieldDecorator } = this.props.form;

        const colorSystemList = [
            { label: intl.formatMessage({id: '红色系'}), value: 6 },
            { label: intl.formatMessage({id: '黄色系'}), value: 5 },
            { label: intl.formatMessage({id: '蓝色系'}), value: 4 },
            { label: intl.formatMessage({id: '绿色系'}), value: 3 },
            { label: intl.formatMessage({id: '棕色系'}), value: 2 },
            { label: intl.formatMessage({id: '紫色系'}), value: 1 },
        ]
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
                {!this.props.isBatch && (
                    <Row>
                        <Col span="8">
                            <Form.Item label={<span>{intl.formatMessage({id: '编号'})}</span>}>
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
                            <Form.Item label={<span>{intl.formatMessage({id: '颜色值'})}</span>}>
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
                        <Col span="1" />
                        <Col span="15">
                            <Form.Item label="相关花布">
                                {getFieldDecorator(
                                    'relatedColors',
                                    {},
                                )(
                                    <Select
                                        mode="multiple"
                                        filterOption={(inputValue, option) => {
                                            // console.log(option)
                                            return option.label.props.c.code.includes(inputValue)
                                         
                        
                                        }} 
                                        options={colorList
                                            .filter(x => x.type === 1)
                                            .map(c => ({
                                                label: <ColorOptionLabel c={c} />,
                                                value: c._id,
                                            }))}
                                    />,
                                )}
                            </Form.Item>
                        </Col>
                    </Row>
                )}
                <Row>
                    <Col span="24">
                        <Form.Item label={intl.formatMessage({id: "可用商品"})}>
                            {getFieldDecorator('goodsId')(
                                <Checkbox.Group options={this.checkboxOptions} />,
                            )}
                        </Form.Item>
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
})(injectIntl(RegistrationForm));
