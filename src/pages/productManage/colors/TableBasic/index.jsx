import { Divider, Modal, Popconfirm, Table } from 'antd';
import { connect } from 'dva';
import React, { useEffect, useRef, useState } from 'react';
import Form from '../From';
import styles from './index.less';

const Com = props => {
    const columns = [
        {
            title: '色块',
            dataIndex: 'value',
            key: 'value',
            render: val => <div className={styles.color} style={{ background: val }} />,
        },
        {
            title: '编码',
            dataIndex: 'code',
            key: 'code',
            // render: (val) => (<div className={styles.color} style={{background: val}}></div>)
        },
        {
            title: '色值',
            dataIndex: 'value',
            key: 'value',
        },
        {
            title: '中文名',
            dataIndex: 'namecn',
            key: 'namecn',
        },
        {
            title: '英文名',
            dataIndex: 'nameen',
            key: 'nameen',
        },

        {
            title: '操作',
            dataIndex: 'action',
            key: 'action',
            render: (text, record) => (
                <div>
                    {/* <a onClick={e => handleEdit(record)}>编辑</a>*/}

                    <a onClick={() => handleEdit(record)}>编辑</a>
                    <Divider type="vertical" />
                    <a onClick={() => setVisiblePreview(record)}>预览</a>
                    <Divider type="vertical" />
                    <Popconfirm
                        title="确认要删除吗"
                        onConfirm={() => handleDelete(record)}
                        okText="是"
                        cancelText="否"
                    >
                        <a>删除</a>
                    </Popconfirm>
                </div>
            ),
        },
    ];
    const formRef = useRef();
    const [visible, setVisible] = useState(false);
    const [data, setData] = useState({});
    const [visiblePreview, setVisiblePreview] = useState(null);

    const handleEdit = record => {
        setVisible(true);
        setData(record);
    };

    const handleUpdate = () => {
        formRef.current.validateFields((err, values) => {
            if (!err) {
                setVisible(false);
                const { currentSize } = props;
                props.dispatch({
                    type: 'color/update',
                    payload: {
                        _id: data._id,
                        ...values,
                    },
                });
            }
        });
    };

    useEffect(() => {
        if (visible) {
            setTimeout(() => {
                if (formRef && formRef.current) {
                    // let goods = getGoodsParamsToValue(data.goodsId, data.categoryId);
                    formRef.current.setFieldsValue({
                        code: data.code,
                        value: data.value,
                        namecn: data.namecn,
                        nameen: data.nameen,
                        goodsId: data.goodsId,
                        relatedColors: data.relatedColors,
                        // ...goods,
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
                type: 0,
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
                onOk={() => {
                    handleUpdate();
                    // handleClear();
                }}
                onCancel={() => {
                    setVisible(false);
                    // handleClear();
                }}
            >
                <Form ref={v => (formRef.current = v)} colorId={data._id} updateColor={true} />
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
                <div style={{ display: 'flex', justifyContent: 'center' }}>
                    <div
                        style={{
                            width: '200px',
                            height: '200px',
                            background: visiblePreview && visiblePreview.value,
                        }}
                    />
                </div>
            </Modal>
            <Table
                rowKey={record => record._id}
                columns={columns}
                loading={props.fetching}
                rowSelection={{
                    onChange: (selectedRowKeys, selectedRows) => {
                        props.setSelectedKeys(selectedRowKeys);
                    },
                }}
                dataSource={props.colorList.docs}
                pagination={{
                    total: props.colorList.total,
                    current: parseInt(props.colorList.page, 10),
                    pageSize: props.colorList.limit,
                    onChange: props.onPageChange,
                    showSizeChanger: true,
                    pageSizeOptions: [10, 20, 50, 100, 500],
                }}
            />
        </>
    );
};

export default connect(({ style, loading }) => ({
    colorList: style.colorList,
    fetching: loading.effects['style/getColorList'],
}))(Com);
