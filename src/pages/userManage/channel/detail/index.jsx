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
import CapsulesSelectModal from '@/components/CapsulesSelectModal'

import { PlainColorItem, FlowerColorItem } from '@/components/ColorItem'
import { StyleItem } from '@/components/StyleItem'
import { CapsuleItem } from '@/components/CapsuleItem'
import useFormModal from '@/hooks/useFormModal'
import { intl } from '@/utils/utils'
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

const Com = ({dispatch, currentChannel = {},currentUser={}, updateChannelLoading, customerList}) => {
    const { costomers, 
        populatedPlainColors = [], 
        populatedStyles = [], 
        populatedFlowerColors = [],
        populatedTextures = [],
        populatedCapsules = []
     } = currentChannel
    const [visiblePlainColorsModal, setVisiblePlainColorsModal] = useState(false);
    const [visibleFlowerColorsModal, setVisibleFlowerColorsModal] = useState(false);
    const [visibleTexturesModal, setVisibleTexturesModal] = useState(false);
    const [visibleStylesSelectorModal, setVisibleStylesSelectorModal] = useState(false);
    const [visibleCapsulesSelectModal, setVisibleCapsulesSelectModal] = useState(false);
    
    const params = useParams()

    const [FormModal, showModal] = useFormModal({}, {
        title: null,
        onOk: (values) => {
            onFinishAssginCostomer(values)
        },
        closeIcon: false,
        closable:false
      }, {costomers: map(costomers, c => (c._id))});
      useEffect(() => {
        dispatch({
            type: 'user/fetch',
            payload: {
                role: 3,
                owner: currentUser._id
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
    const showTexturesModal = () => {
        setVisibleTexturesModal(true)
    }
    const showStylesSelectorModal = () => {
        setVisibleStylesSelectorModal(true)
    }

    const showCapsulesSelectModal = () => {
        setVisibleCapsulesSelectModal(true)
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

    const handleUpdateTextures = async (selectedTextures) => {
        await dispatch({
            type: 'channel/update',
            payload: {
                _id: params.id,
                textures: map(selectedTextures, c => c._id)
            },
        });
        
        setVisibleTexturesModal(false)
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

    const handleUpdateCapsules = async (selectedCapsules) => {
        await dispatch({
            type: 'channel/updateCapsules',
            payload: {
                _id: params.id,
                capsules: map(selectedCapsules, c => c._id)
            },
        });

        setVisibleCapsulesSelectModal(false)
    };

    console.log("populatedCapsules", populatedCapsules)
    return (
        <PageHeaderWrapper >
            <Card
                title={intl("客户")}
                extra={
                    <Button type="primary" onClick={showModal}>
                        {intl("分配")}
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
                title={intl("胶囊")}
                extra={
                    <Button type="primary" onClick={showCapsulesSelectModal}>
                        {intl("分配")}
                    </Button>
                }
                style={{ marginBottom: '20px' }}
            >
                <div className={styles['grid-box']}>
                    {map(populatedCapsules, c => (<CapsuleItem item={c} />))}
                </div>
                
                <CapsulesSelectModal
                    modalProps={{
                        visible: visibleCapsulesSelectModal,
                        onCancel: () => setVisibleCapsulesSelectModal(false),
                        confirmLoading: updateChannelLoading
                    }}
                    onCapsulesSelectModalOk={handleUpdateCapsules}
                    initSelectedCapsules={populatedCapsules}
                />
            </Card>
            <Card
                title={intl("款式")}
                extra={
                    <Button type="primary" onClick={showStylesSelectorModal}>
                        {intl("分配")}
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
                title={intl("颜色")}
                extra={
                    <Button type="primary" onClick={showPlainColorsModal}>
                        {intl("分配")}
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
                title={intl("花布")}
                extra={
                    <Button type="primary" onClick={showFlowerColorsModal}>
                        {intl("分配")}
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
            <Card
                title={intl("纹理")}
                extra={
                    <Button type="primary" onClick={showTexturesModal}>
                        {intl("分配")}
                    </Button>
                }
                style={{ marginBottom: '20px' }}
            >
                <div className={styles['flex-box']}>
                    {map(populatedTextures, pc => (<FlowerColorItem item={pc} size={40} />))}
                </div>
                <ColorsModal 
                    colorType={2}
                    modalProps={{
                        visible: visibleTexturesModal,
                        onCancel: () => setVisibleTexturesModal(false),
                        confirmLoading: updateChannelLoading
                    }}
                    onColorsModalOk={handleUpdateTextures}
                    initSelectedColors={populatedTextures}
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
