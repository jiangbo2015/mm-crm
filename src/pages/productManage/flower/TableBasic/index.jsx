import React, { useEffect, useState, useRef } from 'react';
import { Table, Divider, Modal, Popconfirm } from 'antd';
import styles from './index.less';
import { connect } from 'dva';
import Form from '../From';
import { api } from '@/utils/apiconfig';
import { getGoodsParamsToValue } from '@/utils/utils';

const Com = props => {
    const columns = [
        {
            title: '色块',
            dataIndex: 'value',
            key: 'value',
            render: (val, obj) => (
                <div
                    className={styles.color}
                    style={{ background: obj.type === 1 ? `url(${api}/${val})` : val }}
                />
            ),
        },
        {
            title: '编码',
            dataIndex: 'code',
            key: 'code',
            // render: (val) => (<div className={styles.color} style={{background: val}}></div>)
        },
        {
            title: '名称',
            dataIndex: 'value',
            key: 'value',
        },

        {
            title: '操作',
            dataIndex: 'action',
            key: 'action',
            render: (text, record) => (
                <div>
                    {/* <a onClick={e => handleEdit(record)}>编辑</a>
                    <Divider type="vertical" /> */}
                    <Popconfirm
                        title="确认要删除吗"
                        onConfirm={() => handleDelete(record)}
                        okText="是"
                        cancelText="否"
                    >
                        <a href="#">删除</a>
                    </Popconfirm>
                    <Divider type="vertical" />
                    <a onClick={() => setVisiblePreview(record)}>预览</a>
                    <Divider type="vertical" />
                    <a onClick={() => handleEdit(record)}>编辑</a>
                </div>
            ),
        },
    ];
    const formRef = useRef();
    const [visible, setVisible] = useState(false);
    const [data, setData] = useState({});
    const [visiblePreview, setVisiblePreview] = useState(null);

    const handleClear = () => {
        setVisible(false);
        formRef.current.resetFields();
        setData({});
    };

    const handleEdit = record => {
        setVisible(true);
        setData(record);
    };

    // useEffect(() => {
    //     if (visible) {
    //         setTimeout(() => {
    //             if (formRef && formRef.current) {
    //                 formRef.current.setFieldsValue({
    //                     ...data,
    //                 });
    //             }
    //         }, 100);
    //     }
    // }, [visible]);

    const handleUpdateForm = () => {
        if (visible) {
            setTimeout(() => {
                let goods = getGoodsParamsToValue(data.goodsId, data.categoryId);
                if (formRef && formRef.current) {
                    formRef.current.setFieldsValue({
                        ...data,
                        ...goods,
                    });
                }
            }, 100);
        }
    };

    const handleDelete = record => {
        props.dispatch({
            type: 'style/deleteColor',
            payload: {
                _id: record._id,
                type: 1,
            },
        });
    };

    const onPageChange = page => {
        props.dispatch({
            type: 'style/getColorList',
            payload: {
                page,
                limit: props.colorList.limit,
                type: 1,
            },
        });
    };

    return (
        <>
            <Modal
                title="编辑"
                visible={visible}
                width="800px"
                footer={null}
                destroyOnClose={true}
                onCancel={() => {
                    handleClear();
                }}
            >
                <Form
                    ref={v => (formRef.current = v)}
                    colorImgWidth={data.width}
                    colorImgHeight={data.height}
                    colorImgUrl={data.value}
                    colorId={data._id}
                    onUpdateForm={handleUpdateForm}
                    updateColor={true}
                    onClose={handleClear}
                />
            </Modal>
            <Modal
                title="预览"
                visible={Boolean(visiblePreview)}
                width="400px"
                footer={null}
                onCancel={() => {
                    setVisiblePreview(null);
                }}
            >
                <div style={{ textAlign: 'center' }}>
                    {visiblePreview && (
                        <img
                            width="auto"
                            height="auto"
                            style={{ maxWidth: '100%' }}
                            src={`${api}/${visiblePreview.value}`}
                            alt=""
                        />
                    )}
                </div>
            </Modal>
            <Table
                columns={columns}
                dataSource={props.colorList.docs}
                pagination={{
                    total: props.colorList.total,
                    current: props.colorList.page,
                    pageSize: props.colorList.limit,
                    onChange: onPageChange,
                }}
            />
        </>
    );
};

export default connect(({ style }) => ({
    colorList: style.colorListFlower,
}))(Com);
