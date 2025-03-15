import React, { useState, useEffect, useRef } from 'react';
import { Card, Typography, Alert, Radio, Modal, Row, Col, Input } from 'antd';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import TableBasic from './TableBasic';
import Form from './Form/index';
import { connect, useIntl } from 'umi';
import { intl } from '@/utils/utils'

const { Search } = Input;

const Com = props => {
    const formRef = useRef();
    const [visible, setVisible] = useState(false);
    const [styleNo, setStyleNo] = useState(false);
    const [capsuleStatus, setCapsuleStatus] = useState('pending');
    useEffect(() => {
        if (props.dispatch) {
            const payload = {
                status: capsuleStatus,
                limit: 10,
            }
            if(styleNo) {
                payload.name = styleNo
            }
            props.dispatch({
                type: 'capsule/getList',
                payload
            });
        }
    }, []);

    const handleSearch = value => {
        setStyleNo(value);
        const payload = {
            limit: 10,
            status: capsuleStatus,
        }
        if(value) {
            payload.name = value
        }
        props.dispatch({
            type: 'capsule/getList',
            payload,
        });
    };
    const handleChangeStatus = value => {
        setCapsuleStatus(value);
        const payload = {
            status: value,
            limit: 10,
        }
        if(styleNo) {
            payload.name = styleNo
        }
        props.dispatch({
            type: 'capsule/getList',
            payload,
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
                    type: 'capsule/add',
                    payload: values,
                });
                setVisible(false);
                this.handleClear();
            }
        });
    };

    const handlePageChange = page => {
        let queries = {};
        if (styleNo) {
            queries.name = styleNo;
        }
        props.dispatch({
            type: 'capsule/getList',
            payload: {
                page,
                limit: 10,
                status: capsuleStatus,
                ...queries,
            },
        });
    };
    return (
        <PageHeaderWrapper>
            <Row style={{ marginBottom: '10px' }}>
                <Col span="8">
                    <Search
                        placeholder="请输入胶囊名称"
                        onSearch={value => handleSearch(value)}
                        enterButton
                    />
                </Col>
            </Row>
            <Card
                title={
                    <>{intl('page.capsule.tableTitle')}
                    <Radio.Group 
                        style={{marginLeft: '10px'}} 
                        value={capsuleStatus} 
                        onChange={e => handleChangeStatus(e.target.value)}
                    >
                        <Radio.Button value="pending">待审核</Radio.Button>
                        <Radio.Button value="published">已发布</Radio.Button>
                        <Radio.Button value="draft">默认状态</Radio.Button>
                    </Radio.Group>
                    </>
                }
            >
                <TableBasic
                    onPageChange={page => {
                        handlePageChange(page);
                    }}
                />
            </Card>

            <Modal
                title="添加"
                visible={visible}
                width="800px"
                destroyOnClose={true}
                footer={null}
                onOk={() => {
                    handleSubmit();
                }}
                onCancel={() => {
                    setVisible(false);
                    handleClear();
                }}
            >
                <Form onClose={() => {
                    setVisible(false);
                    // handleClear();
                }}/>
            </Modal>
        </PageHeaderWrapper>
    );
};

export default connect(state => ({
    capsuleList: state.capsule.list,
}))(Com);
