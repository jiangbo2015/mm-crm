import { useState, useEffect } from 'react';
import { message } from 'antd'
import { get, map, filter, includes,splice } from 'lodash';
import { useDispatch, useSelector } from '@/hooks/useDvaTools'
import { history } from 'umi';

function filterCapsuleItemsById(capsuleItems, id) {
    // 过滤 capsuleItems，返回符合条件的 capsuleItems
    const filteredCapsuleItems = filter(capsuleItems, item => {
        if (item.type === "style" && item.style) {
            // 检查 goodsId 或 categoryId 是否包含传入的 id
            const hasGoodsId = includes(item.style.goodsId, id);
            const hasCategoryId = includes(item.style.categoryId, id);
            return hasGoodsId || hasCategoryId;
        }
        return false;
    });

    return filteredCapsuleItems;
}

const useDiy = () => {
    const dispatch = useDispatch()
    const capsuleItems = useSelector(state => state?.diy?.capsuleItems)
    const plainColors = useSelector(state => state?.diy?.plainColors)
    const flowerColors = useSelector(state => state?.diy?.flowerColors)
    const customPlainColors = useSelector(state => state?.diy?.customPlainColors)
    const customFlowerColors = useSelector(state => state?.diy?.customFlowerColors)
    
    const mode = useSelector(state => state?.diy?.mode)
    const arrangement = useSelector(state => state?.diy?.arrangement)
    const hasUpdate = useSelector(state => state?.diy?.hasUpdate)
    
    const selectedGoodId = useSelector(state => state?.diy?.selectedGoodId)
    const selectedGoodCategryId = useSelector(state => state?.diy?.selectedGoodCategryId)
    const _id = useSelector(state => state?.diy?._id)
    const name = useSelector(state => state?.diy?.name)
    const status = useSelector(state => state?.diy?.status)
    const currentEditCapsuleItemIndex = useSelector(state => state?.diy?.currentEditCapsuleItemIndex) 
    const currentEnlargeCapsuleItemIndex = useSelector(state => state?.diy?.currentEnlargeCapsuleItemIndex) 
    const currentEnlargeCapsuleItemFinishedIndex = useSelector(state => state?.diy?.currentEnlargeCapsuleItemFinishedIndex) 
    const currentEditCapsuleItem = useSelector(state => state?.diy?.currentEditCapsuleItem)
    const [uploading, setUploading] = useState(false)
    const [visibleStylesSelectorModal, setVisibleStylesSelectorModal] = useState(false);
  
    const goods = useSelector(state => get(state, 'goods.list', []))

    const isEditor = mode === 'editor'
    const filterCapsuleItems = filterCapsuleItemsById(capsuleItems, selectedGoodCategryId ?? selectedGoodId)

    const getAllGoods = async () => {
        dispatch({
            type: 'goods/getList',
        });
    }
    const createCustomColor = async item => {
        return dispatch({
            type: 'diy/createCustomColor',
            payload: item,
        });
    };
    const updateCustomColor = async item => {
        return dispatch({
            type: 'diy/updateCustomColor',
            payload: item,
        });
    };
    const delCustomColor = async item => {
        return dispatch({
            type: 'diy/delCustomColor',
            payload: {
                _id: item._id,
                type: item.type,
            },
        });
    }
    const addCapsuleItem = item => {
        dispatch({
            type: 'diy/addCapsuleItem',
            payload: item,
        });
    };
    const handleSave = async (inputName, arrangement) => {
        const data = {
            arrangement,
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
            customFlowerColors: map(customFlowerColors, fc => fc._id),
            customPlainColors: map(customPlainColors, pc => pc._id),
        }
        console.log("data->", data)
        if(_id) {
            // update
            data._id = _id
            await dispatch({
                type: 'diy/updateCapsule',
                payload: data,
            });
        } else {
            // create
            await dispatch({
                type: 'diy/createCapsule',
                payload: data,
            });
        }
    };
    const handleSaveAs = async (inputName, arrangement) => {
        const data = {
            name: inputName ?? name,
            arrangement,
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
        return await dispatch({
            type: 'diy/createCapsule',
            payload: data,
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
    const setCapsuleItems = (newCapsuleItems) => {
        dispatch({
            type: 'diy/setCapsuleItems',
            payload: newCapsuleItems,
        });

    }
    const handleDeleteCapsuleItem = (index) => {
        // console.log('selectedStyles:', selectedStyles)
        capsuleItems.splice(index, 1)
        dispatch({
            type: 'diy/setCapsuleItems',
            payload: [...capsuleItems],
        });

    }

    const handleDeleteCapsuleItemFinished = (index, finishedIndex) => {
        // console.log('handleDeleteCapsuleItemFinished:1', capsuleItems[index]?.finishedStyleColorsList?.length , finishedIndex)
        // // splice()
        
        // if(capsuleItems[index]?.finishedStyleColorsList?.length === finishedIndex + 1) {
        //     dispatch({
        //         type: 'diy/setCurrentEditCapsuleItemFinishedIndex',
        //         payload: finishedIndex - 1
        //     })
        // }
        capsuleItems[index]?.finishedStyleColorsList?.splice(finishedIndex, 1)
        dispatch({
            type: 'diy/setCapsuleItems',
            payload: [...capsuleItems],
        });

    }
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

    const handleEnlargeCapsuleItem = (index, finishedIndex) => {
        dispatch({
            type: 'diy/setCurrentEnlargeCapsuleItemIndex',
            payload: index
        })

        dispatch({
            type: 'diy/setCurrentEnlargeCapsuleItemFinishedIndex',
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
        console.log('file.size', file.size)
        if (!limit) {
            message.error('Image must smaller than 200K!');
        }
        return limit;
    };
    const beforeUpload1M = file => {
        const limit = file.size / 1024 <= 1024;
        console.log('file.size', file.size)
        if (!limit) {
            message.error('Image must smaller than 1M!');
        }
        return limit;
    };

    const handleSelectGoodId = (id) => {
        dispatch({
            type: 'diy/setSelectedGoodId',
            payload: id,
        });
    }

    const handleSelectGoodCategryId = (id) => {
        dispatch({
            type: 'diy/setSelectedGoodCategryId',
            payload: id,
        });
    }

    const handleEdit = () => {
        dispatch({
            type: 'diy/setMode',
            payload: 'editor'
        })
    };

    const handleView = () => {
        dispatch({
            type: 'diy/setMode',
            payload: 'detail'
        })
        // history.push(`/diy/${_id}`)
    };
    const handleGoEditOther = (other) => {
        history.push(`/diy/${other}`)
        dispatch({
            type: 'diy/setMode',
            payload: 'editor'
        })
        
    };
    const handleChangeName = (name) => {
        console.log('handleChangeName', name)
        dispatch({
            type: 'diy/setCapsuleName',
            payload: name
        })
    }


    return {
        arrangement,
        hasUpdate,
        name,
        status,
        uploading,
        visibleStylesSelectorModal,
        setCapsuleItems,
        addCapsuleItem,
        beforeUpload,
        beforeUpload1M,
        handleAddCapsuleItemStyles,
        handleAddImg,
        handleAddVideo,
        hideVisibleStylesSelectorModal,
        openVisibleStylesSelectorModal,
        handleUpdateImg,
        handleUpdateVideo,
        handleUpdateCapsuleItem,
        handleSave,
        currentEditCapsuleItem,
        createCustomColor,

        handleEnlargeCapsuleItem,
        handleDeleteCapsuleItem,
        isEditor,
        handleEdit,
        handleView,
        handleSelectGoodId,
        handleSelectGoodCategryId,
        handleChangeName,
        handleSaveAs,
        handleGoEditOther,
        delCustomColor,
        updateCustomColor,
        getAllGoods,
        handleDeleteCapsuleItemFinished,
        goods,
        selectedGoodId,
        selectedGoodCategryId,
        originCapsuleItems: capsuleItems,
        capsuleItems: !isEditor && selectedGoodId ? filterCapsuleItems : capsuleItems,
        currentEditCapsuleItemIndex, 
        currentEnlargeCapsuleItemIndex,
        currentEnlargeCapsuleItemFinishedIndex
    };
};

export default useDiy;