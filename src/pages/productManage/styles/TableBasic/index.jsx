import React, { useEffect, useState, useRef } from 'react';
import { Table, Divider, Tag, Modal, Popconfirm } from 'antd';
import styles from './index.less';
import { connect } from 'dva';
import Form from '../Form';
import Preview from '../Preview';
// import { imgUrl } from '@/utils/apiconfig';
import { filterImageUrl } from '@/utils/utils';
import { getGoodsParamsToValue } from '@/utils/utils';

const Com = props => {
    const columns = [
        {
            title: '款式图',
            dataIndex: 'value',
            key: 'value',
            render: (val, obj) => (
                <img
                    style={{
                        width: '80px',
                    }}
                    src={`${filterImageUrl(obj.imgUrl)}?tr=w-80`}
                />
            ),
        },
        {
            title: '款式编号',
            dataIndex: 'styleNo',
            key: 'styleNo',
        },
        {
            title: '名称',
            dataIndex: 'styleName',
            key: 'styleName',
        },

        {
            title: '操作',
            dataIndex: 'action',
            key: 'action',
            render: (text, record) => (
                <div>
                    <a onClick={e => handleEdit(record)}>编辑</a>
                    <Divider type="vertical" />
                    <a onClick={e => handlePreview(record)}>预览</a>
                    <Divider type="vertical" />
                    <Popconfirm
                        title="确认要删除吗"
                        onConfirm={() => handleDelete(record)}
                        okText="是"
                        cancelText="否"
                    >
                        <a href="#">删除</a>
                    </Popconfirm>
                </div>
            ),
        },
    ];
    const formRef = useRef();
    const [visible, setVisible] = useState(false);
    const [preview, setPreview] = useState(false);
    const [data, setData] = useState({});

    const handleUpdate = () => {
        formRef.current.validateFields((err, values) => {
            if (!err) {
                const {
                    imgUrl,
                    svgUrl,
                    svgUrlBack,
                    shadowUrl,
                    shadowUrlBack,
                    styleEditData,
                } = props;

                console.log('style/update', values);
                props.dispatch({
                    type: 'style/update',
                    payload: {
                        _id: styleEditData._id,
                        ...values,
                        imgUrl,
                        svgUrl,
                        svgUrlBack,
                        shadowUrl,
                        shadowUrlBack,
                    },
                });
                setVisible(false);
            }
        });
    };

    useEffect(() => {
        if (visible) {
            setTimeout(() => {
                let goods = getGoodsParamsToValue(data.goodsId, data.categoryId);
                console.log(goods);
                formRef.current.setFieldsValue({
                    styleNo: data.styleNo,
                    styleName: data.styleName,
                    styleSize: data.styleSize ? data.styleSize : 27,
                    price: data.price,
                    scale: data.scale ? data.scale : 58,
                    // goodsId: data.goodsId,
                    // categoryId: data.categoryId,
                    tags: data.tags,
                    ...goods,
                });
                props.dispatch({
                    type: 'style/getDetail',
                    payload: {
                        _id: data._id,
                    },
                });
                // props.dispatch({
                //     type: 'style/setCurrentCategorys',
                //     payload: props.goodsList.find(x => x._id === data.goodsId).category,
                // });
            }, 100);
        }
    }, [visible]);

    const handleDelete = record => {
        props.dispatch({
            type: 'style/delete',
            payload: {
                _id: record._id,
            },
        });
    };

    const handlePreview = record => {
        setPreview(true);
        setData(record);
    };

    const handleEdit = record => {
        setVisible(true);
        setData(record);
    };

    const handleClear = () => {
        formRef.current.resetFields();
        props.dispatch({
            type: 'style/resetFields',
        });
    };

    return (
        <>
            <Modal
                title="编辑"
                visible={visible}
                width="900px"
                destroyOnClose={true}
                onOk={() => {
                    handleUpdate();
                    handleClear();
                }}
                onCancel={() => {
                    setVisible(false);
                    handleClear();
                }}
            >
                <Form ref={v => (formRef.current = v)} editData={data} />
            </Modal>
            <Modal
                title="预览"
                visible={preview}
                width="1000px"
                destroyOnClose={true}
                footer={false}
                onCancel={() => {
                    setPreview(false);
                }}
            >
                <Preview {...data} data={data} onSetData={setData} />
                {/* <Form ref={v => (formRef.current = v)} editData={data}/> */}
            </Modal>
            <Table
                pagination={{
                    total: props.styleList.total,
                    current: parseInt(props.styleList.page, 10),
                    pageSize: props.styleList.limit,
                    onChange: props.onPageChange,
                }}
                columns={columns}
                dataSource={props.styleList.docs}
                loading={props.fetching}
            />
        </>
    );
};

export default connect(({ style, goods, loading }) => ({
    styleList: style.list,
    imgUrl: style.imgUrl || '',
    svgUrl: style.svgUrl || '',
    svgUrlBack: style.svgUrlBack || '',
    shadowUrl: style.shadowUrl || '',
    shadowUrlBack: style.shadowUrlBack || '',
    styleEditData: style.styleEditData,
    fetching: loading.effects['style/get'],
    goodsList: goods.list,
    currentCategorys: style.currentCategorys,
}))(Com);
