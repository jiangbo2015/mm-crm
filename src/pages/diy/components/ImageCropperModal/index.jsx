import React, { useState, useRef } from 'react';
import { Modal, Upload, Avatar } from 'antd'
import ReactCrop from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';

import request from '@/utils/request';

import styles from './index.less';

const ImageCropper = ({ onUpload, modalProps }) => {
    const [src, setSrc] = useState(null);
    const [uploadedImgUrl, setUploadedImgUrl] = useState('');
    const [cropperOpen , setCropperOpen] = useState(false);
    const [crop, setCrop] = useState({  });
    const [croppedImage, setCroppedImage] = useState(null);
    const [isUploading, setIsUploading] = useState(false);
    const [error, setError] = useState('');
    const imageRef = useRef(null);
    const fileInputRef = useRef(null);
    console.log("crop", crop)
  
    // 处理文件选择
    const handleFileChange = (e) => {
      if (e.target.files && e.target.files[0]) {
        const reader = new FileReader();
        reader.onload = () => {
            setSrc(reader.result);
            setCropperOpen(true)
        };
        reader.readAsDataURL(e.target.files[0]);
      }
    };
  
    // 获取裁剪后的图片
    const getCroppedImage = () => {
      if (!imageRef.current || !crop.width || !crop.height) return;
      console.log(crop)
  
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
          resolve(blob);
        }, 'image/jpeg');
      });
    };
  
    // 处理裁剪完成
    const handleCropComplete = async () => {
      try {
        const blob = await getCroppedImage();
        setCroppedImage(blob);
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
        postData.append('file', croppedImage);

        try {
            setIsUploading(true);
            setError('');
            const response = await request('/api/common/uploadkit', {
                data: postData,
                method: 'post',
            });
            uploadedImgUrl(response.data.url);
        } catch (err) {
            setError('上传失败: ' + (err.message || '服务器错误'));
        } finally {
            setIsUploading(false);
        }
    };

    const handleCloseCropperModal = () => {
        setCropperOpen(false);
        setSrc(null);
        // 重置文件输入
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      };
  return (
    <>
        <Modal
        {...modalProps}
        closable={false}
        top={112}
        //   visible={visible}
        // onOk={handleOk}
    >
        <div className={styles.container}>
            <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className={styles.fileInput}
                ref={fileInputRef}
                key={cropperOpen ? 'reset' : 'initial'}
            />
            <Upload>
                <Avatar src={uploadedImgUrl}/>
            </Upload>
            {/* {src && (
                <div className={styles.cropWrapper}>
                <ReactCrop
                    src={src}
                    crop={crop}
                    onChange={(newCrop) => setCrop(newCrop)}
                    onImageLoaded={(img) => {
                        imageRef.current = img;
                    }}
                    onComplete={handleCropComplete}
                />
                </div>
            )} */}
            {/* 
            {croppedImage && (
                <div className={styles.previewSection}>
                <h4>裁剪预览:</h4>
                <img 
                    src={URL.createObjectURL(croppedImage)} 
                    alt="裁剪预览"
                    className={styles.previewImage}
                />
                </div>
            )} */}

            {/* {croppedImage && (
                <button
                onClick={handleUpload}
                disabled={isUploading}
                className={styles.uploadButton}
                >
                {isUploading ? '上传中...' : '确认上传'}
                </button>
            )}

            {error && <div className={styles.error}>{error}</div>} */}
        </div>
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
                        onComplete={handleCropComplete}
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