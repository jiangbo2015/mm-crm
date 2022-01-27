import React, { useEffect, useState } from 'react';
// import { Form } from '@ant-design/compatible';
import '@ant-design/compatible/assets/index.css';
import { Input, Form, Divider, Row, Col, Select, Upload, Button, InputNumber } from 'antd';
import { EditableProTable } from '@ant-design/pro-table';
import { PlusOutlined } from '@ant-design/icons';
import SizeSelect from '@/components/SizeSelect';
import { uploadProps } from '../../productManage/colors/UploadCom';
const { Option } = Select;
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

const SizeListInput = ({ onChange, value = {}, currentSize = [] }) => {
    // const [sizeValue, setSizeValue] = useState({})
    return (
        <div
            style={{
                display: 'flex',
            }}
        >
            {currentSize.map(c => (
                <div
                    style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                    }}
                >
                    {c}
                    <InputNumber
                        onChange={val => {
                            let temp = {};
                            temp[c] = val;
                            onChange({ ...value, ...temp });
                        }}
                        value={value[c]}
                        width="40px"
                        style={{ width: '60px' }}
                        min={0}
                    />
                </div>
            ))}
        </div>
    );
};
const ColorOptionLabel = ({ c = {} }) => (
    <div style={{ display: 'flex', alignItems: 'center' }}>
        <div
            style={{
                width: '18px',
                height: '18px',
                background: c.type ? `url(${filterImageUrl(c.value)}?tr=w-50)` : c.value,
            }}
        ></div>
        {c.type ? c.code : `${c.code}(${c.namecn})`}
    </div>
);

const ShopStyleForm = props => {
    const {
        editData,
        dispatch,
        initialValues = { status: '1' },
        onClose,
        colorList = [],
        goodsList = [],
        branchKindList = [],
        currentBranch,
    } = props;
    const { authorId } = props;
    const [form] = useForm();
    const [urls, setUrls] = useState({});
    const [newBranchName, setNewBranchName] = useState('');
    const [newBranchKindName, setNewBranchKindName] = useState('');
    const [currentSize, setCurrentSize] = useState([]);
    // const [sizeOptions, setSizeOptions] = useState([]);
    const [numInbag, setNumInbag] = useState(0);
    const [bagNums, setBagNums] = useState(0);
    const [good, setGood] = useState(null);
    const [branchOptions, setBranchOptions] = useState([]);
    const [branchKindOptions, setBranchKindOptions] = useState([]);

    const [colorOptions, setColorOptions] = useState([]);
    const [newRecord, setNewRecord] = useState({
        id: (Math.random() * 1000000).toFixed(0),
    });
    const [editableKeys, setEditableRowKeys] = useState([]);
    const [dataSource, setDataSource] = useState([]);
    useEffect(() => {
        // dispatch({
        //     type: 'global/fetchSizeList',
        // });
        dispatch({
            type: 'global/fetchColorList',
        });
        dispatch({
            type: 'global/fetchBranchList',
        });

    }, []);
    
    useEffect(() => {
        setNumInbag(_.sum(dataSource.map(cs => cs.sizeWithQuantity ? _.sum(Object.values(cs.sizeWithQuantity)) : 0)));
    }, [dataSource]);
    useEffect(() => {
        if(good) {
            const item = goodsList.find(x => x._id===good)
            if(item) {
                setBranchKindOptions(
                    item.category?.map(s => ({ label: `${s.name}/${s.enname}`, value: s._id })),
                );
            }
            
        }
    }, [good]);
    useEffect(() => {
        if (editData) {
            const {
                code,
                size,
                price,
                bagsNum,
                // caseNum,
                stock,
                branch,
                branchKind,
                colorWithStyleImgs,
                goodCategoryId,
                goodId
            } = editData;
            dispatch({
                type: 'global/fetchBranchKindList',
                payload: {
                    branch,
                },
            });
            setCurrentSize(size.split('/'));
            form.setFieldsValue({
                code,
                size,
                price,
                bagsNum,
                // caseNum,
                stock,
                branch,
                branchKind,
                goodCategoryId,
                goodId
            });
            setGood(goodId)
            const tempData = colorWithStyleImgs.map((cs, index) => ({
                id: (Math.random() * 1000000).toFixed(0),
                color: cs.color,
                sizeWithQuantity: cs.sizeWithQuantity,
                imgs: {
                    fileList: cs.imgs.map((img, fi) => ({
                        uid: `cs-${fi}`,
                        status: 'done',
                        url: filterImageUrl(img),
                        response: { data: { url: img } },
                        thumbUrl: filterImageUrl(img),
                    })),
                },
            }));
            setNumInbag(
                _.sum(colorWithStyleImgs.map(cs => cs => cs.sizeWithQuantity ? _.sum(Object.values(cs.sizeWithQuantity)):0)),
            );
            setBagNums(bagsNum);
            setDataSource(tempData);
        }
    }, [editData]);
    useEffect(() => {
        form.setFieldsValue({
            caseNum: bagNums * numInbag,
            numInBag: numInbag,
        });
    }, [bagNums, numInbag]);
    useEffect(() => {
        setBranchOptions(goodsList.map(s => ({ label: `${s.name}/${s.aliasName}`, value: s._id })));
    }, []);
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

    const handleAddBranchItem = () => {
        let names = newBranchName.split('/');
        if (names.length < 2) return;
        dispatch({
            type: 'global/addBranch',
            payload: {
                namecn: names[0],
                nameen: names[1],
            },
        });
        setNewBranchName('');
    };

    const handleAddBranchKindItem = () => {
        let names = newBranchKindName.split('/');
        const branch = form.getFieldValue('branch');
        if (names.length < 2 && branch) return;

        dispatch({
            type: 'global/addBranchKind',
            payload: {
                namecn: names[0],
                nameen: names[1],
                branch,
            },
        });
        setNewBranchKindName('');
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
            valueType: 'select',
            render: (_, record) => {
                const c = Array.isArray(colorList)
                    ? colorList.find(c => c._id === record.color)
                    : {};
                return <ColorOptionLabel c={c} />;
            },
            renderFormItem: item => {
                return <Select showSearch options={colorOptions}  filterOption={(inputValue, option) => {
                    // console.log(option)
                    return option.label.props.c.code.includes(inputValue)
                 

                }}/>;
            },
            width: '25%',
        },
        {
            title: '款式图',
            key: 'imgs',
            dataIndex: 'imgs',
            width: '45%',
            render: (text, record, _, action) => {
                if (record.imgs) {
                    if (Array.isArray(record.imgs.fileList)) {
                        return record.imgs.fileList.map(img => (
                            <img
                                style={{ maxHeight: '86px', maxWidth: '86px', margin: '10px' }}
                                src={img.thumbUrl}
                            />
                        ));
                    }
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
            title: '尺码/数量',
            key: 'sizeWithQuantity',
            dataIndex: 'sizeWithQuantity',
            width: '15%',
            render: (text, record, _, action) => {
                return (
                    <div style={{ display: 'flex' }}>
                        {currentSize.map(c => (
                            <div
                                style={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    margin: '0 6px',
                                }}
                            >
                                <div>{c}</div>
                                <div>
                                    {record.sizeWithQuantity ? record.sizeWithQuantity[c] : 0}
                                </div>
                            </div>
                        ))}
                    </div>
                );
            },
            renderFormItem: _ => {
                return <SizeListInput currentSize={currentSize} />;
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
    const onFinish = async values => {
        if (dispatch) {
            // console.log('dataSource', dataSource);
            let colorWithStyleImgs = dataSource.map(d => ({
                sizeWithQuantity: d.sizeWithQuantity,
                color: d.color,
                imgs: d.imgs.fileList
                    .filter(f => f.status === 'done')
                    .map(f => f.response.data.url),
            }));

            const item = branchKindOptions.find(x => x.value === values.goodCategoryId)  

            if (editData) {
                await dispatch({
                    type: 'shop/updateShopStyle',
                    payload: {
                        ...values,
                        ...urls,
                        author: authorId,
                        _id: editData._id,
                        colorWithStyleImgs,
                        goodCategory: item ? {name: item?.label.split('/')[0], enname: item?.label.split('/')[1]} : {}
                    },
                });

            } else {
                dispatch({
                    type: 'shop/addShopStyle',
                    payload: { ...values, ...urls, author: authorId, colorWithStyleImgs,branch: currentBranch._id },
                });
            }
            onClose()
        }
    };

    return (
        <Form form={form} name="inputDesiner" onFinish={onFinish} initialValues={initialValues}>
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
                        <SizeSelect onChange={val => {
                            let nextSize = val.split('/')
                            setCurrentSize(nextSize);
                            setDataSource([...dataSource.map(cs => {
                                cs.sizeWithQuantity = {}
                                for(let i = 0; i<nextSize.length; i++){
                                    cs.sizeWithQuantity[nextSize[i]] = 0;
                                }
                                
                                return cs
                            })])
                            
                            }} />
                    </Form.Item>
                </Col>
            </Row>
            <Row>
                <Col span="6" style={{ paddingRight: '10px' }}>
                    <Form.Item
                        label={<span>分类</span>} 
                        name="goodId"
                    >
                        <Select
                            options={branchOptions}
                            onChange={(val) => {
                                setGood(val)
                            }}
                        />
                    </Form.Item>
                </Col>
                <Col span="10">
                <Form.Item name="goodCategoryId">
                        <Select
                            options={branchKindOptions}
                        />
                    </Form.Item>
                </Col>
            </Row>
            <Row>
                <Col span="6" style={{ paddingRight: '10px' }}>
                    <Form.Item
                        label={<span>中包装数</span>}
                        name="numInBag"
                        // disabled
                        rules={[
                            {
                                required: true,
                                message: 'Please input!',
                                whitespace: true,
                                type: 'number',
                            },
                        ]}
                    >
                        <InputNumber disabled />
                    </Form.Item>
                </Col>
                <Col span="6" style={{ paddingRight: '10px' }}>
                    <Form.Item
                        label={<span>中包数</span>}
                        name="bagsNum"
                        rules={[
                            {
                                required: true,
                                message: 'Please input!',
                                whitespace: true,
                                type: 'number',
                            },
                        ]}
                    >
                        <InputNumber
                            onChange={val => {
                                setBagNums(val);
                            }}
                        />
                    </Form.Item>
                </Col>
                <Col span="6" style={{ paddingRight: '10px' }}>
                    <Form.Item
                        label={<span>装箱数</span>}
                        name="caseNum"
                        rules={[
                            {
                                required: true,
                                message: 'Please input!',
                                whitespace: true,
                                type: 'number',
                            },
                        ]}
                    >
                        <InputNumber disabled />
                    </Form.Item>
                </Col>
                {/* <Col span="6" style={{ paddingRight: '10px' }}>
                    <Form.Item
                        label={<span>库存</span>}
                        name="stock"
                        rules={[
                            {
                                required: true,
                                message: 'Please input!',
                                whitespace: true,
                                type: 'number',
                            },
                        ]}
                    >
                        <InputNumber min={0} />
                    </Form.Item>
                </Col> */}
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
                   
                    setDataSource(args[0]);
                }}
                editable={{
                    editableKeys,
                    onSave: async () => {
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
    branchList: state.global.branchList,
    branchKindList: state.global.branchKindList,
    colorList: state.global.colorList,
    authorId: state.user.currentUser._id,
    goodsList: state.goods.list,
    submitting: state.loading.effects['']
}))(ShopStyleForm);
