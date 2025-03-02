import React, { useState } from 'react'
import { Tooltip, Upload, Spin } from 'antd'
import { get, map } from 'lodash'
import classnames from 'classnames'
import { connect } from 'dva'
import {
    FileImageOutlined,
    VideoCameraAddOutlined,
    PlusOutlined,
    ZoomInOutlined,
    EditOutlined,
    DeleteOutlined
} from '@ant-design/icons';

import { filterImageUrl, uploadProps } from '@/utils/utils';
import { ColorItem } from '@/components/ColorItem'
import StylesSelectorModal from '@/components/StylesSelectorModal'
import { DesignStyleEditor } from './components/DesignStyleEditor'
import useDiy from '../../hooks/useDiy'
import styles from './index.less'

export const ItemBottomTools = ({item = {}, index, showFinishedStyleIndex = -1}) => {
    const { type } = item
    const { 
        beforeUpload, 
        handleUpdateImg,
        handleUpdateVideo,
        handleUpdateCapsuleItem
    } = useDiy()
    return (
        <div
            className={classnames(styles['item-tools-box'])}
        >
            {type === 'style' ? 
                <EditOutlined onClick={() => {
                    handleUpdateCapsuleItem(index, showFinishedStyleIndex)
                }} />  : 
                <Upload
                    {...uploadProps}
                    beforeUpload={beforeUpload}
                    onChange={(info) => {
                        if(type === 'edit') {
                            handleUpdateImg(info, index)
                        } else {
                            handleUpdateVideo(info, index)
                        }
                    }}
                >
                    <EditOutlined />
                </Upload>}
            <ZoomInOutlined/>
            <DeleteOutlined/>
        </div>
    )
}

const AddCard = () => {
    const { 
        uploading,
        visibleStylesSelectorModal,
        hideVisibleStylesSelectorModal,
        openVisibleStylesSelectorModal,
        beforeUpload, 
        handleAddCapsuleItemStyles,
        handleAddImg,
        handleAddVideo 
    } = useDiy()

    return (
        <>
            <div className={styles['capsule-item-wrapper']}>
                <Spin spinning={uploading}>
                <div className={styles['aspect-ratio-box']}> 
                        <div className={classnames(styles['capsule-item'], styles['add-card'],)}>
                            <PlusOutlined onClick={openVisibleStylesSelectorModal}/>
                            <Upload
                                {...uploadProps}
                                beforeUpload={beforeUpload}
                                onChange={handleAddImg}
                            >
                                <FileImageOutlined />
                            </Upload>
                            <Upload
                                {...uploadProps}
                                beforeUpload={beforeUpload}
                                onChange={handleAddVideo}
                            >
                                <VideoCameraAddOutlined />
                            </Upload>
                        </div>
                    
                </div>
                </Spin>
            </div>
            <StylesSelectorModal
                mode='single'
                modalProps={{
                    visible: visibleStylesSelectorModal,
                    onCancel: hideVisibleStylesSelectorModal,
                    // confirmLoading: updateChannelLoading
                }}
                onStylesSelectorModalOk={handleAddCapsuleItemStyles}
                // initSelectedStyles={populatedStyles}
            />
        </>

    )
}

const CapsuleItemStyles = ({ item = {}, index }) => {
    const { 
        handleUpdateCapsuleItem
    } = useDiy()
    const {style, finishedStyleColorsList } = item
    const finishedStyleColorsLength = get(finishedStyleColorsList, 'length', 0) 
    const [showIndex, setShowIndex] = useState(0)
    const [showFrontOrBack, setShowFrontOrBack] = useState('front')
    const showFinishedStyle = get(finishedStyleColorsList, showIndex)
    return (
        <div className={styles['capsule-item-wrapper']}>
            <div className={styles['aspect-ratio-box']}>
                <div className={classnames(styles['capsule-item'], styles['style-card'])}>
                    {finishedStyleColorsLength === 0 && <img className={styles['style-img']} src={filterImageUrl(style?.imgUrl)}/>}
                    {/* {map(finishedStyleColorsList, f => )} */}
                    {showFinishedStyle && 
                        <img 
                            className={styles['style-img']} 
                            src={filterImageUrl(showFrontOrBack === 'front' ? showFinishedStyle?.imgUrlFront : showFinishedStyle?.imgUrlBack)}
                            onMouseEnter={() => setShowFrontOrBack('back')}
                            onMouseLeave={() => setShowFrontOrBack('front')}
                        />
                    }
                </div>
            </div>
            <ItemBottomTools item={item} index={index} showFinishedStyleIndex={showIndex}/>
            {finishedStyleColorsLength > 0 && <div className={styles["thumbnail-list"]}>
                {map(finishedStyleColorsList, ({colors}, index) => (
                    <div
                        key={index}
                        className={showIndex===index ? styles['thumbnail-item-selected'] : styles["thumbnail-item"] } 
                        onMouseEnter={() => setShowIndex(index)} // 鼠标悬停时更新大图
                    >
                        <ColorItem item={get(colors, 0, {})} size={12} borderWidth={0}/>
                    </div>
                ))}
                <PlusOutlined onClick={() => {
                    handleUpdateCapsuleItem(index, -1)
                }}/>
            </div>}
        </div>
    )
}

const CapsuleItemFile = ({ item,index }) => {
    const { type, fileUrl } = item
    return (
        <div className={styles['capsule-item-wrapper']}>
            <div className={styles['aspect-ratio-box']}>
                <div className={styles['capsule-item']}>
                    {type === 'img' && <img className={styles['upload-picture']} src={filterImageUrl(fileUrl)}/>}
                    {type === 'video' && <video className={styles['upload-picture']} src={filterImageUrl(fileUrl)}/>}
                </div>
            </div>
            <ItemBottomTools item={item} index={index}/>
        </div>
    )
}

const CapsuleItem = (props) => {
    const {item, index} = props
    const type = get(props, 'item.type')

    return type === 'style' ? <CapsuleItemStyles item={item} index={index} /> : <CapsuleItemFile item={item} index={index} />
}

const CapsuleItemsDisplayer = ({ capsuleItems, currentEditCapsuleItemIndex }) => {
    const currentEditCapsuleItem = get(capsuleItems, currentEditCapsuleItemIndex)
    return (
        <div className={styles['capsule-items-displayer']}>
            {map(capsuleItems, (item, i) => <CapsuleItem key={`capsule-item${i}`} index={i} item={item} />)}
            <AddCard />
            {currentEditCapsuleItem && <DesignStyleEditor />}
        </div>
    );
}

export default connect(({ diy }) => ({
    capsuleItems: diy.capsuleItems,
    currentEditCapsuleItemIndex: diy.currentEditCapsuleItemIndex
}))(CapsuleItemsDisplayer);

// export default CapsuleItemsDisplayer
