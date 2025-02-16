import React, { useState } from 'react'
import { Tooltip, Upload, Spin } from 'antd'
import { get, map } from 'lodash'
import classnames from 'classnames'
import { connect } from 'dva'
import {
    FileImageOutlined,
    VideoCameraAddOutlined,
    PlusOutlined
} from '@ant-design/icons';

import { filterImageUrl, uploadProps } from '@/utils/utils';
import StylesSelectorModal from '@/components/StylesSelectorModal'
import styles from './index.less'

const AddCard = ({ addCapsuleItem }) => {
    const [uploading, setUploading] = useState(false)
    const [visibleStylesSelectorModal, setVisibleStylesSelectorModal] = useState(false);
    const handleAddCapsuleItemStyles = (selectedStyles) => {
        console.log('selectedStyles:', selectedStyles)
        addCapsuleItem({
            type: 'style',
            style: get(selectedStyles, 0)
        })
    }
    const handleAddImg = info => {
        if (info.file.status === 'uploading') {
            setUploading(true);
            return;
        }
        if (info.file.status === 'done') {
            console.log('info.file.response.data.url:', get(info, 'file.response.data.url'))
            addCapsuleItem({
                type: 'img',
                fileUrl: get(info, 'file.response.data.url')
            })
            setUploading(false);
        }
    };
    const handleAddVideo = info => {
        if (info.file.status === 'uploading') {
            setUploading(true);
            return;
        }
        if (info.file.status === 'done') {
            console.log('info.file.response.data.url:', get(info, 'file.response.data.url'))
            addCapsuleItem({
                type: 'video',
                fileUrl: get(info, 'file.response.data.url')
            })
            setUploading(false);
        }
    };
    const beforeUpload = file => {
        const limit = file.size / 1024 < 200;
        if (!limit) {
            message.error('Image must smaller than 200K!');
        }
        return limit;
    };
    return (
        <>
            <div className={styles['capsule-item-wrapper']}>
                <Spin spinning={uploading}>
                <div className={styles['aspect-ratio-box']}>
                    
                        <div className={classnames(styles['capsule-item'], styles['add-card'],)}>
                            <PlusOutlined onClick={() => {setVisibleStylesSelectorModal(true)}}/>
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
                    onCancel: () => setVisibleStylesSelectorModal(false),
                    // confirmLoading: updateChannelLoading
                }}
                onStylesSelectorModalOk={handleAddCapsuleItemStyles}
                // initSelectedStyles={populatedStyles}
            />
        </>

    )
}

const CapsuleItemStyles = () => {
    return (
        <div className={styles['capsule-item-wrapper']}>
            <div className={styles['aspect-ratio-box']}>
                <div className={styles['capsule-item']}>

                </div>
            </div>
        </div>
    )
}

const CapsuleItemFile = ({ type, fileUrl}) => {
    return (
        <div className={styles['capsule-item-wrapper']}>
            <div className={styles['aspect-ratio-box']}>
                <div className={styles['capsule-item']}>
                    {type === 'img' && <img src={filterImageUrl(fileUrl)}/>}
                    {type === 'video' && <video src={filterImageUrl(fileUrl)}/>}
                </div>
            </div>
        </div>
    )
}

const CapsuleItem = ({type, ...props}) => {
    return type === 'style' ? <CapsuleItemStyles {...props}/> : <CapsuleItemFile type={type} {...props} />
}


const CapsuleItemsDisplayer = ({ capsuleItems, dispatch }) => {
    const addCapsuleItem = item => {
        dispatch({
            type: 'diy/addCapsuleItem',
            payload: item,
        });
    };
    return (<div className={styles['capsule-items-displayer']}>
        {map(capsuleItems, (item, i) => <CapsuleItem key={`capsule-item${i}`} {...item}/>)}
        <AddCard addCapsuleItem={addCapsuleItem}/>
    </div>)
}

export default connect(({ diy }) => ({
    capsuleItems: diy.capsuleItems,
}))(CapsuleItemsDisplayer);

// export default CapsuleItemsDisplayer
