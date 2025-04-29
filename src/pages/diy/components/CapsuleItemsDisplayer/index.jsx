import React, { useState } from 'react'
import { Button, Upload, Spin, Modal } from 'antd'
import { get, map, filter, includes } from 'lodash'
import classnames from 'classnames'
import { connect } from 'dva'
import {
    FileImageOutlined,
    VideoCameraAddOutlined,
    PlusOutlined,
    ZoomInOutlined,
    EditOutlined,
    DeleteOutlined,
    DownloadOutlined
} from '@ant-design/icons';

import { filterImageUrl, uploadProps,downloadResourcesAsZip,wait } from '@/utils/utils';
import { ColorItem } from '@/components/ColorItem'
import StylesSelectorModal from '@/components/StylesSelectorModal'
import { DesignStyleEditor } from './components/DesignStyleEditor'
import { EnlargeModal } from './components/EnlargeModal'
import {DropItem, DragDrop} from './components/DragDrop'

import useDiy from '../../hooks/useDiy'
import styles from './index.less'

export const ItemBottomTools = ({item = {}, index, showFinishedStyleIndex = -1}) => {
    const { type } = item
    const { 
        beforeUpload1M, 
        handleUpdateImg,
        handleUpdateVideo,
        handleUpdateCapsuleItem,
        handleEnlargeCapsuleItem,
        handleDeleteCapsuleItem,
        isEditor
    } = useDiy()
    
    return (
        isEditor && <div
            className={classnames(styles['item-tools-box'])}
        >
            {type === 'style' ? 
                <EditOutlined onClick={() => {
                    handleUpdateCapsuleItem(index, showFinishedStyleIndex)
                }} />  : 
                <Upload
                    {...uploadProps}
                    beforeUpload={beforeUpload1M}
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
            <ZoomInOutlined onClick={() => {
                    handleEnlargeCapsuleItem(index, showFinishedStyleIndex)
                }}/>
            <DeleteOutlined onClick={() => { handleDeleteCapsuleItem(index)} }/>
        </div>
    )
}

const AddCard = () => {
    const { 
        uploading,
        visibleStylesSelectorModal,
        hideVisibleStylesSelectorModal,
        openVisibleStylesSelectorModal,
        beforeUpload1M, 
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
                                beforeUpload={beforeUpload1M}
                                onChange={handleAddImg}
                            >
                                <FileImageOutlined />
                            </Upload>
                            <Upload
                                {...uploadProps}
                                beforeUpload={beforeUpload1M}
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

const CapsuleItemStyles = ({ item = {}, index, handleDownload }) => {
    const { 
        handleUpdateCapsuleItem,
        handleEnlargeCapsuleItem,
        isEditor
    } = useDiy()
    const {style, finishedStyleColorsList } = item
    const finishedStyleColorsLength = get(finishedStyleColorsList, 'length', 0) 
    const [showIndex, setShowIndex] = useState(0)
    const [showFrontOrBack, setShowFrontOrBack] = useState('front')
    const showFinishedStyle = get(finishedStyleColorsList, showIndex)
    return (
        <div className={styles['capsule-item-wrapper']}>
            <div className={styles['aspect-ratio-box']} onClick={() => handleEnlargeCapsuleItem(index, showIndex)}>
                <Button 
                    onClick={(e) => {
                        e.stopPropagation()
                        handleDownload()
                    }}
                    size='small'
                    className={styles['download-icon']} shape="circle" icon={<DownloadOutlined />} />
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
                {isEditor && <PlusOutlined onClick={() => {
                    handleUpdateCapsuleItem(index, -1)
                }}/>}
                
            </div>}
        </div>
    )
}

const CapsuleItemFile = ({ item,index,handleDownload }) => {
    const { type, fileUrl } = item
    const { 
        handleEnlargeCapsuleItem,    
    } = useDiy()
    return (
        <div className={styles['capsule-item-wrapper']}>
            <div className={styles['aspect-ratio-box']} onClick={() => handleEnlargeCapsuleItem(index, -1)}>
                <Button 
                    onClick={(e) => {
                        e.stopPropagation()
                        handleDownload()
                    }}
                    size='small'
                    className={styles['download-icon']} shape="circle" icon={<DownloadOutlined />} />
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

    const handleDownload = async () => {
        const downloadingModal = Modal.info({
            title: '下载中，请稍等片刻...',
            closable: false,
            okButtonProps: {
                loading: true
            }
        });
       await downloadResourcesAsZip([item], item?._id)
       downloadingModal.update({
            title: '下载完成',
            closable: false
       })
       await wait(2000)
       downloadingModal.destroy()
    };

    return type === 'style' ? <CapsuleItemStyles item={item} index={index} handleDownload={handleDownload} /> : <CapsuleItemFile item={item} index={index} handleDownload={handleDownload} />
}
const CapsuleDropContainer = () => {
  const [items, setItems] = useState([
    { id: 1, text: '项目 1' },
    { id: 2, text: '项目 2' },
    { id: 3, text: '项目 3' },
    { id: 4, text: '项目 4' },
    { id: 5, text: '项目 5' },
    { id: 6, text: '项目 6' },
  ]);

  const moveItem = (dragIndex, hoverIndex) => {
    const dragItem = items[dragIndex];
    const newItems = [...items];
    newItems.splice(dragIndex, 1);
    newItems.splice(hoverIndex, 0, dragItem);
    setItems(newItems.map((item, index) => ({ ...item, index }))); // 更新索引
  };

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: '16px',
        padding: '16px',
      }}
    >
      {items.map((item, index) => (
        <DragItem
          key={item.id}
          id={item.id}
          text={item.text}
          index={index}
          moveItem={moveItem}
        />
      ))}
    </div>
  );
}

const CapsuleItemsDisplayer = ({arrangement = '5'}) => {
    const { 
        isEditor,
        capsuleItems, currentEditCapsuleItemIndex, 
        currentEnlargeCapsuleItemIndex, currentEnlargeCapsuleItemFinishedIndex,
        setCapsuleItems
    } = useDiy()
    const currentEditCapsuleItem = get(capsuleItems, currentEditCapsuleItemIndex)
    const currentEnlargeCapsuleItem = get(capsuleItems, currentEnlargeCapsuleItemIndex)

    const moveItem = (dragIndex, hoverIndex) => {
        const dragItem = capsuleItems[dragIndex];
        const newItems = [...capsuleItems];
        newItems.splice(dragIndex, 1);
        newItems.splice(hoverIndex, 0, dragItem);
        // setItems(newItems.map((item, index) => ({ ...item, index }))); // 更新索引

        setCapsuleItems(newItems);
      };
    return (
        <div className={classnames(styles['capsule-items-displayer'], styles[`grid-${arrangement}`])} >
           {isEditor &&  <DragDrop>
                {map(capsuleItems, (item, i) =>
                        <DropItem  key={`capsule-item-${item?._id}`}
                            id={item?._id}
                            index={i}
                            moveItem={moveItem}
                        >
                          <CapsuleItem index={i} item={item} />
                        </DropItem>
                )}
            </DragDrop>}
            {!isEditor && map(capsuleItems, (item, i) => <CapsuleItem index={i} item={item} />)}
            {isEditor && <AddCard />}
            {currentEditCapsuleItem && <DesignStyleEditor />}
            {currentEnlargeCapsuleItem && <EnlargeModal capsuleItem={currentEnlargeCapsuleItem} finishedIndex={currentEnlargeCapsuleItemFinishedIndex} />}
            
        </div>
    );
}

export default CapsuleItemsDisplayer

// export default CapsuleItemsDisplayer
