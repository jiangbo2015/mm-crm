import React, { useState, useEffect, useRef } from 'react';
import { Card, Button, Modal, Row, Col, Input } from 'antd';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import TableBasic from './TableBasic2';
import Form from './Form/branch.jsx';
import { connect } from 'umi';

const { Search } = Input;

const Com = props => {
    const formRef = useRef();
    const [visible, setVisible] = useState(false);
    const [styleNo, setStyleNo] = useState(false);
    useEffect(() => {
        if (props.dispatch) {
            props.dispatch({
                type: 'global/fetchAllBranchList',
            });
        }
    }, []);

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
    const handleClear = () => {
        console.log('handleClear');
        // formRef.current.resetFields();
    };
    const handleSubmit = () => {
        // console.log('handleSubmit');
        formRef.current.validateFields((err, values) => {
            if (!err) {
                console.log('values', values);
                props.dispatch({
                    type: 'shop/addShopStyle',
                    payload: values,
                });
                setVisible(false);
                this.handleClear();
            }
        });
    };

    // const handlePageChange = page => {
    //     let queries = {};
    //     if (styleNo) {
    //         queries.namecn = styleNo;
    //         queries.nameen = styleNo;
    //     }
    //     props.dispatch({
    //         type: 'shop/getStyleList',
    //         payload: {
    //             page,
    //             limit: 10,
    //             ...queries,
    //         },
    //     });
    // };
    return (
        <PageHeaderWrapper>
            <Card
                title="网店-品牌列表"
                extra={
                    <Button type="primary" onClick={() => setVisible(true)}>
                        添加
                    </Button>
                }
            >
                <TableBasic />
            </Card>

            <Modal
                title="添加"
                visible={visible}
                width="1100px"
                destroyOnClose={true}
                footer={null}
                onCancel={() => {
                    setVisible(false);
                }}
            >
                <Form
                    onClose={() => {
                        setVisible(false);
                    }}
                />
            </Modal>
        </PageHeaderWrapper>
    );
};

export default connect(state => ({
    branchList: state.global.branchList,
}))(Com);
