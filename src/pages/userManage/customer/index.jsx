import React, { useState, useEffect } from 'react';
import { Card, Button, Modal, Radio } from 'antd';
import { PageHeaderWrapper } from '@ant-design/pro-layout';

import Form from './Form';
import TableBasic from './TableBasic';
import { connect } from 'dva';
import {intl} from '@/utils/utils'

const Com = props => {
    const [visible, setVisible] = useState(false);
    const [allData, setAllData] = useState(false);
    const formRef = React.useRef();
    useEffect(() => {
        props.dispatch({
            type: 'channel/getList',
            payload: {},
        });
    }, []);
    const handleSubmit = () => {
        formRef.current.validateFields((err, values) => {
            console.log(err, values);
            if (!err) {
                setVisible(false);
                props.dispatch({
                    type: 'user/add',
                    payload: {
                        role: 3,
                        ...values,
                        fetchParams: {
                            role: 3,
                            owner: allData ? undefined : props.user.currentUser._id
                        }
                    },
                });
            }
        });
    };

    const download = () => {
        props.dispatch({
            type: 'user/download',
            payload: {},
        });
    };

    const handleClear = () => {
        formRef.current.resetFields();
    };

    const IsAdmin = props.user.currentUser.authority === 'admin'

    return (
        <PageHeaderWrapper>
            <Card
                title={
                    IsAdmin ? (
                        <Radio.Group size='large' value={allData} onChange={e => setAllData(e.target.value)}>
                            <Radio.Button value={false}>{intl('我的客户')}</Radio.Button>
                            <Radio.Button value={true}>{intl('所有客户')}</Radio.Button>
                        </Radio.Group>
                    ) : "我的客户"
                }
                extra={
                    <div>
                        {allData ? null : <Button type="primary" onClick={() => setVisible(true)}>
                            {intl('添加')}
                        </Button>}
                        {/* <Button
                            style={{ marginLeft: '20px' }}
                            type="primary"
                            onClick={() => download()}
                        >
                            导出
                        </Button> */}
                    </div>
                }
                style={{ marginBottom: '20px' }}
            >
                <TableBasic isAllData={allData} />
            </Card>
            <Modal
                title={intl("添加")}
                visible={visible}
                width="800px"
                onOk={() => {
                    handleSubmit();
                    handleClear();
                }}
                onCancel={() => {
                    setVisible(false);
                    handleClear();
                }}
            >
                <Form ref={v => (formRef.current = v)} />
            </Modal>
        </PageHeaderWrapper>
    );
};

export default connect(({ user }) => ({user}))(Com);
