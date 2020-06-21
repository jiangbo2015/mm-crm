import React, { useEffect, useState, useRef } from 'react';
import { Table, Divider, Modal, Popconfirm } from 'antd';
import styles from './index.less';
import { connect } from 'dva';
import Form from '../From';
import { api } from '@/utils/apiconfig';

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
                    <a style={{ marginLeft: '20px' }} onClick={() => setVisiblePreview(record)}>
                        预览
                    </a>
                    <a onClick={() => handleEdit(record)}>编辑</a>
                </div>
            ),
        },
    ];
    const formRef = useRef();
    const [visible, setVisible] = useState(false);
    const [data, setData] = useState({});
    const [visiblePreview, setVisiblePreview] = useState(null);

    const handlePreview = () => {};

    const handleEdit = record => {
        setVisible(true);
        setData(record);
    };

    const handleUpdate = () => {
        // formRef.current.validateFields((err, values) => {
        //     if (!err) {
        //         setVisible(false);
        //         const { currentSize } = props;
        //         props.dispatch({
        //             type: 'global/updateSize',
        //             payload: {
        //                 _id: data._id,
        //                 values: currentSize.values.map((x, i) => ({
        //                     ...x,
        //                     name: values[`name${i}`],
        //                 })),
        //             },
        //         });
        //     }
        // });
    };

    useEffect(() => {
        if (visible) {
            setTimeout(() => {
                if (formRef && formRef.current) {
                    formRef.current.setFieldsValue({
                        ...data,
                    });
                }
            }, 100);
        }
    }, [visible]);

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
                onOk={() => {
                    handleUpdate();
                    handleClear();
                }}
                onCancel={() => {
                    setVisible(false);
                    // handleClear();
                }}
            >
                <Form
                    ref={v => (formRef.current = v)}
                    colorImgWidth={data.width}
                    colorImgHeight={data.height}
                    colorImgUrl={data.value}
                    colorId={data._id}
                    updateColor={true}
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
