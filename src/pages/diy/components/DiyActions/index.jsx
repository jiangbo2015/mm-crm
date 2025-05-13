import { history } from 'umi'
import { Button, Modal, message, Input, Tag } from 'antd';
import React, { useState } from 'react';
import { get } from 'lodash'
import { useDispatch, useSelector } from '@/hooks/useDvaTools'
import { downloadResourcesAsZip,wait } from '@/utils/utils'
import { intl } from '@/utils/utils'

import {
    SendOutlined,
    DeliveredProcedureOutlined,
    UserOutlined,
    ExclamationCircleOutlined
} from '@ant-design/icons';

import useDiy from '../../hooks/useDiy'

const StatusToMapText = {
    'pending': '等待发布审核', 
    'draft': '',
    'published': '已发布'
}

const DiyActions = ({arrangement}) => {

    const { 
        handleSave, 
        handleSaveAs, 
        isEditor, 
        handleView, 
        originCapsuleItems, 
        name, status, 
        handleChangeName,
        handleGoEditOther
     } = useDiy()
    const dispatch = useDispatch()
    const currentUser = useSelector(state => state?.user?.currentUser)
    const author = useSelector(state => state?.diy?.author)
    const _id = useSelector(state => state?.diy?._id)
    const [modal, contextHolder] = Modal.useModal();
    const IsAdmin = 0 === currentUser?.role
    const IsAuthor = (!_id && !author) || author?._id === currentUser?._id
    const IsPending = status === 'pending'
    const IsCanEdit = status !== 'published'
    const IsCanPublish = status === 'draft'
    const [inputNameOpen, setInputNameOpen] = useState(false)

    const downloadingText = {
        title: intl('下载中，请稍等片刻...')
    }
    const downloaded = {
        title: intl('下载完成')
    }
    const handleDownload = async () => {
        const downloadingModal = modal.info({
            ...downloadingText,
            closable: false,
            okButtonProps: {
                loading: true
            }
        });
       await downloadResourcesAsZip(originCapsuleItems, name)
       downloadingModal.update({
            ...downloaded,
            closable: false
       })
       await wait(2000)
       downloadingModal.destroy()
    };

    const publishText = {
        title: intl('发布提交成功'),
        content: intl('请等待管理员审批'),
    }
    const handlePublish = async () => {
        await dispatch({
            type: 'diy/applyForPublication',
            payload: { _id }
        })
        modal.info({
            ...publishText
        })
    };

    const publishedText = {
        title: intl('发布成功'),
    }
    const handleApprove = async () => {
        await dispatch({
            type: 'diy/approve',
            payload: {
                _id,
                status: 'published',
            },
        });
        modal.info({
            ...publishedText
        })
    };

    const saveToMyText = {
        title: intl('复制成功'),
        content: intl('已复制到“我的创建”，去编辑'),
        cancelText: intl('取消'),
        okText: intl('去编辑'),
    }
    const handleSaveToMy = async () => {
        handleSaveAs(`${name}-copy`, arrangement).then((res) => {
            // console.log('res-->', res?.data?._id)
            modal.confirm({
                ...saveToMyText,
                onOk: () => {
                    handleGoEditOther(res?.data?._id)
                }
            });
        })
    };
    const handleEdit = () => {
        dispatch({
            type: 'diy/setMode',
            payload: 'editor'
        })
    };

    const delText = {
        title: intl('确认要删除吗'),
        okText: intl('确认'),
        cancelText: intl('取消'),
        delSuccessText: intl('删除成功'),
        delFailText: intl('删除失败'),
    }
    const handleDel = () => {
        modal.confirm({
            ...delText,
            icon: <ExclamationCircleOutlined />,
            okType: 'danger',
            onOk: async () => {
                const res = await dispatch({
                    type: 'diy/delCapsule',
                    payload: {
                        _id,
                    },
                })
                if(res.success) {
                    message.success(delText.delSuccessText)
                    history.goBack()
                } else {
                    message.error(delText.delFailText)
                }
            },
        });
    };

    async function handlePreSave() {
        if(!name) {
            setInputNameOpen(true)
            return
        }
        confirmSave()
    }

    const saveSuccessInfo = {
        title: intl('保存成功'),
        content: `${intl('去查看胶囊详情')} ？`,
        cancelText: intl('留下编辑'),
        okText: intl('去查看')
    }
    function confirmSave (close) {
        if(!name) {
            message.error("胶囊名称不能为空")
            return
        }
        if(close) {close()}
        
        handleSave(undefined, arrangement).then(function() {
            modal.confirm({
                ...saveSuccessInfo,
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
      {!isEditor && !! author && <div><Tag icon={<UserOutlined />} color="purple">{author?.name}</Tag></div>}
      {!!StatusToMapText[status] && 
       <div><Tag color="processing">{StatusToMapText[status]}</Tag></div>}
       
      {!isEditor && IsPending && IsAdmin && <Button type="primary" icon={<SendOutlined />} onClick={handleApprove}>
        {intl('通过发布')}
      </Button>}
      {!isEditor && <Button type="primary" icon={<DeliveredProcedureOutlined />} onClick={handleSaveToMy}>{intl('复制到（我的创建）')}</Button>}
      {!isEditor && <Button type="primary" onClick={handleDownload}>
        {intl('下载')}
      </Button>}
      {!isEditor && IsAuthor && IsCanEdit && <Button type="primary" onClick={handleEdit}>
        {intl('编辑')}
      </Button>}
      {!isEditor && IsAuthor && IsCanPublish && <Button type="primary" onClick={handlePublish}>
        {intl('发布')}
      </Button>}
      {!isEditor && IsCanEdit && IsAuthor && <Button type="primary" onClick={handleDel}>
        {intl('删除')}
      </Button>}
      {isEditor && IsAuthor && IsCanEdit &&  <Button type="primary" onClick={() => {
        handlePreSave()
      }}>
        {intl('保存')}
      </Button>}

      <Modal title={intl("请输入胶囊名称")} width={340} open={inputNameOpen} onOk={() => {
        confirmSave(onCloseInputName)
      }} onCancel={onCloseInputName}> 
        <Input onChange={onChangeName} />
      </Modal>
      {contextHolder}
    </>
  );
};

export default DiyActions;