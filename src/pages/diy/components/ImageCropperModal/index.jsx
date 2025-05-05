import React, { useState, useRef, useEffect } from 'react';
import { Button, Modal, Upload, Form, Input, InputNumber, Row, Col, message, Popconfirm } from 'antd'
import ReactCrop from 'react-image-crop';
import { get } from 'lodash'
import 'react-image-crop/dist/ReactCrop.css';

import request from '@/utils/request';
import { Avatar, UploadBtn } from '@/pages/productManage/colors/UploadCom.js'
import useDiy from '../../hooks/useDiy'
import styles from './index.less';
import {intl} from '@/utils/utils'

export const uploadProps = {
    name: 'file',
    listType: 'picture-card',
    showUploadList: false,
    action: `/api/common/uploadkit`,
};
const formItemLayout = {
    labelCol: {
        xs: {
            span: 24,
        },
        sm: {
            span: 18,
        },
    },
    wrapperCol: {
        xs: {
            span: 24,
        },
        sm: {
            span: 24,
        },
    },
};
const ImageCropper = ({ onUpload, modalProps, editData }) => {
    const { createCustomColor, delCustomColor, updateCustomColor } = useDiy()
    const [src, setSrc] = useState(null);
    const [uploadedImgUrl, setUploadedImgUrl] = useState('');
    const [cropperOpen , setCropperOpen] = useState(false);
    const [crop, setCrop] = useState({  });
    const [croppedImage, setCroppedImage] = useState(null);
    const [isUploading, setIsUploading] = useState(false);
    const [error, setError] = useState('');
    const imageRef = useRef(null);

    const [form] = Form.useForm()
    useEffect(() => {
        if(editData) {
            form.setFieldsValue({...editData, name: get(editData, 'namecn', '')})
        } else {
            form.resetFields()
        }
        
        setUploadedImgUrl(editData?.value)
      }, [editData])
    const beforeUpload = (file) => {
        const limit = file.size / 1024 < 200;
                if (!limit) {
                    message.error('Image must smaller than 200K!');
                    return limit;
                }
                
        const reader = new FileReader();
        reader.onload = (e) => {
          setSrc(e.target.result);
          setCropperOpen(true);
        };
        reader.readAsDataURL(file);
        return false; // 阻止默认上传行为
      };
  
      useEffect(() => {
        handleCropComplete()
      }, [crop])
    // 获取裁剪后的图片
    const getCroppedImage = () => {
      if (!imageRef.current || !crop.width || !crop.height) return;  
      const canvas = document.createElement('canvas');
      const scaleX = imageRef.current.naturalWidth / imageRef.current.width;
      const scaleY = imageRef.current.naturalHeight / imageRef.current.height;
  
      canvas.width = crop.width * scaleX;
      canvas.height = crop.height * scaleY;
  
      const ctx = canvas.getContext('2d');
      ctx.drawImage(
        imageRef.current,
        crop.x * scaleX,
        crop.y * scaleY,
        crop.width * scaleX,
        crop.height * scaleY,
        0,
        0,
        canvas.width,
        canvas.height
      );
  
      return new Promise((resolve) => {
        canvas.toBlob((blob) => {
            resolve({
                blob, 
                width: canvas.width,
                height: canvas.height
            });
        }, 'image/jpeg');
      });
    };
  
    // 处理裁剪完成
    const handleCropComplete = async () => {
      try {
        const croppedImageData = await getCroppedImage();
        setCroppedImage(croppedImageData);
      } catch (err) {
        setError('图片裁剪失败');
      }
    };
  
    // 上传图片
    const handleUpload = async () => {
      if (!croppedImage) {
        setError('请先选择并裁剪图片');
        return;
      }
        var postData = new FormData();
        postData.append('file', croppedImage?.blob);

        try {
            setIsUploading(true);
            setError('');
            const response = await request('/api/common/uploadkit', {
                data: postData,
                method: 'post',
            });

            setUploadedImgUrl(response.data.url);
            setCropperOpen(false)
        } catch (err) {
            setError('上传失败: ' + (err.message || '服务器错误'));
        } finally {
            setIsUploading(false);
        }
    };

    const handleCloseCropperModal = () => {
        setCropperOpen(false);
        setSrc(null);
      };
    
    const handleOk = async () => {
        const vals = form.getFieldsValue()
        const name = get(vals, 'name', '')
        
        const formData = {
            isCustom: 1,
            size: get(vals, 'size'),
            // namecn: get(names, 0),
            // nameen: get(names, 1, get(names, 0)),
            namecn: name,
            nameen: name,
            value: uploadedImgUrl,
            type: 1,
            width: croppedImage?.width,
            height: croppedImage?.height,
        }
        console.log('handleOk', formData)
        const res = editData ? await updateCustomColor({
            _id: editData?._id,
            ...formData
        }) : await createCustomColor(formData)
        if(get(res, 'success')) {
            modalProps.onCancel()
        } else {
            message.error(get(res, 'message'))
        }

      }
    const handleDel = async () => {
        const res = await delCustomColor(editData)
        console.log(res)
        if(get(res, 'success')) {
            modalProps.onCancel()
        } else {
            message.error(get(res, 'message'))
        }
      }
  return (
    <>
        <Modal
        {...modalProps}
        closable={false}
        top={112}
        width={300}
        //   visible={visible}
        onOk={handleOk}
        footer={[
            editData ? 
            <Popconfirm
                title="确认要删除吗"
                onConfirm={handleDel}
                okText="是"
                cancelText="否"
            >
                <Button danger onClick={handleDel}>
                    删除
                </Button>
            </Popconfirm> : null,
            <Button key="back" onClick={modalProps?.onCancel}>
                取消
            </Button>,
            <Button key="submit" type="primary" onClick={handleOk}>
                确定
            </Button>
        ]}
        destroyOnClose
    >
            <Form form={form} {...formItemLayout} name="inputDesiner" layout="vertical">
                <Row>
                    <Col span="12">
                        <Upload 
                            {...uploadProps}
                            className="avatar-uploader"
                            beforeUpload={beforeUpload}
                        >
                            {!!uploadedImgUrl ? <Avatar src={uploadedImgUrl}/> : <UploadBtn type="plus"/>}
                        </Upload>
                    </Col>
                    <Col span="1"></Col>
                    <Col span="11">
                        <Form.Item required name="size"  label={<span>{intl('印花图案单循环宽度')}（cm）</span>}>
                            <InputNumber min={1} step={1} />
                        </Form.Item>
                    </Col>
                </Row>
                <Row style={{marginTop: '30px'}}>
                    <Col span="24">
                        <Form.Item required name="name" label={<span>{intl('印花名称（自定义）')}</span>}>
                            <Input style={{ width: '200px' }} />
                        </Form.Item>
                    </Col>
                </Row>
                <Row style={{marginTop: '10px', color: '#7b7b7b'}}>
                    *{intl('自主上传的印花图案不能超过200kb')}
                </Row>
            </Form>
        </Modal>
        <Modal
            open={cropperOpen}
            footer={null}
            onCancel={handleCloseCropperModal}
            bodyStyle={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center'
            }}
        >
            {src && (
                <div className={styles.cropWrapper}>
                    <ReactCrop
                        src={src}
                        crop={crop}
                        onChange={(newCrop) => setCrop(newCrop)}
                        onImageLoaded={(img) => {
                            imageRef.current = img;

                            const min = Math.min(img.width, img.height)
                            setTimeout(() => {
                                setCrop({
                                    x: (img.width - min) / 2,
                                    y: (img.height - min) / 2,
                                    width: min,
                                    height: min,
                                    unit: "px",
                                    aspect: undefined
                                })
                            }, 0)
                            
                        }}
                        // onComplete={handleCropComplete}
                    />
                </div>
            )}
            <button
                onClick={handleUpload}
                disabled={isUploading}
                className={styles.uploadButton}
                >
                {isUploading ? '上传中...' : '确认上传'}
            </button>

            {error && <div className={styles.error}>{error}</div>}
        </Modal>
    </>


  );
};

export default ImageCropper;