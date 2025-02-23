import { useState, useEffect } from 'react';
import { get } from 'lodash';
import { useDispatch, useSelector } from '@/hooks/useDvaTools'
import request from '@/utils/request';
import svg2pngFile from '@/utils/new.svg2pngFile'

const useDiy = () => {
  const dispatch = useDispatch()
//   plainColors
  const plainColors = useSelector(state => state?.diy?.plainColors)
  const flowerColors = useSelector(state => state?.diy?.flowerColors)
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
    const handleUpdateCapsuleItem = (item, index) => {
        console.log('handleUpdateCapsuleItem:', index)
        dispatch({
            type: 'diy/setCurrentEditCapsuleItemIndex',
            payload: index
        })
    }

    const handleUpdateCurrentEditCapsuleStyleRegion = (index) => {
        console.log('setCurrentEditCapsuleStyleRegion:', index)
        dispatch({
            type: 'diy/setCurrentEditCapsuleStyleRegion',
            payload: index
        })
        
    }

    const uploadStyleImage = async (svgString, imgUrl) => {
        console.log('uploadStyleImage');
        const { file } = await svg2pngFile(svgString, imgUrl);
        console.log('file');
        // /api/common/uploadkit

        var postData = new FormData();
        postData.append('file', file);
        const res = await request('/api/common/uploadkit', {
            data: postData,
            method: 'post',
        });
        console.log('res', res);
        return { url: res.data.url };
    };


  return {
    addCapsuleItem,
    handleUpdateCapsuleItem,
    handleUpdateCurrentEditCapsuleStyleRegion,
    uploadStyleImage,
    currentEditCapsuleItem,
    currentEditCapsuleItemFinishedIndex,
    currentEditCapsuleStyleRegion,
    plainColors,
    flowerColors,
    textures
 };
};

export default useDiy;