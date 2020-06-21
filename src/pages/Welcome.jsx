import React from 'react';
import { Card, Typography, Alert, Row, Col, Icon } from 'antd';
import { PageHeaderWrapper } from '@ant-design/pro-layout';

const CodePreview = ({ children }) => (
    <pre
        style={{
            background: '#f2f4f5',
            padding: '12px 20px',
            margin: '12px 0',
        }}
    >
        <code>
            <Typography.Text copyable>{children}</Typography.Text>
        </code>
    </pre>
);

export default () => (
    <PageHeaderWrapper>
        <Card>
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
            {/* <Row>
                <Col span="8">
                    <Card>
                        <Icon type="play-square" theme="twoTone" twoToneColor="green" />
                    </Card>
                </Col>
                <Col span="8">
                    <Card>
                        <Icon type="file-pdf" theme="twoTone" twoToneColor="red" />
                    </Card>
                </Col>
            </Row> */}
        </Card>
    </PageHeaderWrapper>
);
