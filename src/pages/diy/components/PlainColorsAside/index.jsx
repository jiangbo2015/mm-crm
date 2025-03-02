import { Tabs } from 'antd';
import React, { useState } from 'react';
import { connect } from 'dva';
import { map } from 'lodash';

import ColorsModal from '@/components/ColorsModal'
import ColorList from '../ColorList'
import EyeDropperModal from '../EyeDropperModal'
import styles from './index.less'


const onChange = (key) => {
  console.log(key);
};



const PlainColorsAside = ({ plainColors, customPlainColors,dispatch }) => {
    const [visiblePlainColorsModal, setVisiblePlainColorsModal] = useState(false);
    const [visibleEyeDropper, setVisibleEyeDropper] = useState(false);
    const handleUpdatePlainColors  = async (selectedPlainColors) => {
        console.log(selectedPlainColors)
            await dispatch({
                type: 'diy/setPlainColors',
                payload: selectedPlainColors,
            });
            
            setVisiblePlainColorsModal(false)
        };
    
    const PlainColorsItems = [ 
        { 
            label: "颜色选择",
            key: 1,
            children: <ColorList colors={plainColors} onAdd={() => {setVisiblePlainColorsModal(true)}}/>,
        },
        { 
            label: "自主上传",
            key: 2,
            children: <ColorList hideSearch colors={customPlainColors} onAdd={() => {setVisibleEyeDropper(true)}}/>,
        },
    ]
    return (
        <>
            <EyeDropperModal modalProps={{
                visible: visibleEyeDropper,
                onCancel: () => setVisibleEyeDropper(false),
                // confirmLoading: updateChannelLoading
            }}/>
            <ColorsModal 
                colorType={0}
                modalProps={{
                    visible: visiblePlainColorsModal,
                    onCancel: () => setVisiblePlainColorsModal(false),
                    // confirmLoading: updateChannelLoading
                }}
                onColorsModalOk={handleUpdatePlainColors}
                initSelectedColors={plainColors}
            />
           <Tabs
            onChange={onChange}
            type="card"
            items={PlainColorsItems}
            className={styles['color-list-tabs-box']}
        /> 
        </>
        )
};

// export default PlainColorsAside;

export default connect(({ diy }) => ({
    plainColors: diy.plainColors,
    customPlainColors: diy.customPlainColors,
}))(PlainColorsAside);