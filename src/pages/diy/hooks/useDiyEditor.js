import { useState, useEffect } from 'react';
import { get } from 'lodash';
import { useDispatch, useSelector } from '@/hooks/useDvaTools'
import request from '@/utils/request';
import svg2pngFile from '@/utils/new.svg2pngFile'

const useDiy = () => {
  const dispatch = useDispatch()
//   plainColors
  const plainColors = useSelector(state => state?.diy?.plainColors)
  const customPlainColors = useSelector(state => state?.diy?.customPlainColors)
  const flowerColors = useSelector(state => state?.diy?.flowerColors)
  const customFlowerColors = useSelector(state => state?.diy?.customFlowerColors)
  const textures = useSelector(state => state?.diy?.textures)
  const capsuleItems = useSelector(state => state?.diy?.capsuleItems)
  const currentEditCapsuleItemIndex = useSelector(state => state?.diy?.currentEditCapsuleItemIndex)
  const currentEditCapsuleItemFinishedIndex = useSelector(state => state?.diy?.currentEditCapsuleItemFinishedIndex)
  const currentEditCapsuleItem = get(capsuleItems, currentEditCapsuleItemIndex)

  const currentEditCapsuleStyleRegion = useSelector(state => state?.diy?.currentEditCapsuleStyleRegion)
  
  const [uploading, setUploading] = useState(false)
  const [visibleStylesSelectorModal, setVisibleStylesSelectorModal] = useState(false);

    const addCapsuleItem = item => {
        dispatch({
            type: 'diy/addCapsuleItem',
            payload: item,
        });
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

    const handleUpdateCurrentEditCapsuleStyleRegion = (index) => {
        dispatch({
            type: 'diy/setCurrentEditCapsuleStyleRegion',
            payload: index
        })
        
    }

    const uploadStyleImage = async (svgString, imgUrl) => {
        const { file } = await svg2pngFile(svgString, imgUrl);

        var postData = new FormData();
        postData.append('file', file);
        const res = await request('/api/common/uploadkit', {
            data: postData,
            method: 'post',
        });
        return { url: res.data.url };
    };

    const handleCompleteCapsuleItemFinished = (finishedObj) => {
        if(currentEditCapsuleItemFinishedIndex > 0) {
            currentEditCapsuleItem.finishedStyleColorsList[currentEditCapsuleItemFinishedIndex] = finishedObj
        } else {
            currentEditCapsuleItem.finishedStyleColorsList = [finishedObj]
        }
        dispatch({
            type: 'diy/setCapsuleItems',
            payload: [...capsuleItems],
        });
    }


  return {
    addCapsuleItem,
    handleUpdateCapsuleItem,
    handleUpdateCurrentEditCapsuleStyleRegion,
    handleCompleteCapsuleItemFinished,
    uploadStyleImage,
    currentEditCapsuleItem,
    currentEditCapsuleItemFinishedIndex,
    currentEditCapsuleStyleRegion,
    plainColors,
    flowerColors,
    textures,
    customPlainColors,
    customFlowerColors
 };
};

export default useDiy;