import React, { useEffect, useState, useRef } from 'react';
import { Table, Divider, Modal, Popconfirm, Row, Col, Input } from 'antd';
import styles from './index.less';
import { connect } from 'dva';
import Form from '../Form/branch.jsx';
import ShopProductTable from './shopProduct';
import { filterImageUrl } from '@/utils/utils';

const Com = props => {
    const columns = [
        {
            title: '中文名',
            dataIndex: 'namecn',
            key: 'namecn',
            // render: url => <img width="100px" src={filterImageUrl(url)} />,
        },
        {
            title: '英文名',
            dataIndex: 'nameen',
            key: 'nameen',
            // render: url => <img width="100px" src={filterImageUrl(url)} />,
        },
        {
            title: '状态',
            dataIndex: 'status',
            key: 'status',
            render: val => (val ? '已发布' : '未发布'),
        },
        {
            title: '创建日期',
            dataIndex: 'createdAt',
            key: 'createdAt',
            render: (val) => (<div>{val.slice(0,10)}</div>)
        },
        {
            title: '操作',
            dataIndex: 'action',
            key: 'action',
            render: (text, record) => (
                <div>
                    <a onClick={() => handleSystemStyle(record)}>款式管理</a>
                    <Divider type="vertical" />
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
    const [data, setData] = useState({});
    const [visibleSystemStyle, setVisibleSystemStyle] = useState(null);

    const handleEdit = record => {
        setVisible(true);
        setData(record);
    };

    const handleSystemStyle = record => {
        props.dispatch({
            type: 'global/setCurrentBranch',
            payload: record,
        });
        setVisibleSystemStyle(true);
    };

    const handleDelete = record => {
        // onClose;
        props.dispatch({
            type: 'global/deleteBranch',
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
                width="500px"
                footer={null}
                destroyOnClose={true}
                onCancel={() => {
                    setVisible(false);
                    // handleClear();
                }}
            >
                <Form
                    editData={data}
                    onClose={() => {
                        setVisible(false);
                        // handleClear();
                    }}
                />
            </Modal>
            <Modal
                title={`${props.currentBranch.namecn}-款式管理`}
                visible={visibleSystemStyle}
                width="1100px"
                footer={null}
                destroyOnClose={true}
                onCancel={() => {
                    setVisibleSystemStyle(false);
                    // handleClear();
                }}
            >
                <ShopProductTable />
            </Modal>
            <Table
                rowKey={record => record._id}
                columns={columns}
                loading={props.fetching}
                dataSource={props.allBranchList}
                pagination={null}
                childrenColumnName="dfdrfrf5fgfsg"
            />
        </>
    );
};

export default connect(({ shop, loading, global }) => ({
    styleList: shop.currentShopStyleList,
    branchList: global.branchList,
    allBranchList: global.allBranchList,
    currentBranch: global.currentBranch,
    fetching: loading.effects['global/fetchAllBranchList'],
}))(Com);
