import { useState, useEffect } from 'react';
import { get, map } from 'lodash';
import { useDispatch, useSelector } from '@/hooks/useDvaTools'

const useDiy = () => {
  const dispatch = useDispatch()
  const capsuleItems = useSelector(state => state?.diy?.capsuleItems)
  const plainColors = useSelector(state => state?.diy?.plainColors)
  const flowerColors = useSelector(state => state?.diy?.flowerColors)
  const _id = useSelector(state => state?.diy?._id)
  const name = useSelector(state => state?.diy?.name)
  const currentEditCapsuleItem = useSelector(state => state?.diy?.currentEditCapsuleItem)
  const [uploading, setUploading] = useState(false)
  const [visibleStylesSelectorModal, setVisibleStylesSelectorModal] = useState(false);

    const addCapsuleItem = item => {
        dispatch({
            type: 'diy/addCapsuleItem',
            payload: item,
        });
    };
    const handleSave = (inputName) => {
        const data = {
            name: inputName ?? name,
            capsuleItems: map(capsuleItems, ci => {
                if(ci?.type === 'style') {
                    return {
                        ...ci,
                        style: ci?.style?._id,
                        finishedStyleColorsList: map(ci?.finishedStyleColorsList, sc => ({
                            colors: map(sc?.colors, c => c?._id),
                            textrue: sc?.textrue?._id,
                            imgUrlFront: sc?.imgUrlFront,
                            imgUrlBack: sc?.imgUrlBack,
                        }))
                    }
                }
                return ci
            }),
            plainColors: map(plainColors, pc => pc._id),
            flowerColors: map(flowerColors, fc => fc._id),
        }
        console.log("data->", data)
        if(_id) {
            // update
            data._id = _id
            dispatch({
                type: 'diy/updateCapsule',
                payload: data,
            });
        } else {
            // create
            dispatch({
                type: 'diy/createCapsule',
                payload: data,
            });
        }
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

    const handleUpdateCapsuleItem = (index, finishedIndex) => {
        dispatch({
            type: 'diy/setCurrentEditCapsuleItemIndex',
            payload: index
        })

        // currentEditCapsuleItemFinishedIndex
        dispatch({
            type: 'diy/setCurrentEditCapsuleItemFinishedIndex',
            payload: finishedIndex
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
    handleSave,
    currentEditCapsuleItem
 };
};

export default useDiy;