import React, { useEffect, useState } from 'react';
// import { Form } from '@ant-design/compatible';
import '@ant-design/compatible/assets/index.css';
import { Input, Form, Divider, Row, Col, Select, Upload, Button, InputNumber } from 'antd';
import { EditableProTable } from '@ant-design/pro-table';
import { PlusOutlined } from '@ant-design/icons';
import { uploadProps, Avatar, UploadBtn } from '../../productManage/colors/UploadCom';
import StyleItem from '../../productManage/styles/Preview/style-img';
const { Option } = Select;
import SizeSelect from '@/components/SizeSelect';
const { useForm } = Form;
import { filterImageUrl } from '@/utils/utils';
// import styles from './index.less';
import { connect } from 'dva';

const uploadButton = (
    <div>
        <PlusOutlined />
        <div style={{ marginTop: 8 }}>Upload</div>
    </div>
);

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

const CapsuleForm = props => {
    const { editData, dispatch, initialValues = { status: '1' }, sizeList, colorList = [] } = props;
    const { authorId } = props;
    const [form] = useForm();
    const [urls, setUrls] = useState({});
    const [sizeOptions, setSizeOptions] = useState([]);
    const [colorOptions, setColorOptions] = useState([]);
    const [newRecord, setNewRecord] = useState({
        id: (Math.random() * 1000000).toFixed(0),
    });
    const [editableKeys, setEditableRowKeys] = useState([]);
    const [dataSource, setDataSource] = useState([]);
    useEffect(() => {
        dispatch({
            type: 'global/fetchSizeList',
        });
        dispatch({
            type: 'global/fetchColorList',
        });
    }, []);
    // console.log('colorList-list', colorList);
    useEffect(() => {
        if (editData) {
            const { code, size, price, colorWithStyleImgs } = editData;
            form.setFieldsValue({
                code,
                size,
                price,
            });
            const tempData = colorWithStyleImgs.map((cs, index) => ({
                id: (Math.random() * 1000000).toFixed(0),
                color: cs.color,
                favorite: cs.favorite,
                type: cs.type,
                imgs: {
                    fileList: cs.imgs.map(img => ({
                        uid: `cs-${index}`,
                        status: 'done',
                        url: filterImageUrl(img),
                        response: { data: { url: img } },
                        thumbUrl: filterImageUrl(img),
                    })),
                },
            }));
            setDataSource(tempData);
        }
    }, [editData]);
    useEffect(() => {
        setSizeOptions(
            sizeList.map(s => ({ label: s.values.map(t => t.name).join('/'), value: s._id })),
        );
    }, [sizeList]);
    useEffect(() => {
        setColorOptions(
            Array.isArray(colorList)
                ? colorList.map(c => ({
                      label: <ColorOptionLabel c={c} />,
                      value: c._id,
                  }))
                : [],
        );
    }, [colorList]);
    const handleChange = (info, index) => {
        const { fileList } = info;
        console.log(fileList);
        const tempUrls = {
            ...urls,
        };
        tempUrls[index] = fileList;
        setUrls(tempUrls);
    };
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
            // editable: (text, record, index) => {
            //     return index !== 1;
            // },
            valueType: 'select',
            render: (_, record) => {
                if (record.type) {
                    console.log(record);
                }
                const c = Array.isArray(colorList)
                    ? colorList.find(c => c._id === record.color)
                    : {};
                return <ColorOptionLabel c={c} />;
            },
            renderFormItem: item => {
                return <Select showSearch options={colorOptions} />;
            },
            width: '25%',
        },
        {
            title: '款式图',
            key: 'imgs',
            dataIndex: 'imgs',
            width: '60%',
            render: (text, record, _, action) => {
                console.log(record);
                if (!record.type && record.imgs) {
                    if (Array.isArray(record.imgs.fileList)) {
                        return record.imgs.fileList.map(img => (
                            <img
                                style={{ maxHeight: '86px', maxWidth: '86px', margin: '10px' }}
                                src={img.thumbUrl}
                            ></img>
                        ));
                    }
                }
                if (record.type && record.favorite) {
                    return record.favorite.styleAndColor.map(d => (
                        <div style={{ display: 'flex' }}>
                            <StyleItem
                                width="86px"
                                styleId={`${d._id}-item`}
                                colors={d.colorIds}
                                key={`${d._id}-${Math.random() * 1000000}`}
                                {...d.styleId}
                                style={{
                                    cursor: 'pointer',
                                    marginRight: '10px',
                                }}
                            />
                            <StyleItem
                                width="86px"
                                styleId={`${d._id}-item`}
                                colors={d.colorIds}
                                key={`${d._id}-${Math.random() * 1000000}`}
                                {...d.styleId}
                                svgUrl={d.styleId.svgUrlBack}
                                shadowUrl={d.styleId.shadowUrlBack}
                                styleSize={d.styleId.styleBackSize}
                                style={{
                                    cursor: 'pointer',
                                }}
                            />
                        </div>
                    ));
                }
                return null;
            },
            renderFormItem: (_, data, { getFieldsValue, ...props }) => {
                const value = Object.values(getFieldsValue())[0];
                const fileList = value && value.imgs ? value.imgs.fileList : [];
                return (
                    <Upload
                        {...uploadProps}
                        className={'block'}
                        listType="picture-card"
                        showUploadList={true}
                        fileList={fileList}
                    >
                        {uploadButton}
                    </Upload>
                );
            },
        },
        {
            title: '操作',
            valueType: 'option',
            width: '15%',
            render: (text, record, _, action) => [
                record.type ? (
                    '来自收藏'
                ) : (
                    <a
                        key="editable"
                        onClick={() => {
                            action.startEditable?.(record.id);
                        }}
                    >
                        编辑
                    </a>
                ),
            ],
        },
    ];
    const onFinish = values => {
        if (dispatch) {
            console.log('dataSource', dataSource);
            let colorWithStyleImgs = dataSource.map(d => ({
                color: d.color,
                imgs: d.imgs.fileList
                    .filter(f => f.status === 'done')
                    .map(f => f.response.data.url),
            }));
            if (editData) {
                dispatch({
                    type: 'capsule/updateCapsuleStyle',
                    payload: {
                        ...values,
                        ...urls,
                        author: authorId,
                        _id: editData._id,
                        colorWithStyleImgs,
                    },
                });
            } else {
                dispatch({
                    type: 'capsule/addCapsuleStyle',
                    payload: { ...values, ...urls, author: authorId, colorWithStyleImgs },
                });
            }
        }
    };

    const formItemLayout = {
        // labelCol: {
        //     xs: {
        //         span: 24,
        //     },
        //     sm: {
        //         span: 8,
        //     },
        // },
        // wrapperCol: {
        //     xs: {
        //         span: 24,
        //     },
        //     sm: {
        //         span: 16,
        //     },
        // },
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
                <Col span="7" style={{ paddingRight: '10px' }}>
                    <Form.Item
                        label={<span>编号</span>}
                        name="code"
                        rules={[
                            {
                                required: true,
                                message: 'Please input code!',
                                whitespace: true,
                            },
                        ]}
                    >
                        <Input />
                    </Form.Item>
                </Col>
                <Col span="5" style={{ paddingRight: '10px' }}>
                    <Form.Item
                        label={<span>单价</span>}
                        name="price"
                        rules={[
                            {
                                required: true,
                                message: 'Please input price!',
                                whitespace: true,
                                type: 'number',
                            },
                        ]}
                    >
                        <InputNumber />
                    </Form.Item>
                </Col>
                <Col span="12">
                    <Form.Item
                        label={<span>尺码段</span>}
                        name="size"
                        rules={[
                            {
                                required: true,
                                message: 'Please input status!',
                                whitespace: true,
                            },
                        ]}
                    >
                        <SizeSelect />
                    </Form.Item>
                </Col>
            </Row>

            <Divider orientation="left" style={{ margin: '0 0 16px 0' }}>
                包含商品
            </Divider>
            <EditableProTable
                rowKey="id"
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
                    // console.log(args);
                    setDataSource(args[0]);
                }}
                editable={{
                    editableKeys,
                    onSave: async () => {
                        // await waitTime(2000);
                        setNewRecord({
                            id: `eidt-${editableKeys.length}`,
                        });
                    },
                    onChange: setEditableRowKeys,
                }}
                columns={colorColumns}
                value={dataSource}
            />
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
    sizeList: state.global.sizeList,
    colorList: state.global.colorList,
    authorId: state.user.currentUser._id,
    goodsList: state.goods.list,
}))(CapsuleForm);
