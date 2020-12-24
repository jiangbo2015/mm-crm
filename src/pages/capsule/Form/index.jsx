import React, { useEffect, useState } from 'react';
// import { Form } from '@ant-design/compatible';
import '@ant-design/compatible/assets/index.css';
import { Input, Form, Divider, Row, Col, Select, Upload, Button } from 'antd';
import { uploadProps, Avatar, UploadBtn } from '../../productManage/colors/UploadCom';
const { Option } = Select;
const { useForm } = Form;
import { filterImageUrl } from '@/utils/utils';
import styles from './index.less';

var isHexcolor = require('is-hexcolor');
import { connect } from 'dva';

// @connect(state => ({
//     currentSize: state.global.currentSize,
//     authorId: state.user.currentUser._id,
//     goodsList: state.goods.list,
// }))
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
                <Col span="4">
                    <Upload
                        {...uploadProps}
                        // beforeUpload={this.beforeUpload}
                        onChange={args => handleChange(args, 'covermap')}
                    >
                        {urls.covermap ? (
                            <Avatar src={urls.covermap}></Avatar>
                        ) : (
                            <UploadBtn type={loading.covermap ? 'loading' : 'plus'}></UploadBtn>
                        )}
                    </Upload>
                    <p style={{ textAlign: 'center' }}>封面图</p>
                </Col>
                <Col span="8">
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
                    <Form.Item
                        style={{ marginBottom: 0 }}
                        label={<span>状态</span>}
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
                <Col span="12">
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

            <Divider orientation="left" style={{ margin: '0 0 16px 0' }}>
                展示图
            </Divider>
            <Row flex>
                <Col>
                    <Upload
                        {...uploadProps}
                        // beforeUpload={this.beforeUpload}
                        className={styles.uploaderCapaule1}
                        onChange={args => handleChange(args, 'exhibition1')}
                    >
                        {urls.exhibition1 ? (
                            <Avatar src={urls.exhibition1}></Avatar>
                        ) : (
                            <UploadBtn type={loading.exhibition1 ? 'loading' : 'plus'}></UploadBtn>
                        )}
                    </Upload>
                </Col>
                <Col>
                    <Upload
                        {...uploadProps}
                        // beforeUpload={this.beforeUpload}
                        className={styles.uploaderCapaule2}
                        onChange={args => handleChange(args, 'exhibition2')}
                    >
                        {urls.exhibition2 ? (
                            <Avatar src={urls.exhibition2}></Avatar>
                        ) : (
                            <UploadBtn type={loading.exhibition2 ? 'loading' : 'plus'}></UploadBtn>
                        )}
                    </Upload>
                    <div style={{ display: 'flex' }}>
                        <Upload
                            {...uploadProps}
                            // beforeUpload={this.beforeUpload}
                            className={styles.uploaderCapaule3}
                            onChange={args => handleChange(args, 'exhibition3')}
                        >
                            {urls.exhibition3 ? (
                                <Avatar src={urls.exhibition3}></Avatar>
                            ) : (
                                <UploadBtn
                                    type={loading.exhibition3 ? 'loading' : 'plus'}
                                ></UploadBtn>
                            )}
                        </Upload>

                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                            <Upload
                                {...uploadProps}
                                // beforeUpload={this.beforeUpload}
                                className={styles.uploaderCapaule4}
                                onChange={args => handleChange(args, 'exhibition4')}
                            >
                                {urls.exhibition4 ? (
                                    <Avatar src={urls.exhibition4}></Avatar>
                                ) : (
                                    <UploadBtn
                                        type={loading.exhibition4 ? 'loading' : 'plus'}
                                    ></UploadBtn>
                                )}
                            </Upload>
                            <Upload
                                {...uploadProps}
                                // beforeUpload={this.beforeUpload}
                                className={styles.uploaderCapaule4}
                                onChange={args => handleChange(args, 'exhibition5')}
                            >
                                {urls.exhibition5 ? (
                                    <Avatar src={urls.exhibition5}></Avatar>
                                ) : (
                                    <UploadBtn
                                        type={loading.exhibition5 ? 'loading' : 'plus'}
                                    ></UploadBtn>
                                )}
                            </Upload>
                        </div>
                    </div>
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
    currentSize: state.global.currentSize,
    authorId: state.user.currentUser._id,
    goodsList: state.goods.list,
}))(CapsuleForm);
