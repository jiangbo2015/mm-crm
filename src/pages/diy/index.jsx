import React, { useState, useEffect } from 'react';
import { Card, Button, Modal, Input } from 'antd';
import { history } from 'umi';
import { connect } from 'dva';
import { get } from 'lodash';
import Icon, { LeftOutlined } from '@ant-design/icons';
import AvatarDropdown from '@/components/GlobalHeader/AvatarDropdown';
import PlainColorsAside from './components/PlainColorsAside'
import styles from './index.less'

const Com = props => {
    const { _id, name, state, dispatch } = props;

    useEffect(() => {
        // 
    }, []);

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
                <div>页面排列</div> 
                <div className={styles['header-right']}>
                    <div className={styles['diy-actions']}>
                        <Button type="primary">保存</Button>
                    </div>
                    <AvatarDropdown isHideName/>
                </div>   
            </div>
            <div className={styles['diy-page-content']}>
                <PlainColorsAside/>
            </div>
        </div>

    );
};

export default connect(state => ({
    ...state.diy
}))(Com);
