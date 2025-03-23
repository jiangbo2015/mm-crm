import { Button, Modal, message, Input, Tag } from 'antd';
import React, { useState } from 'react';
import { get } from 'lodash'
import { useDispatch, useSelector } from '@/hooks/useDvaTools'
import { downloadResourcesAsZip,wait } from '@/utils/utils'
import {
    SendOutlined,
} from '@ant-design/icons';

import useDiy from '../../hooks/useDiy'

const StatusToMapText = {
    'pending': '等待发布审核', 
    'draft': '',
    'published': '已发布'
}

const DiyActions = () => {

    const { handleSave, isEditor, handleView, originCapsuleItems, name, status, handleChangeName } = useDiy()
    const dispatch = useDispatch()
    const currentUser = useSelector(state => state?.user?.currentUser)
    const author = useSelector(state => state?.diy?.author)
    const _id = useSelector(state => state?.diy?._id)
    const [modal, contextHolder] = Modal.useModal();
    const IsAdmin = 0 === currentUser?.role
    const IsAuthor = !author || author?._id === currentUser?._id
    const IsPending = status === 'pending'
    const IsCanEdit = status === 'draft'
    const IsCanPublish = status === 'draft'
    const [inputNameOpen, setInputNameOpen] = useState(false)

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
    const handleApprove = async () => {
        await dispatch({
            type: 'diy/approve',
            payload: {
                _id,
                status: 'published',
            },
        });
        modal.info({
            title: '发布成功',
        })
    };
    const handleEdit = () => {
        dispatch({
            type: 'diy/setMode',
            payload: 'editor'
        })
    };

    async function handlePreSave() {
        if(!name) {
            setInputNameOpen(true)
            return
        }
        confirmSave()
    }

    function confirmSave (close) {
        if(!name) {
            message.error("胶囊名称不能为空")
            return
        }
        if(close) {close()}
        handleSave().then(() => {
            modal.confirm({
                title: '保存成功',
                content: '去查看胶囊详情 ？',
                cancelText: '留下编辑',
                okText: '去查看',
                onOk: handleView
            });
        })
        
    }

    const onCloseInputName = (e) => {
        setInputNameOpen(false)
    }
    const onChangeName = (e) => {
        handleChangeName(get(e, 'target.value'))
    }

  return (
    <>
      {!!StatusToMapText[status] && 
       <div><Tag color="processing">{StatusToMapText[status]}</Tag></div>}
      {IsPending && IsAdmin && <Button type="primary" icon={<SendOutlined />} onClick={handleApprove}>
        通过发布
      </Button>}
      {!isEditor && <Button type="primary" onClick={handleDownload}>
        下载
      </Button>}
      {!isEditor && IsAuthor && IsCanEdit && <Button type="primary" onClick={handleEdit}>
        编辑
      </Button>}
      {!isEditor && IsAuthor && IsCanPublish && <Button type="primary" onClick={handlePublish}>
        发布
      </Button>}
      {isEditor && IsAuthor && IsCanEdit &&  <Button type="primary" onClick={() => {
        handlePreSave()
      }}>
        保存
      </Button>}
      <Modal title="请输入胶囊名称" width={340} open={inputNameOpen} onOk={() => {
        confirmSave(onCloseInputName)
      }} onCancel={onCloseInputName}> 
        <Input onChange={onChangeName} />
      </Modal>
      {contextHolder}
    </>
  );
};

export default DiyActions;