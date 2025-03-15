import React, { useState, useEffect } from 'react';
import { get, filter, map } from 'lodash';
import { Card, Button, Tag, Select, Form } from 'antd';
import { PageHeaderWrapper } from '@ant-design/pro-layout';

import {
    UserOutlined,
} from '@ant-design/icons';

import { connect } from 'dva';
import { useParams } from 'umi';

import ColorsModal from '@/components/ColorsModal'
import StylesSelectorModal from '@/components/StylesSelectorModal'
import { PlainColorItem, FlowerColorItem } from '@/components/ColorItem'
import { StyleItem } from '@/components/StyleItem'
import useFormModal from '@/hooks/useFormModal'
// import usePlainColorsModal from '@/hooks/usePlainColorsModal'
import styles from './index.less';

const tagRender = (props) => {
    const { label, value, closable, onClose } = props;
    const onPreventMouseDown = (event) => {
      event.preventDefault();
      event.stopPropagation();
    };
    return (
      <Tag
        color="geekblue"
        onMouseDown={onPreventMouseDown}
        closable={closable}
        onClose={onClose}
        style={{ fontSize: '14px', lineHeight: '30px', marginRight: 8 }} 
        className={styles.tag} 
        icon={<UserOutlined />}
      >
        {label}
      </Tag>
    );
  };

const Com = ({dispatch, currentChannel = {}, updateChannelLoading, customerList}) => {
    const { costomers, populatedPlainColors = [], populatedStyles = [], populatedFlowerColors = [] } = currentChannel
    const [visiblePlainColorsModal, setVisiblePlainColorsModal] = useState(false);
    const [visibleFlowerColorsModal, setVisibleFlowerColorsModal] = useState(false);
    const [visibleStylesSelectorModal, setVisibleStylesSelectorModal] = useState(false);
    const params = useParams()

    const [FormModal, showModal] = useFormModal({}, {
        title: '客户分配',
        onOk: (values) => {
            onFinishAssginCostomer(values)
        },
      }, {costomers: map(costomers, c => (c._id))});
      useEffect(() => {
        dispatch({
            type: 'user/fetch',
            payload: {
                role: 3,
            },
        });
    }, [])
    
    useEffect(() => {
        dispatch({
            type: 'channel/findById',
            payload: {_id: params.id}
        })
    }, [params.id])

    const showPlainColorsModal = () => {
        setVisiblePlainColorsModal(true)
    }
    const showFlowerColorsModal = () => {
        setVisibleFlowerColorsModal(true)
    }
    const showStylesSelectorModal = () => {
        setVisibleStylesSelectorModal(true)
    }


    const onFinishAssginCostomer = (values) => {
        dispatch({
            type: 'channel/updateCostomers',
            payload: { _id: params.id, ...values }
        })
        console.log('Received values of form: ', values);
    };

    const handleUpdatePlainColors = async (selectedPlainColors) => {
        await dispatch({
            type: 'channel/update',
            payload: {
                _id: params.id,
                plainColors: map(selectedPlainColors, c => c._id)
            },
        });
        
        setVisiblePlainColorsModal(false)
    };

    const handleUpdateFlowerColors = async (selectedFlowerColors) => {
        await dispatch({
            type: 'channel/update',
            payload: {
                _id: params.id,
                flowerColors: map(selectedFlowerColors, c => c._id)
            },
        });
        
        setVisibleFlowerColorsModal(false)
    };

    const handleUpdateStyles = async (selectedStyles) => {
        await dispatch({
            type: 'channel/update',
            payload: {
                _id: params.id,
                styles: map(selectedStyles, c => c._id)
            },
        });

        setVisibleStylesSelectorModal(false)
    };

    return (
        <PageHeaderWrapper >
            <Card
                title="客户"
                extra={
                    <Button type="primary" onClick={showModal}>
                        分配
                    </Button>
                }
                style={{ marginBottom: '20px' }}
            >
                {map(costomers, c => (<Tag
                    color="geekblue"
                    style={{ fontSize: '14px', lineHeight: '30px', marginRight: 8 }} 
                    className={styles.tag} 
                    icon={<UserOutlined />}
                >
                    {c?.name}
                </Tag>))}
                <FormModal>
                    <Form.Item
                        name="costomers"
                    >
                        <Select
                            mode="multiple"
                            showArrow
                            tagRender={tagRender}
                            style={{ width: '100%', lineHeight: '38px' }}
                            options={map(customerList, c => ({label: c?.name, value: c?._id}))}
                        />
                    </Form.Item>
                </FormModal>
            </Card>
            <Card
                title="胶囊"
                extra={
                    <Button type="primary" onClick={showModal}>
                        分配
                    </Button>
                }
                style={{ marginBottom: '20px' }}
            >
                {map(costomers, c => (<Tag
                    color="geekblue"
                    style={{ fontSize: '14px', lineHeight: '30px', marginRight: 8 }} 
                    className={styles.tag} 
                    icon={<UserOutlined />}
                >
                    {c?.name}
                </Tag>))}
                <FormModal>
                    <Form.Item
                        name="costomers"
                    >
                        <Select
                            mode="multiple"
                            showArrow
                            tagRender={tagRender}
                            style={{ width: '100%', lineHeight: '38px' }}
                            options={map(customerList, c => ({label: c?.name, value: c?._id}))}
                        />
                    </Form.Item>
                </FormModal>
            </Card>
            <Card
                title="款式"
                extra={
                    <Button type="primary" onClick={showStylesSelectorModal}>
                        分配
                    </Button>
                }
                style={{ marginBottom: '20px' }}
            >
                <div className={styles['flex-box']}>
                    {map(populatedStyles, item => (<StyleItem
                        item={item}
                        size={60}
                    />))}
                </div>

                <StylesSelectorModal
                    modalProps={{
                        visible: visibleStylesSelectorModal,
                        onCancel: () => setVisibleStylesSelectorModal(false),
                        confirmLoading: updateChannelLoading
                    }}
                    onStylesSelectorModalOk={handleUpdateStyles}
                    initSelectedStyles={populatedStyles}
                />
            </Card>
            <Card
                title="颜色"
                extra={
                    <Button type="primary" onClick={showPlainColorsModal}>
                        分配
                    </Button>
                }
                style={{ marginBottom: '20px' }}
            >
                <div className={styles['flex-box']}>
                    {map(populatedPlainColors, pc => (<PlainColorItem item={pc} size={40} />))}
                </div>
                
                <ColorsModal 
                    colorType={0}
                    modalProps={{
                        visible: visiblePlainColorsModal,
                        onCancel: () => setVisiblePlainColorsModal(false),
                        confirmLoading: updateChannelLoading
                    }}
                    onColorsModalOk={handleUpdatePlainColors}
                    initSelectedColors={populatedPlainColors}
                />
            </Card>
            <Card
                title="花布"
                extra={
                    <Button type="primary" onClick={showFlowerColorsModal}>
                        分配
                    </Button>
                }
                style={{ marginBottom: '20px' }}
            >
                <div className={styles['flex-box']}>
                    {map(populatedFlowerColors, pc => (<FlowerColorItem item={pc} size={40} />))}
                </div>
                <ColorsModal 
                    colorType={1}
                    modalProps={{
                        visible: visibleFlowerColorsModal,
                        onCancel: () => setVisibleFlowerColorsModal(false),
                        confirmLoading: updateChannelLoading
                    }}
                    onColorsModalOk={handleUpdateFlowerColors}
                    initSelectedColors={populatedFlowerColors}
                />
            </Card>
        </PageHeaderWrapper>
    );
};

export default connect(({ channel, user, loading }) => ({
    currentUser: get(user, 'currentUser'),
    customerList: get(user, "customerList", []),
    channelList: get(channel, "list"),
    currentChannel: get(channel, "currentChannel", {}),
    updateChannelLoading: loading.effects['channel/update']
}))(Com);
