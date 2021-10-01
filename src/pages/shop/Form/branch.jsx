import React, { useEffect } from 'react';
import { PlusOutlined } from '@ant-design/icons';
import '@ant-design/compatible/assets/index.css';
import { Input, Form, Button, Row, Col, Select, Popconfirm } from 'antd';
const {Option} = Select
const { useForm } = Form;
import Table from '@/components/Table/SortTable';
import { connect } from 'dva';

const formItemLayout = {
    labelCol: {
        xs: {
            span: 4,
        },
        sm: {
            span: 4,
        },
    },
    wrapperCol: {
        xs: {
            span: 20,
        },
        sm: {
            span: 20,
        },
    },
};
const BranchForm = props => {
    const { editData, dispatch, branchKindList, initialValues = { status: '1' } ,onClose} = props;
    const [form] = useForm();
    // const { getFieldDecorator } = props.form;
    const handleAdd = () => {
        dispatch({
            type: 'global/setBranchKindList',
            payload: branchKindList.concat({ time: new Date().getTime() }),
        });
    };

    useEffect(() => {
        if (editData) {
            const editValues = {
                namecn: editData.namecn,
                nameen: editData.nameen,
                status: editData.status,
                description: editData.description,
            };
            editData.children.map(x => {
                editValues[`cname-${x._id}`] = x.namecn;
                editValues[`cenname-${x._id}`] = x.nameen;
            });
            dispatch({
                type: 'global/setBranchKindList',
                payload: editData.children,
            });
            form.setFieldsValue(editValues);
        }
    }, [editData]);

    const handleDelete = (e, index) => {
        console.log(index);
        const copy = [].concat(branchKindList);
        copy.splice(index, 1);
        dispatch({
            type: 'global/setBranchKindList',
            payload: copy,
        });
    };

    const onFinish = async values => {
        if (dispatch) {
            const newCategory = [];
            const fieldsCategoryName = Object.keys(values).filter(x => x.indexOf('cname') === 0);
            // console.log('fieldsCategoryName', fieldsCategoryName);

            fieldsCategoryName.map((name, index) => {
                let obj = {
                    namecn: values[name],
                };
                let nameGroup = name.split('-');
                if (nameGroup.length >= 2 && nameGroup[1].length >= 24) {
                    obj._id = nameGroup[1];
                }
                obj.nameen = values[`cenname-${nameGroup[1]}`];

                if (obj.namecn) {
                    newCategory.push(obj);
                }
                // return obj;
            });

            if (editData) {
                await dispatch({
                    type: 'global/updateBranch',
                    payload: {
                        namecn: values.namecn,
                        nameen: values.nameen,
                        status: values.status,
                        description: values.description,
                        _id: editData._id,
                        kind: newCategory.filter(c => c.namecn),
                    },
                });

            } else {
                await dispatch({
                    type: 'global/addBranch',
                    payload: {
                        namecn: values.namecn,
                        nameen: values.nameen,
                        status: values.status,
                        description: values.description,
                        kind: newCategory.filter(c => c.namecn),
                    },
                });
            }
            props.onClose();
        }
    };

    return (
        <Form
            {...formItemLayout}
            form={form}
            name="inputDesiner"
            onFinish={onFinish}
            initialValues={initialValues}
        >
            <Row>
                <Col>
                    <Form.Item
                    style={{ marginBottom: 0 }}
                    label={<span>中文名</span>}
                    name="namecn"
                    rules={[
                        {
                            required: true,
                            message: 'Please input namecn!',
                            whitespace: true,
                        },
                    ]}
                    >
                        <Input />
                    </Form.Item>
                </Col>
                <Col>
                    <Form.Item
                    style={{ marginBottom: 0 }}
                    label={<span>英文名</span>}
                    name="nameen"
                    rules={[
                        {
                            required: true,
                            message: 'Please input nameen!',
                            whitespace: true,
                        },
                    ]}
                >
                    <Input />
                </Form.Item>
                </Col>
            </Row>
            
            <Row>
                <Col>
                    <Form.Item
                            style={{ marginBottom: 0 }}
                            label={<span>状态</span>}
                            name="status"
                            rules={[
                                {
                                    message: 'Please input status!',
                                    whitespace: true,
                                },
                            ]}
                    >
                        <Select style={{ width: 120 }}>
                            <Option value="1">发布</Option>
                            <Option value="0">未发布</Option>
                        </Select>
                    </Form.Item>
                </Col>
                <Col>
                    <Form.Item
                        labelCol={{
                            xs: {
                                span: 24,
                            },
                            sm: {
                                span: 5,
                            },
                        }}
                        label={<span>介绍</span>}
                        name="description"
                        rules={[
                            {
                                required: true,
                                message: 'Please input description!',
                                whitespace: true,
                            },
                        ]}
                    >
                        <Input.TextArea rows={5} />
                    </Form.Item>

                </Col>
            </Row>

            <Table
                size="small"
                title="分类"
                columns={[
                    {
                        title: '名称',
                        dataIndex: 'namecn',
                        key: 'namecn',
                        render: (_, record) => {
                            const keyLast = record._id ? record._id : record.time;
                            return (
                                <Form.Item
                                    style={{ marginBottom: 0 }}
                                    label=""
                                    name={`cname-${keyLast}`}
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Please input nameen!',
                                            whitespace: true,
                                        },
                                    ]}
                                >
                                    <Input />
                                </Form.Item>
                            );
                        },
                    },
                    {
                        title: '英文名',
                        dataIndex: 'nameen',
                        key: 'nameen',
                        render: (_, record) => {
                            const keyLast = record._id ? record._id : record.time;
                            return (
                                <Form.Item
                                    style={{ marginBottom: 0 }}
                                    label=""
                                    name={`cenname-${keyLast}`}
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Please input nameen!',
                                            whitespace: true,
                                        },
                                    ]}
                                >
                                    <Input />
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
                                        handleDelete({}, index);
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
                dataSource={branchKindList}
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
                        onClick={handleAdd}
                    />
                </Col>
            </Row>
            <Row style={{ marginTop: '20px' }}>
                <Col span="21"></Col>
                <Col span="3">
                    <Form.Item>
                        <Button type="primary" htmlType="submit">
                            确认
                        </Button>
                    </Form.Item>
                </Col>
            </Row>
        </Form>
    );
};

export default connect(state => ({
    branchKindList: state.global.branchKindList,
}))(BranchForm);
