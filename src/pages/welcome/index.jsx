import React, { useEffect, useState } from 'react';
import { connect } from 'dva';
import { Card, Typography, Alert, Row, Modal, Icon } from 'antd';

import From from './From';

const fileIconTypes = {
    文档: { type: 'file-pdf', theme: 'twoTone', twoToneColor: 'red' },
    视频: {
        type: 'play-square',
        style: {
            color: 'green',
        },
    },
};
const Welcome = props => {
    const { currentUser } = props;
    const [edit, setEdit] = useState(false);
    useEffect(() => {
        props.dispatch({
            type: 'system/getHelpFiles',
        });
    }, []);
    const handleDel = _id => {
        props.dispatch({
            type: 'system/deleteHelpfile',
            payload: { _id },
        });
    };
    return (
        // <PageHeaderWrapper>
        <Card style={{ height: '100%' }}>
            <Alert
                message="使用说明"
                type="success"
                showIcon
                banner
                style={{
                    margin: -12,
                    marginBottom: 24,
                }}
            />
            <Modal
                visible={edit}
                footer={null}
                destroyOnClose={true}
                onCancel={() => {
                    setEdit(false);
                }}
            >
                <From></From>
            </Modal>
            <Row type="flex">
                {props.helpFiles.map(h => (
                    <Card
                        bodyStyle={{
                            position: 'relative',
                        }}
                        style={{ marginRight: '20px' }}
                    >
                        {currentUser.role === 0 ? (
                            <Icon
                                type="delete"
                                style={{
                                    fontSize: '14px',
                                    position: 'absolute',
                                    top: '2px',
                                    right: '2px',
                                }}
                                onClick={() => {
                                    handleDel(h._id);
                                }}
                            />
                        ) : null}
                        <a href={h.url}>
                            <div
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    cursor: 'pointer',
                                    flexDirection: 'column',
                                }}
                            >
                                <Icon
                                    // type="play-square"
                                    // style={{
                                    //     color: 'green',
                                    // }}
                                    {...fileIconTypes[h.type]}
                                />
                                {h.name}
                            </div>
                        </a>
                    </Card>
                ))}

                {/* <Card style={{ marginRight: '20px' }}>
                    <Icon type="file-pdf" theme="twoTone" twoToneColor="red" />
                </Card> */}
                {currentUser.role === 0 ? (
                    <Card
                        style={{
                            border: '1px dashed',
                            cursor: 'pointer',
                        }}
                        onClick={() => {
                            setEdit(true);
                        }}
                    >
                        <Icon
                            type="plus"
                            style={{
                                fontSize: '24px',
                            }}
                        />
                    </Card>
                ) : null}
            </Row>
        </Card>
        // </PageHeaderWrapper>
    );
};
export default connect(({ system, user }) => ({
    helpFiles: system.helpFiles || [],
    currentUser: user.currentUser,
}))(Welcome);
