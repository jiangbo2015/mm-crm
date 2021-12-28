import React, { useEffect, useState, useRef } from 'react';
import { Divider, Modal, Popconfirm, Card, Button } from 'antd';
import styles from './index.less';
import { connect } from 'dva';
import Form from '../Form';
import { filterImageUrl } from '@/utils/utils';
import Table from '@/components/Table/SortTable';
const Com = props => {
    const columns = [
        {
            title: '示意图',
            dataIndex: 'colorWithStyleImgs',
            key: 'colorWithStyleImgs',
            render: val => val && val.length > 0 ? <img src={`${filterImageUrl(val[0].imgs[0])}`} style={{width: '50px', height: 'auto'}}/> : null,
        },
        {
            title: '编号',
            dataIndex: 'code',
            key: 'code',
            // render: url => <img width="100px" src={filterImageUrl(url)} />,
        },
        {
            title: '中包数',
            dataIndex: 'bagsNum',
            key: 'bagsNum',
        },
        {
            title: '装箱数',
            dataIndex: 'caseNum',
            key: 'caseNum',
        },
        {
            title: '单价',
            dataIndex: 'price',
            key: 'price',
        },

        {
            title: '创建日期',
            dataIndex: 'createdAt',
            key: 'createdAt',
            render: val => val.slice(0, 10),
        },
        {
            title: '操作',
            dataIndex: 'action',
            key: 'action',
            render: (text, record) => (
                <div>
                    <a onClick={() => handleEdit(record)}>编辑</a>
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
    // const formRef = useRef();
    const [visible, setVisible] = useState(false);
    const [addVisible, setAddVisible] = useState(false);
    const [data, setData] = useState({});

    useEffect(() => {
        if (props.dispatch) {
            props.dispatch({
                type: 'shop/getShopStyleList',
                payload: {
                    limit: 1000,
                }
            });
        }
    }, []);

    const handleSort = options => {
        props.dispatch({
            type: 'shop/shopStyleSort',
            payload: options,
        });
    };

    const handleEdit = record => {
        setVisible(true);
        setData(record);
        props.dispatch({
            type: 'shop/setCurrentShopStyle',
            payload: record,
        });
    };

    const handleDelete = record => {
        props.dispatch({
            type: 'shop/deleteShopStyle',
            payload: {
                _id: record._id,
                type: 0,
            },
        });
    };

    const handleSearch = value => {
        setStyleNo(value);
        props.dispatch({
            type: 'shop/getShopStyleList',
            payload: {
                namecn: value,
                nameen: value,
                limit: 10,
            },
        });
    };
    // const handleClear = () => {
    //     console.log('handleClear');
    //     // formRef.current.resetFields();
    // };
    // const handleSubmit = () => {
    //     // console.log('handleSubmit');
    //     formRef.current.validateFields((err, values) => {
    //         if (!err) {
    //             console.log('values', values);
    //             props.dispatch({
    //                 type: 'shop/addShopStyle',
    //                 payload: values,
    //             });
    //             setVisible(false);
    //             this.handleClear();
    //         }
    //     });
    // };

    const handlePageChange = page => {
        let queries = {};
        props.dispatch({
            type: 'shop/getStyleList',
            payload: {
                limit: 1000,
                ...queries,
            },
        });
    };

    return (
        <Card
            title="款式列表"
            extra={
                <Button type="primary" onClick={() => setAddVisible(true)}>
                    添加
                </Button>
            }
        >
            <Modal
                title="添加"
                visible={addVisible}
                width="1100px"
                destroyOnClose={true}
                footer={null}
                onCancel={() => {
                    setAddVisible(false);
                    // handleClear();
                }}
            >
                <Form
                    onClose={() => {
                        setAddVisible(false);
                    }}
                    currentBranch={props.currentBranch}
                />
            </Modal>
            <Modal
                title="编辑"
                visible={visible}
                width="1100px"
                footer={null}
                destroyOnClose={true}
                onCancel={() => {
                    setVisible(false);
                    // handleClear();
                }}
            >
                <Form
                    // ref={v => (formRef.current = v)}
                    editData={data}
                    onClose={() => {
                        setVisible(false);
                        // handleClear();
                    }}
                />
            </Modal>
            <Table
                rowKey={record => record._id}
                columns={columns}
                loading={props.fetching}
                dataSource={props.styleList.docs}
                onMoveArray={handleSort} 
                pagination={{
                    total: props.styleList.total,
                    current: parseInt(props.styleList.page, 10),
                    pageSize: props.styleList.limit,
                    onChange: handlePageChange,
                }}
            />
        </Card>
    );
};

export default connect(({ shop, loading, global }) => ({
    styleList: shop.currentShopStyleList,
    currentBranch: global.currentBranch,
    fetching: loading.effects['shop/getShopStyleList'],
}))(Com);
