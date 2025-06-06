// import { imgUrl } from '@/utils/apiconfig';
import { filterImageUrl } from '@/utils/utils';
import { Divider, Modal, Popconfirm, Table } from 'antd';
import { get } from 'lodash';
import { connect } from 'dva';
import moment from 'moment'
import React, { useRef, useState } from 'react';
import Form from '../From';
import styles from './index.less';
import RecordModal from '@/components/RecordModal';
import { intl } from '@/utils/utils'

const Com = props => {
    const columns = [
        {
            title: '色块',
            dataIndex: 'value',
            key: 'value',
            render: (val, obj) => (
                <div
                    className={styles.color}
                    style={{
                        background: `url(${filterImageUrl(val)}?tr=w-50)`,
                    }}
                />
            ),
        },
        {
            title: '开发编号',
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
            title: '创建人',
            dataIndex: 'creator',
            key: 'creator',
            render: (creator) => get(creator, 'name', '-')
        },
        {
            title: '创建日期',
            dataIndex: 'createdAt',
            key: 'createdAt',
            render: (createdAt) => moment(createdAt).format('YYYY-MM-DD hh:mm:ss')
        },
        {
            title: '操作',
            dataIndex: 'action',
            key: 'action',
            render: (text, record) => (
                <div>
                    {/* <a onClick={e => handleEdit(record)}>编辑</a>
                    <Divider type="vertical" /> */}

                    <a onClick={() => handleEdit(record)}>{intl("编辑")}</a>
                    <Divider type="vertical" />
                    <a onClick={() => setVisiblePreview(record)}>{intl("预览")}</a>
                    <Divider type="vertical" />
                    <Popconfirm
                        title="确认要删除吗"
                        onConfirm={() => handleDelete(record)}
                        okText="是"
                        cancelText="否"
                    >
                        <a href="#">{intl("删除")}</a>
                    </Popconfirm>
                     <Divider type="vertical" />
                    <a onClick={() => props.dispatch({type: 'record/getList', payload: {modelId: record._id}})}>{intl("修改记录")}</a>
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
                // let goods = getGoodsParamsToValue(data.goodsId, data.categoryId);
                if (formRef && formRef.current) {
                    formRef.current.setFieldsValue({
                        ...data,
                        sizeOrigin: data.sizeOrigin || data.size,
                        // ...goods,
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
                type: 2,
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
                    submitFetching={props.submitFetching}
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
                            src={`${filterImageUrl(visiblePreview.value)}`}
                            alt=""
                        />
                    )}
                </div>
            </Modal>
            <Table
                rowKey={record => record._id}
                columns={columns}
                loading={props.fetching}
                dataSource={props.colorList.docs}
                rowSelection={{
                    onChange: (selectedRowKeys, selectedRows) => {
                        props.setSelectedKeys(selectedRowKeys);
                    },
                }}
                pagination={{
                    total: props.colorList.total,
                    current: parseInt(props.colorList.page, 10),
                    pageSize: props.colorList.limit,
                    onChange: props.onPageChange,
                    showSizeChanger: true,
                    pageSizeOptions: [10, 20, 50, 100, 500],
                }}
            />
            {props.record.visible && <RecordModal {...props.record} modelName="flower" onCancel={() => props.dispatch({type: 'record/toggleModal', payload: false})} />}
        </>
    );
};

export default connect(({ style, loading, record }) => ({
    colorList: style.colorListFlower,
    fetching: loading.effects['style/getColorList'],
    submitFetching: loading.effects['style/update'],
    record,
}))(Com);
