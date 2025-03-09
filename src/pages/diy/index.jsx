import React, { useState, useEffect } from 'react';
import { Card, Button, Modal, Input } from 'antd';
import { history, useParams } from 'umi';
// import { useParams } from 'umi';
import { connect } from 'dva';
import { get } from 'lodash';
import Icon, { LeftOutlined } from '@ant-design/icons';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

import useArrangement from '@/hooks/useArrangement'
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
    const { isEditor, handleEdit } = useDiy()
    const { arrangement, ArrangmentDropdown } = useArrangement('页面排列')
    const { _id, name, currentUser, dispatch } = props;

    useEffect(() => {
      // "67bdd6b21f963b389f6b85b4"
    }, [])
    useEffect(() => {
        if(params.id) {
            dispatch({
                type: 'diy/getCapsuleById',
                payload: {_id: params.id}
            })
        } else {
            handleEdit()
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
    }, [currentUser?._id])
    const handleChangeName = (e) => {
        dispatch({
            type: 'diy/setCapsuleName',
            payload: get(e, 'target.value')
        })
    }

    return (
        <div className={styles['diy-page-wrapper']}>
            <div className={styles['diy-page-header']}>
                <div className={styles['header-left']}>
                    <div className={styles['back-button']} onClick={() => {history.goBack()}}>
                        <LeftOutlined />
                    </div> 
                    <div>
                        <Input onChange={handleChangeName} size='large' placeholder="DIY胶囊名称" bordered={false} value={name}/>
                    </div>
                </div>
                <div>{ArrangmentDropdown}</div> 
                <div className={styles['header-right']}>
                    <div className={styles['diy-actions']}>
                        <DiyActions />
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
