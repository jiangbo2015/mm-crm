import React, { useState, useEffect } from 'react';
import { get, filter, map } from 'lodash';
import { Card, Button, Tag } from 'antd';
import { PageHeaderWrapper } from '@ant-design/pro-layout';

import {
    UserOutlined,
} from '@ant-design/icons';

import { connect } from 'dva';
import { useParams } from 'umi';
import styles from './index.less';

const Com = ({dispatch, currentChannel = {}, currentUser}) => {
    const { costomers,flowerColors,plainColors,styles } = currentChannel
    const [visible, setVisible] = useState(false);
    const params = useParams()
    console.log('currentChannel', currentChannel)
    useEffect(() => {
        dispatch({
            type: 'channel/findById',
            payload: {_id: params.id}
        })
    }, [params.id])

    return (
        <PageHeaderWrapper>
            <Card
                title="客户"
                extra={
                    <Button type="primary" onClick={() => setVisible(true)}>
                        添加
                    </Button>
                }
                style={{ marginBottom: '20px' }}
            >
                {map(costomers, costom => ( <Tag color="geekblue" style={{ fontSize: '14px', lineHeight: '30px' }} className={styles.tag} icon={<UserOutlined />}>
                    {costom.name}
                </Tag>))}
            </Card>
        </PageHeaderWrapper>
    );
};

export default connect(({ channel, user }) => ({
    currentUser: get(user, 'currentUser'),
    channelList: get(channel, "list"),
    currentChannel: get(channel, "currentChannel", {})
}))(Com);
