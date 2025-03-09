import { Button, Modal } from 'antd';
import React, { useState } from 'react';
import { useDispatch, useSelector } from '@/hooks/useDvaTools'
import { downloadResourcesAsZip,wait } from '@/utils/utils'
import useDiy from '../../hooks/useDiy'


const DiyActions = () => {

    const { handleSave, isEditor, handleView, originCapsuleItems, name } = useDiy()
    const dispatch = useDispatch()
    const currentUser = useSelector(state => state?.user?.currentUser)
    const author = useSelector(state => state?.diy?.author)
    const _id = useSelector(state => state?.diy?._id)
    const [modal, contextHolder] = Modal.useModal();
    const IsAuthor = author?._id === currentUser?._id

    const handleDownload = async () => {
        const downloadingModal = modal.info({
            title: '下载中，请稍等片刻...',
            closable: false,
            okButtonProps: {
                loading: true
            }
        });
       await downloadResourcesAsZip(originCapsuleItems, name)
       downloadingModal.update({
            title: '下载完成',
            closable: false
       })
       await wait(2000)
       downloadingModal.destroy()
    };

    const handlePublish = async () => {
        await dispatch({
            type: 'diy/applyForPublication',
            payload: { _id }
        })
        modal.info({
            title: '发布提交成功',
            content: '请等待管理员审批',
        })
    };
    
    const handleEdit = () => {
        dispatch({
            type: 'diy/setMode',
            payload: 'editor'
        })
    };

    const handlePreSave = async () => {
        await handleSave()
        modal.confirm({
            title: '保存成功',
            content: '去查看胶囊详情 ？',
            cancelText: '留下编辑',
            okText: '去查看',
            onOk: handleView
        });
    }


  return (
    <>
      {!isEditor && <Button type="primary" onClick={handleDownload}>
        下载
      </Button>}
      {!isEditor && IsAuthor && <Button type="primary" onClick={handleEdit}>
        编辑
      </Button>}
      {!isEditor && IsAuthor && <Button type="primary" onClick={handlePublish}>
        发布
      </Button>}
      {isEditor && IsAuthor && <Button type="primary" onClick={() => {
        handlePreSave()
      }}>
        保存
      </Button>}
      {contextHolder}
    </>
  );
};

export default DiyActions;