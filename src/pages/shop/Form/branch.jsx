import React from 'react';
import { PlusOutlined } from '@ant-design/icons';
import { Form } from '@ant-design/compatible';
import '@ant-design/compatible/assets/index.css';
import { Input, Upload, Button, Row, Col, Divider, Popconfirm } from 'antd';


import Table from '@/components/Table/SortTable';
import { connect } from 'dva';

@connect(state => ({
    imgUrl: state.goods.imgUrl,
    category: state.goods.category,
    // sizeList: state.global.sizeList,
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
        if (this.props.imgUrl) {
            this.props.dispatch({
                type: 'goods/setImgUrl',
                payload: '',
            });
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
            payload: this.props.category.concat({ time: new Date().getTime() }),
        });
    };

    handleDelete = (e, index) => {
        console.log(index);
        const copy = [].concat(this.props.category);
        copy.splice(index, 1);
        this.props.dispatch({
            type: 'goods/setCategories',
            payload: copy,
        });
    };

    handleSort = options => {
        this.props.dispatch({
            type: 'goods/categrySort',
            payload: options,
        });
    };

    render() {
        const { imgUrl, category } = this.props;
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
            <Form {...formItemLayout}>
                <Form.Item label={<span>中文名</span>}>
                    {getFieldDecorator('namecn', {
                        rules: [
                            {
                                required: true,
                                message: 'Please input name!',
                                whitespace: true,
                            },
                        ],
                    })(<Input />)}
                </Form.Item>
                <Form.Item label={<span>英文名</span>}>
                    {getFieldDecorator('nameen', {
                        rules: [
                            {
                                required: true,
                                message: 'Please input name!',
                                whitespace: true,
                            },
                        ],
                    })(<Input />)}
                </Form.Item>
                <Table
                    size="small"
                    title="分类"
                    columns={[
                        {
                            title: '名称',
                            dataIndex: 'name',
                            key: 'name',
                            render: (_, record) => {
                                const keyLast = record._id ? record._id : record.time;
                                return (
                                    <Form.Item label="" style={{ marginBottom: 0 }}>
                                        {getFieldDecorator(`cname-${keyLast}`, {
                                            rules: [
                                                {
                                                    whitespace: true,
                                                },
                                            ],
                                        })(<Input />)}
                                    </Form.Item>
                                );
                            },
                        },
                        {
                            title: '英文名',
                            dataIndex: 'enname',
                            key: 'enname',
                            render: (_, record) => {
                                const keyLast = record._id ? record._id : record.time;
                                return (
                                    <Form.Item label="" style={{ marginBottom: 0 }}>
                                        {getFieldDecorator(`cenname-${keyLast}`, {
                                            rules: [
                                                {
                                                    whitespace: true,
                                                },
                                            ],
                                        })(<Input />)}
                                    </Form.Item>
                                );
                            },
                        },
                        {
                            title: '操作',
                            dataIndex: 'action',
                            key: 'action',
                            render: (_, record, index) => (
                                <div>
                                    <Popconfirm
                                        title="确认要删除吗"
                                        onConfirm={() => {
                                            this.handleDelete({}, index);
                                        }}
                                        okText="是"
                                        cancelText="否"
                                    >
                                        <a href="#">删除</a>
                                    </Popconfirm>
                                </div>
                            ),
                        },
                    ]}
                    dataSource={category}
                    // onMoveArray={this.handleSort}
                />

                {/* {category.map((item, index) => {
                    const keyLast = item._id ? `-${item._id}` : item.time;
                    return (
                        <Row gutter={[20]} key={`${item._id}-${index}`}>
                            <Col span="10">
                                <Form.Item label="">
                                    {getFieldDecorator(`cname${keyLast}`, {
                                        rules: [
                                            {
                                                whitespace: true,
                                            },
                                        ],
                                    })(<Input />)}
                                </Form.Item>
                            </Col>
                            
                            <Col span="2">
                                <Button
                                    shape="circle"
                                    icon="delete"
                                    type="danger"
                                    onClick={e => this.handleDelete(e, index)}
                                />
                            </Col>
                        </Row>
                    );
                })} */}
                <Row>
                    <Col span="2">
                        <Button
                            shape="circle"
                            icon={<PlusOutlined />}
                            type="primary"
                            onClick={this.handleAdd}
                        />
                    </Col>
                </Row>
            </Form>
        );
    }
}

export default Form.create({
    name: 'inputBranch',
})(RegistrationForm);
