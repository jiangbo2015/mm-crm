import React, { useEffect, useState, useRef } from 'react';
import { Table, Divider, Tag, Modal, Popconfirm } from 'antd';
import styles from './index.less';
import { connect } from 'dva';
import Form from '../Form';

const Com = props => {
    const columns = [
        {
            title: '名称',
            dataIndex: 'name',
            key: 'name',
            render: (text, record) => {
                return record.values.map(x => x.name).join('/');
            },
        },

        {
            title: '操作',
            dataIndex: 'action',
            key: 'action',
            render: (text, record) => (
                <div>
                    <a onClick={e => handleEdit(record)}>编辑</a>
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
    const [data, setData] = useState({});

    const handleUpdate = () => {
        formRef.current.validateFields((err, values) => {
            if (!err) {
                setVisible(false);
                const { currentSize } = props;
                props.dispatch({
                    type: 'global/updateSize',
                    payload: {
                        _id: data._id,
                        values: Object.keys(values)
                            .filter(x => x !== 'goods')
                            .map((item, index) => ({
                                name: values[item],
                            })),
                        goods: values['goods'],
                    },
                });
            }
        });
    };

    useEffect(() => {
        if (visible) {
            setTimeout(() => {
                console.log(formRef);
                data.values.map((x, i) => {
                    formRef.current.setFieldsValue({
                        [`name${i}`]: x.name,
                    });
                });
                formRef.current.setFieldsValue({
                    goods: data.goods || '',
                });
            }, 100);
        }
    }, [visible]);

    const handleDelete = record => {
        props.dispatch({
            type: 'global/deleteSize',
            payload: {
                _id: record._id,
            },
        });
    };

    const handleEdit = record => {
        setVisible(true);
        setData(record);
        props.dispatch({
            type: 'global/setCurrentSize',
            payload: record,
        });
    };

    const handleClear = () => {
        formRef.current.resetFields();
        props.dispatch({
            type: 'global/setCurrentSize',
            payload: {
                values: [{}],
            },
        });
    };
    return (
        <>
            <Modal
                title="编辑"
                visible={visible}
                width="800px"
                onOk={() => {
                    handleUpdate();
                    handleClear();
                }}
                onCancel={() => {
                    setVisible(false);
                    handleClear();
                }}
            >
                <Form ref={v => (formRef.current = v)} />
            </Modal>
            <Table columns={columns} dataSource={props.sizeList} />
        </>
    );
};

export default connect(({ global, loading }) => ({
    sizeList: global.sizeList,
    currentSize: global.currentSize,
    fetching: loading.effects['global/fetchSizeList'],
}))(Com);
