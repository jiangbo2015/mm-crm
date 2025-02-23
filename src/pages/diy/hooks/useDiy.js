import { useState, useEffect } from 'react';
import { get } from 'lodash';
import { useDispatch, useSelector } from '@/hooks/useDvaTools'

const useDiy = () => {
  const dispatch = useDispatch()
  const capsuleItems = useSelector(state => state?.diy?.capsuleItems)
  const currentEditCapsuleItem = useSelector(state => state?.diy?.currentEditCapsuleItem)
  const [uploading, setUploading] = useState(false)
  const [visibleStylesSelectorModal, setVisibleStylesSelectorModal] = useState(false);

    const addCapsuleItem = item => {
        dispatch({
            type: 'diy/addCapsuleItem',
            payload: item,
        });
    };
    const updateCapsuleItemByIndex = (newItem, index) => {
        const newCapsuleItems = [...capsuleItems]
        newCapsuleItems[index] = newItem
        dispatch({
            type: 'diy/setCapsuleItems',
            payload: newCapsuleItems,
        });
    };
    const hideVisibleStylesSelectorModal = () => {
        setVisibleStylesSelectorModal(false)
    };
    const openVisibleStylesSelectorModal = () => {
        setVisibleStylesSelectorModal(true)
    };
    const handleAddCapsuleItemStyles = (selectedStyles) => {
        // console.log('selectedStyles:', selectedStyles)
        addCapsuleItem({
            type: 'style',
            style: get(selectedStyles, 0)
        })
        setVisibleStylesSelectorModal(false)
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
            // console.log('info.file.response.data.url:', get(info, 'file.response.data.url'))
            addCapsuleItem({
                type: 'video',
                fileUrl: get(info, 'file.response.data.url')
            })
            setUploading(false);
        }
    };

    const handleUpdateCapsuleItem = (item, index) => {
        console.log('handleUpdateCapsuleItem:', index)
        dispatch({
            type: 'diy/setCurrentEditCapsuleItemIndex',
            payload: index
        })
    }
    const handleUpdateImg = (info, index) => {
        if (info.file.status === 'uploading') {
            setUploading(true);
            return;
        }
        if (info.file.status === 'done') {
            // console.log('info.file.response.data.url:', get(info, 'file.response.data.url'))
            updateCapsuleItem({
                type: 'img',
                fileUrl: get(info, 'file.response.data.url')
            }, index)
            setUploading(false);
        }
    };
    const handleUpdateVideo = (info, index) => {
        if (info.file.status === 'uploading') {
            setUploading(true);
            return;
        }
        if (info.file.status === 'done') {
            console.log('info.file.response.data.url:', get(info, 'file.response.data.url'))
            updateCapsuleItem({
                type: 'video',
                fileUrl: get(info, 'file.response.data.url')
            }, index)
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

  return {
    uploading,
    visibleStylesSelectorModal,
    addCapsuleItem,
    beforeUpload,
    handleAddCapsuleItemStyles,
    handleAddImg,
    handleAddVideo,
    hideVisibleStylesSelectorModal,
    openVisibleStylesSelectorModal,
    handleUpdateImg,
    handleUpdateVideo,
    handleUpdateCapsuleItem,
    currentEditCapsuleItem
 };
};

export default useDiy;