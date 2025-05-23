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
        {c.namecn ? `${c.code}(${c.namecn})` : c.code}
    </div>
);

const CapsuleForm = props => {
    const { editData, dispatch, onClose, colorList = [],goodsList } = props;
    const { authorId } = props;
    const [form] = useForm();
    const [urls, setUrls] = useState({});
    // const [sizeOptions, setSizeOptions] = useState([]);
    const [colorOptions, setColorOptions] = useState([]);
    const [newRecord, setNewRecord] = useState({
        id: (Math.random() * 1000000).toFixed(0),
    });
    const [editableKeys, setEditableRowKeys] = useState([]);
    const [dataSource, setDataSource] = useState([]);
    const [good, setGood] = useState(null);
    const [goodsOptions, setGoodsOptions] = useState([]);
    const [goodCategrayOptions, setGoodsCategrayOptions] = useState([]);
    useEffect(() => {
        dispatch({
            type: 'global/fetchSizeList',
        });
        dispatch({
            type: 'global/fetchColorList',
        });
    }, []);
    useEffect(()=>{
        const item = goodsList.find(x => x._id === good)
        if(item) {
            setGoodsCategrayOptions(item.category?.map(s => ({ label: `${s.name}/${s.enname}`, value: s._id })),
            )
        }
    }, [good])
    
    useEffect(() => {
        setGoodsOptions(goodsList.map(s => ({ label: `${s.name}/${s.aliasName}`, value: s._id })));
    }, [goodsList]);
    // console.log('colorList-list', colorList);
    useEffect(() => {
        if (editData) {
            const { code, size, price, weight, colorWithStyleImgs, goodCategoryId, goodId } = editData;
            // console.log('price', price);
            // console.log('weight', weight);
            form.setFieldsValue({
                code,
                size,
                price: price,
                weight: weight,
                goodCategoryId,
                goodId
            });
            setGood(goodId)
            const tempData = colorWithStyleImgs.map((cs) => ({
                id: (Math.random() * 1000000).toFixed(0),
                color: cs.color,
                favorite: cs.favorite,
                type: cs.type,
                imgs: {
                    fileList: cs.imgs.map((img,fi) => ({
                        uid: `cs-${fi}`,
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
    // useEffect(() => {
    //     setSizeOptions(
    //         sizeList.map(s => ({ label: s.values.map(t => t.name).join('/'), value: s._id })),
    //     );
    // }, [sizeList]);
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
                return <Select showSearch options={colorOptions} filterOption={(inputValue, option) => {
                    // console.log(option)
                    return option.label.props.c.code.includes(inputValue)
                 

                }} />;
            },
            width: '25%',
        },
        {
            title: '款式图',
            key: 'imgs',
            dataIndex: 'imgs',
            width: '60%',
            render: (_, record) => {
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
                // console.log('renderFormItem data',data)
                // console.log('renderFormItem props',props)
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
    const onFinish = values => {
        if (dispatch) {
            // console.log('dataSource', dataSource);
            const item = goodCategrayOptions.find(x => x.value === values.goodCategoryId)
            const goodCategory = item ? {name: item?.label.split('/')[0], enname: item?.label.split('/')[1]} : {}
                    
            let colorWithStyleImgs = dataSource.map(d => {

                return {
                    ...d,
                    color: d.color,
                    imgs: d.imgs.fileList
                        .filter(f => f.status === 'done')
                        .map(f => f.response.data.url),
                        
                };
            });
            if (editData) {
                dispatch({
                    type: 'capsule/updateCapsuleStyle',
                    payload: {
                        ...values,
                        ...urls,
                        author: authorId,
                        _id: editData._id,
                        colorWithStyleImgs,
                        goodCategory,
                    },
                });
            } else {
                dispatch({
                    type: 'capsule/addCapsuleStyle',
                    payload: {
                        ...values,
                        ...urls,
                        author: authorId,
                        colorWithStyleImgs,
                        goodCategory,
                    },
                });
            }
            onClose()
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
        <Form {...formItemLayout} form={form} name="inputDesiner" onFinish={onFinish}>
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
                        label={<span>单价 ¥</span>}
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
                <Col span="5" style={{ paddingRight: '10px' }}>
                    <Form.Item
                        label={<span>重量 g</span>}
                        name="weight"
                        rules={[
                            {
                                required: true,
                                message: 'Please input weight!',
                                whitespace: true,
                                type: 'number',
                            },
                        ]}
                    >
                        <InputNumber />
                    </Form.Item>
                </Col>
            </Row>
            <Row>
                <Col span="7">
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
                <Col span="8" style={{ paddingRight: '10px' }}>
                    <Form.Item
                        label={<span>分类</span>}
                        name="goodId"
                        rules={[
                            {
                                required: true,
                                message: 'Please input kind!',
                                whitespace: true,
                            },
                        ]}
                    >
                        <Select
                            options={goodsOptions}
                            onChange={(val) => {
                                setGood(val)
                            }}
                        />
                    </Form.Item>
                </Col>
                <Col span="8" style={{ paddingRight: '10px' }}>
                    <Form.Item
                        name="goodCategoryId"
                        rules={[
                            {
                                required: true,
                                message: 'Please input kind!',
                                whitespace: true,
                            },
                        ]}
                    >
                        <Select
                            options={goodCategrayOptions}
                        />
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
                        console.log(`eidt-${dataSource.length}`)
                        setNewRecord({
                            id: `eidt-${dataSource.length}`,
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
                            {intl("确认")}
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
