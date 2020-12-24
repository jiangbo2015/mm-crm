import React, { useEffect, useState } from 'react';
// import { Form } from '@ant-design/compatible';
import '@ant-design/compatible/assets/index.css';
import { Input, Form, Divider, Row, Col, Select, Upload, Button } from 'antd';
import { EditableProTable } from '@ant-design/pro-table';
import { uploadProps, Avatar, UploadBtn } from '../../productManage/colors/UploadCom';
const { Option } = Select;
const { useForm } = Form;
import styles from './index.less';
import { connect } from 'dva';
const colorColumns = [
    {
        title: '颜色/花布',
        dataIndex: 'color',
        formItemProps: {
            rules: [
                {
                    required: true,
                    message: '此项为必填项',
                },
            ],
        },
        // 第二行不允许编辑
        editable: (text, record, index) => {
            return index !== 1;
        },
        width: '30%',
    },
    {
        title: '状态',
        key: 'state',
        dataIndex: 'state',
        valueType: 'select',
        valueEnum: {
            all: { text: '全部', status: 'Default' },
            open: {
                text: '未解决',
                status: 'Error',
            },
            closed: {
                text: '已解决',
                status: 'Success',
            },
        },
    },
    {
        title: '描述',
        dataIndex: 'decs',
        fieldProps: (from, { rowKey }) => {
            if (from.getFieldValue([rowKey || '', 'title']) === '不好玩') {
                return {
                    disabled: true,
                };
            }
            return {};
        },
    },
    {
        title: '操作',
        valueType: 'option',
        width: 200,
        render: (text, record, _, action) => [
            <a
                key="editable"
                onClick={() => {
                    action.startEditable?.(record.id);
                }}
            >
                编辑
            </a>,
        ],
    },
];
const defaultData = [
    {
        id: 624748504,
        title: '活动名称一',
        decs: '这个活动真好玩',
        state: 'open',
        created_at: '2020-05-26T09:42:56Z',
    },
    {
        id: 624691229,
        title: '活动名称二',
        decs: '这个活动真好玩',
        state: 'closed',
        created_at: '2020-05-26T08:19:22Z',
    },
];
const CapsuleForm = props => {
    const { editData, dispatch, initialValues = { status: '1' } } = props;
    const { authorId } = props;
    const [form] = useForm();
    const [loading, setLoading] = useState({
        covermap: false,
        exhibition1: false,
        exhibition2: false,
        exhibition3: false,
        exhibition4: false,
        exhibition5: false,
    });
    const [urls, setUrls] = useState({
        covermap: editData ? editData.covermap : '',
        exhibition1: editData ? editData.exhibition1 : '',
        exhibition2: editData ? editData.exhibition2 : '',
        exhibition3: editData ? editData.exhibition3 : '',
        exhibition4: editData ? editData.exhibition4 : '',
        exhibition5: editData ? editData.exhibition5 : '',
    });
    const [newRecord, setNewRecord] = useState({
        id: (Math.random() * 1000000).toFixed(0),
    });
    const [editableKeys, setEditableRowKeys] = useState([]);
    const [dataSource, setDataSource] = useState(defaultData);

    useEffect(() => {
        if (editData) {
            form.setFieldsValue({
                namecn: editData.namecn,
                nameen: editData.nameen,
                status: editData.status,
                description: editData.description,
            });
        }
    }, [editData]);
    const handleChange = (info, type) => {
        console.log(info);
        if (info.file.status === 'uploading') {
            let tempLoading = {};
            tempLoading[type] = true;
            let tempUrls = {};
            tempUrls[type] = '';
            setLoading({
                ...loading,
                ...tempLoading,
            });
            setUrls({
                ...urls,
                ...tempUrls,
            });

            return;
        }
        if (info.file.status === 'done') {
            let tempLoading = {};
            tempLoading[type] = false;
            let tempUrls = {};
            tempUrls[type] = info.file.response.data.url;
            setLoading({
                ...loading,
                ...tempLoading,
            });
            setUrls({
                ...urls,
                ...tempUrls,
            });
        }
    };

    const onFinish = values => {
        if (dispatch) {
            if (editData) {
                dispatch({
                    type: 'capsule/update',
                    payload: { ...values, ...urls, author: authorId, _id: editData._id },
                });
            } else {
                dispatch({
                    type: 'capsule/add',
                    payload: { ...values, ...urls, author: authorId },
                });
            }
        }
    };

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
        <Form
            {...formItemLayout}
            form={form}
            name="inputDesiner"
            onFinish={onFinish}
            initialValues={initialValues}
        >
            <Row>
                <Col span="8">
                    <Form.Item
                        label={<span>编号</span>}
                        name="code"
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
                <Col span="8">
                    <Form.Item
                        label={<span>单价</span>}
                        name="price"
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
                <Col span="8">
                    <Form.Item
                        label={<span>尺码段</span>}
                        name="status"
                        rules={[
                            {
                                required: true,
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
            </Row>

            <Divider orientation="left" style={{ margin: '0 0 16px 0' }}>
                包含商品
            </Divider>
            <EditableProTable
                rowKey="id"
                headerTitle="可编辑表格"
                maxLength={5}
                recordCreatorProps={{
                    position: 'bottom',
                    record: newRecord,
                }}
                request={async () => {
                    // console.log('--add--');
                    return {
                        data: dataSource,
                    };
                }}
                defaultData={dataSource}
                onChange={(...args) => {
                    console.log(args);
                    setDataSource(args[0]);
                }}
                editable={{
                    editableKeys,
                    onSave: async () => {
                        // await waitTime(2000);
                        setNewRecord({
                            id: (Math.random() * 1000000).toFixed(0),
                        });
                    },
                    onChange: setEditableRowKeys,
                }}
                columns={colorColumns}
                value={dataSource}
            ></EditableProTable>
            <Row flex></Row>
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
    currentSize: state.global.currentSize,
    authorId: state.user.currentUser._id,
    goodsList: state.goods.list,
}))(CapsuleForm);
