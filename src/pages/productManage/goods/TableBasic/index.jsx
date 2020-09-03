import React, { useEffect, useState, useRef } from 'react';
import { Divider, Spin, Modal, Popconfirm } from 'antd';
// import styles from './index.less';
import Table from '@/components/Table/SortTable';
import { connect } from 'dva';
import Form from '../Form';

const Com = props => {
    const columns = [
        {
            title: '名称',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: '展示名字',
            dataIndex: 'aliasName',
            key: 'aliasName',
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

    const handleSort = options => {
        props.dispatch({
            type: 'goods/sort',
            payload: options,
        });
    };
    const handleUpdate = () => {
        formRef.current.validateFields((err, values) => {
            if (!err) {
                setVisible(false);
                const { category = [], imgUrl } = props;
                const newCategory = [];

                const fieldsCategoryName = Object.keys(values).filter(
                    x => x.indexOf('cname') === 0,
                );
                fieldsCategoryName.map((name, index) => {
                    let obj = {
                        name: values[name],
                    };
                    let nameGroup = name.split('-');
                    if (nameGroup.length >= 2) {
                        obj._id = nameGroup[1];
                    }
                    if (obj.name) {
                        newCategory.push(obj);
                    }
                    // return obj;
                });
                props.dispatch({
                    type: 'goods/update',
                    payload: {
                        _id: data._id,
                        name: values.name,
                        aliasName: values.aliasName,
                        imgUrl,
                        category: newCategory,
                    },
                });
            }
        });
    };
    const handleClear = () => {
        formRef.current.resetFields();
        props.dispatch({
            type: 'goods/setImgUrl',
            payload: '',
        });
        props.dispatch({
            type: 'goods/setCategories',
            payload: [],
        });
    };
    useEffect(() => {
        if (visible) {
            setTimeout(() => {
                console.log(formRef);
                formRef.current.setFieldsValue({
                    name: data.name,
                    aliasName: data.aliasName,
                });
                props.dispatch({
                    type: 'goods/setCategories',
                    payload: data.category,
                });
                props.dispatch({
                    type: 'goods/setImgUrl',
                    payload: data.imgUrl,
                });
                data.category.map((x, index) => {
                    formRef.current.setFieldsValue({
                        [`cname-${x._id}`]: x.name,
                        [`size-${x._id}`]: x.sizeId,
                    });
                });
            }, 100);
        }
    }, [visible]);
    useEffect(() => {
        props.dispatch({
            type: 'goods/getList',
        });
    }, []);
    const handleDelete = record => {
        props.dispatch({
            type: 'goods/delete',
            payload: {
                _id: record._id,
            },
        });
    };

    const handleEdit = record => {
        setVisible(true);
        setData(record);
    };
    return (
        <>
            <Modal
                title="编辑"
                visible={visible}
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
            {props.fetching ? (
                <Spin />
            ) : (
                <Table columns={columns} dataSource={props.goodsList} onMoveArray={handleSort} />
            )}
        </>
    );
};

export default connect(({ goods, loading }) => ({
    goodsList: goods.list,
    fetching: loading.effects['goods/getList'],
    category: goods.category,
    imgUrl: goods.imgUrl,
}))(Com);
