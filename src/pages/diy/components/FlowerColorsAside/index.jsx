import { Tabs } from 'antd';
import React, { useState } from 'react';
import { connect } from 'dva';
import { map } from 'lodash';

import ColorsModal from '@/components/ColorsModal'
import ColorList from '../ColorList'
import ImageCropperModal from '../ImageCropperModal'
import styles from './index.less'
import {intl} from '@/utils/utils'


const onChange = (key) => {
  console.log(key);
};



const FlowerColorsAside = ({ flowerColors, customFlowerColors,dispatch }) => {
    const [visibleFlowerColorsModal, setVisibleFlowerColorsModal] = useState(false);
    const [visibleImageCropperModal, setVisibleImageCropperModal] = useState(false);
    const [imageCropperEditData, setImageCropperEditData] = useState(null)
    const handleUpdateFlowerColors  = async (selectedFlowerColors) => {
        console.log(selectedFlowerColors)
            await dispatch({
                type: 'diy/setFlowerColors',
                payload: selectedFlowerColors,
            });
            
            setVisibleFlowerColorsModal(false)
        };
    const handleEditImageCropper = (item) => {
        setVisibleImageCropperModal(true)
            setImageCropperEditData(item)
        }
    const FlowerColorsItems = [ 
        { 
            label: intl("印花选择"),
            key: 1,
            children: <ColorList colorType={1} colors={flowerColors} onAdd={() => {setVisibleFlowerColorsModal(true)}}/>,
        },
        { 
            label: intl("自主上传"),
            key: 2,
            children: <ColorList hideSearch colorType={1} colors={customFlowerColors} onAdd={() => {setVisibleImageCropperModal(true)}} onClickItem={handleEditImageCropper}/>,
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
                    onCancel: () => {
                        setVisibleImageCropperModal(false)
                        setImageCropperEditData(null)
                    },
                    // confirmLoading: updateChannelLoading
                }}
                editData={imageCropperEditData}
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