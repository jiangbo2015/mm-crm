import React from 'react';
import { Form, Input, Select, Row, Col, Button } from 'antd';
const { Option } = Select;
import { connect } from 'dva';
import styles from './index.less';

@connect(state => ({
    currentSize: state.global.currentSize,
    goods: state.goods.list,
}))
class RegistrationForm extends React.Component {
    state = {};

    handleAdd = () => {
        const { currentSize } = this.props;
        currentSize.values.push({});
        this.props.dispatch({
            type: 'global/setCurrentSize',
            payload: {
                ...currentSize,
            },
        });
    };

    handleDelete = index => {
        console.log('handleDelete', { index });
        const { currentSize } = this.props;
        const { getFieldsValue, setFieldsValue } = this.props.form;
        let fields = getFieldsValue();
        delete fields.goods;
        const values = Object.values(fields);

        values.splice(index, 1);
        console.log({ values });
        console.log({ fields });
        console.log({ currentSize });
        // return;
        currentSize.values.splice(index, 1);
        this.props.dispatch({
            type: 'global/setCurrentSize',
            payload: {
                ...currentSize,
            },
            callback: () => {
                values.map((item, i) => {
                    setFieldsValue({
                        [`name${i}`]: values[i],
                    });
                });
            },
        });
    };

    render() {
        const { getFieldDecorator } = this.props.form;
        console.log(this.props);
        const { goods } = this.props;
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
        const { currentSize } = this.props;
        return (
            <Form {...formItemLayout}>
                <Row>
                    {currentSize.values.map((item, index) => (
                        <Col span="3" key={index}>
                            <Form.Item label="">
                                {getFieldDecorator(`name${index}`, {
                                    rules: [
                                        {
                                            required: true,
                                            message: 'Please input name!',
                                            whitespace: true,
                                        },
                                    ],
                                })(<Input placeholder="尺码" />)}
                            </Form.Item>
                            {index > 0 && (
                                <Button
                                    shape="circle"
                                    className={styles.del}
                                    icon="delete"
                                    type="danger"
                                    size="small"
                                    onClick={e => this.handleDelete(index)}
                                />
                            )}
                        </Col>
                    ))}
                    <Col span="2">
                        <Button
                            shape="circle"
                            icon="plus"
                            type="primary"
                            style={{ marginTop: '5px' }}
                            onClick={this.handleAdd}
                        />
                    </Col>
                </Row>
                <Row>
                    <Col span="8">
                        <Form.Item label="选择商品">
                            {getFieldDecorator(`goods`, {
                                rules: [
                                    {
                                        required: true,
                                        message: 'Please input!',
                                        whitespace: true,
                                    },
                                ],
                            })(
                                <Select style={{ width: 120 }} placeholder="请选择">
                                    {goods.map(x => (
                                        <Option value={x._id}>{x.name}</Option>
                                    ))}
                                </Select>,
                            )}
                        </Form.Item>
                    </Col>
                </Row>
            </Form>
        );
    }
}

export default Form.create({
    name: 'inputDesiner',
})(RegistrationForm);
