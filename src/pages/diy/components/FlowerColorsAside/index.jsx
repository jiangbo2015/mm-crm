import { Tabs } from 'antd';
import React, { useState } from 'react';
import { connect } from 'dva';
import { map } from 'lodash';

import ColorsModal from '@/components/ColorsModal'
import ColorList from '../ColorList'
import ImageCropperModal from '../ImageCropperModal'
import styles from './index.less'


const onChange = (key) => {
  console.log(key);
};



const FlowerColorsAside = ({ flowerColors, customFlowerColors,dispatch }) => {
    const [visibleFlowerColorsModal, setVisibleFlowerColorsModal] = useState(false);
    const [visibleImageCropperModal, setVisibleImageCropperModal] = useState(false);
    const handleUpdateFlowerColors  = async (selectedFlowerColors) => {
        console.log(selectedFlowerColors)
            await dispatch({
                type: 'diy/setFlowerColors',
                payload: selectedFlowerColors,
            });
            
            setVisibleFlowerColorsModal(false)
        };
    
    const FlowerColorsItems = [ 
        { 
            label: "印花选择",
            key: 1,
            children: <ColorList colorType={1} colors={flowerColors} onAdd={() => {setVisibleFlowerColorsModal(true)}}/>,
        },
        { 
            label: "自主上传",
            key: 2,
            children: <ColorList hideSearch colorType={1} colors={customFlowerColors} onAdd={() => {setVisibleImageCropperModal(true)}}/>,
        },
    ]
    return (
        <>
            <ColorsModal 
                colorType={1}
                modalProps={{
                    visible: visibleFlowerColorsModal,
                    onCancel: () => setVisibleFlowerColorsModal(false),
                    // confirmLoading: updateChannelLoading
                }}
                onColorsModalOk={handleUpdateFlowerColors}
                initSelectedColors={flowerColors}
            />
            <ImageCropperModal
                modalProps={{
                    visible: visibleImageCropperModal,
                    onCancel: () => setVisibleImageCropperModal(false),
                    // confirmLoading: updateChannelLoading
                }}
            />
            <Tabs
                onChange={onChange}
                type="card"
                items={FlowerColorsItems}
                className={styles['color-list-tabs-box']}
            /> 
        </>
        )
};

// export default FlowerColorsAside;

export default connect(({ diy }) => ({
    flowerColors: diy.flowerColors,
    customFlowerColors: diy.customFlowerColors,
}))(FlowerColorsAside);