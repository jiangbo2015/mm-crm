import React, { useState, useEffect } from 'react';
import { Tag, Button, Modal, Input } from 'antd';
import { history, useParams } from 'umi';
import { connect } from 'dva';
import { get } from 'lodash';
import Icon, { LeftOutlined } from '@ant-design/icons';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

import logoSvg from '@/assets/logo.svg'
import useArrangement from '@/hooks/useArrangement'
import { useLeavePageConfirm } from '@/hooks/useLeavePageConfirm';
import useDiy from './hooks/useDiy'
import AvatarDropdown from '@/components/GlobalHeader/AvatarDropdown';
import PlainColorsAside from './components/PlainColorsAside'
import FlowerColorsAside from './components/FlowerColorsAside'
import CapsuleItemsDisplayer from './components/CapsuleItemsDisplayer'
import DiyActions from './components/DiyActions'
import GoodCategoryMenu from './components/GoodCategoryMenu'
import styles from './index.less'


const Com = props => {
    const params = useParams()
    
    const { isEditor, arrangement: cloudArrangement, hasUpdate, handleEdit, handleChangeName } = useDiy()
    const { arrangement, ArrangmentDropdown } = useArrangement('', 20, cloudArrangement)
    const { name, currentUser, dispatch } = props;
    useLeavePageConfirm(isEditor && (hasUpdate || (cloudArrangement && arrangement!==cloudArrangement))
)    
    useEffect(() => {
        if(params.id) {
            dispatch({
                type: 'diy/getCapsuleById',
                payload: {_id: params.id}
            })
        } else {
            handleEdit()
        }
        return () => {
            dispatch({
                type: 'diy/clearCapsule'
            })
        }
    }, [params.id])
    useEffect(() => {
        dispatch({
            type: 'diy/getColorList',
            payload: {
                type: 0,
                isCustom: 1,
                creator: currentUser?._id
            },
        });
        dispatch({
            type: 'diy/getColorList',
            payload: {
                type: 1,
                isCustom: 1,
                creator: currentUser?._id
            },
        });
        dispatch({
            type: 'diy/getColorList',
            payload: {
                type: 2
            },
        });
    }, [currentUser?._id])
    const onChangeName = (e) => {
        handleChangeName(get(e, 'target.value'))
    }

    return (
        <div className={styles['diy-page-wrapper']}>
            <div className={styles['diy-page-header']}>
                <div className={styles['header-left']}>
                    <div className={styles['back-button']} onClick={() => {history.goBack()}}>
                        <LeftOutlined />
                    </div> 
                    <img src={logoSvg} height={60}/>
                </div>
                <div className={styles['header-center']}>
                    <div style={{flex: 1}}>
                        {isEditor &&<Input style={{width: '100%'}} onChange={onChangeName} size='large' placeholder="DIY胶囊名称" bordered={false} value={name}/>}
                        {!isEditor && <div style={{ paddingLeft: '11px', fontSize: 16}}>{name}</div>}
                    </div>
                    {isEditor && ArrangmentDropdown}
                </div> 
                <div className={styles['header-right']} style={{width: isEditor ? '268px' : ''}}>
                    <div className={styles['diy-actions']}>
                        <DiyActions arrangement={arrangement}/>
                    </div>
                    <AvatarDropdown isHideName/>
                </div>
            </div>
            <div className={styles['diy-page-content']}>
                {!isEditor && <GoodCategoryMenu/>}
                {isEditor && <PlainColorsAside/>}
                <CapsuleItemsDisplayer arrangement={arrangement}/>
                {isEditor && <FlowerColorsAside />}
            </div>
        </div>

    );
};

export default connect(state => ({
    ...state.diy,
    currentUser: state?.user?.currentUser
}))(Com);
