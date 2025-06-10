import { Tabs } from 'antd';
import React, { useState, useEffect} from 'react';
import { connect } from 'dva';
import { map } from 'lodash';

import ColorsModal from '@/components/ColorsModal'
import { intl } from '@/utils/utils'
import ColorList from '../ColorList'
import EyeDropperModal from '../EyeDropperModal'
import styles from './index.less'


const onChange = (key) => {
  console.log(key);
};



const PlainColorsAside = ({ plainColors, customPlainColors, dispatch }) => {
    const [visiblePlainColorsModal, setVisiblePlainColorsModal] = useState(false);
    const [visibleCustomPlainColorsModal, setVisibleCustomPlainColorsModal] = useState(false);
    const [visibleEyeDropper, setVisibleEyeDropper] = useState(false);
    const [eyeDropperEditData, setEyeDropperEditData] = useState(null);
    const handleUpdatePlainColors  = async (selectedPlainColors) => {
        console.log(selectedPlainColors)
            await dispatch({
                type: 'diy/setPlainColors',
                payload: selectedPlainColors,
            });
            
            setVisiblePlainColorsModal(false)
        };
    const handleUpdateCustomPlainColors  = async (selectedPlainColors) => {
        console.log(selectedPlainColors)
            await dispatch({
                type: 'diy/setCustomPlainColors',
                payload: selectedPlainColors,
            });
            
            setVisibleCustomPlainColorsModal(false)
        };
    const handleEditEyeDropper = (item) => {
        setVisibleEyeDropper(true)
        setEyeDropperEditData(item)
    }
    
    
    const PlainColorsItems = [ 
        { 
            label: intl("颜色选择"),
            key: 1,
            children: <ColorList colors={plainColors} onAdd={() => {setVisiblePlainColorsModal(true)}}/>,
        },
        { 
            label: intl("自主上传"),
            key: 2,
            children: <ColorList 
                showTip='name'
                hideSearch 
                colors={customPlainColors} 
                // onAdd={() => {setVisibleEyeDropper(true)}}
                onAdd={() => {setVisibleCustomPlainColorsModal(true)}}
                onClickItem={handleEditEyeDropper}
            />,
        },
    ]
    return (
        <>
            {visibleEyeDropper && <EyeDropperModal 
                modalProps={{
                    visible: visibleEyeDropper,
                    onCancel: () => {
                        setVisibleEyeDropper(false)
                        setEyeDropperEditData(null)
                    },
                    // confirmLoading: updateChannelLoading
                }}
                editData={eyeDropperEditData}
            />}
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
            <ColorsModal 
                colorType={0}
                isCustom
                modalProps={{
                    visible: visibleCustomPlainColorsModal,
                    onCancel: () => setVisibleCustomPlainColorsModal(false),
                    // confirmLoading: updateChannelLoading
                }}
                onColorsModalOk={handleUpdateCustomPlainColors}
                initSelectedColors={customPlainColors}
                onAdd={() => {setVisibleEyeDropper(true)}}
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

export default connect(({ diy, user }) => ({
    plainColors: diy.plainColors,
    customPlainColors: diy.customPlainColors,
}))(PlainColorsAside);