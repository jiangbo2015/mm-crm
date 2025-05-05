import React, { useState, useEffect } from 'react';
import { get, filter } from 'lodash';
import { Card, Button, Modal, Radio } from 'antd';
import { PageHeaderWrapper } from '@ant-design/pro-layout';

import Form from './Form';
import TableBasic from './TableBasic';
import { connect } from 'dva';
import {intl} from '@/utils/utils'
function createCode(pre, currentList) {
    // 过滤出当前列表中与 pre 前缀匹配的编号
    const matchedCodes = filter(currentList, ({code = ''}) => code.startsWith(pre + '-'));

    // 提取已有的字母部分
    const existingLetters = matchedCodes.map(({code = ''}) => {
        const parts = code.split('-');
        return parts[parts.length - 1]; // 获取最后一个部分（字母）
    });

    // 找到下一个可用的字母
    let nextLetter = 'A';
    while (existingLetters.includes(nextLetter)) {
        // 将字母的 Unicode 值加 1，得到下一个字母
        nextLetter = String.fromCharCode(nextLetter.charCodeAt(0) + 1);

        // 如果超过 Z，则停止生成
        if (nextLetter > 'Z') {
            throw new Error('No available letters left (A-Z).');
        }
    }

    // 返回生成的编号
    return `${pre}-${nextLetter}`;
}
// channelList: get(channel, "list"),
const Com = ({dispatch, channelList, currentUser}) => {
    const [visible, setVisible] = useState(false);
    const [allData, setAllData] = useState(false);
    const newChannelCode = createCode(currentUser?.name, channelList)
    const formRef = React.useRef();

    const handleSubmit = () => {
        formRef.current.validateFields((err, values) => {
            console.log(err, values);
            if (!err) {
                setVisible(false);
                dispatch({
                    type: 'channel/add',
                    payload: values,
                });
            }
        });
    };

    const handleClear = () => {
        formRef.current.resetFields();
    };

    const IsAdmin = currentUser.authority === 'admin'

    return (
        <PageHeaderWrapper>
            <Card
                title={
                    IsAdmin ? (
                        <Radio.Group size='large' value={allData} onChange={e => setAllData(e.target.value)}>
                            <Radio.Button value={false}>{intl('我的通道')}</Radio.Button>
                            <Radio.Button value={true}>{intl('所有通道')}</Radio.Button>
                        </Radio.Group>
                    ) : intl("我的通道")
                }
                extra={
                    allData ? null : <Button type="primary" onClick={() => setVisible(true)}>
                        {intl('添加')}
                    </Button>
                }
                style={{ marginBottom: '20px' }}
            >
                <TableBasic isAllData={allData} />
            </Card>
            <Modal
                title={intl("添加")}
                visible={visible}
                onOk={() => {
                    handleSubmit();
                    handleClear();
                }}
                onCancel={() => {
                    setVisible(false);
                    handleClear();
                }}
                destroyOnClose
            >
                <Form ref={v => (formRef.current = v)} code={newChannelCode} />
            </Modal>
        </PageHeaderWrapper>
    );
};

export default connect(({ channel, user }) => ({
    currentUser: get(user, 'currentUser'),
    channelList: get(channel, "list"),
}))(Com);
