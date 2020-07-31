import React from 'react';
import { imgUrl } from '@/utils/apiconfig';
import { filterImageUrl } from '@/utils/utils';
import { Col, Upload, Icon } from 'antd';
import styles from './index.less';
export const Avatar = ({ src, onLoad }) => (
    <img
        src={`${imgUrl}${filterImageUrl(src)}`}
        alt="avatar"
        style={{ width: '100%' }}
        onLoad={onLoad}
    />
);

const typeProps = {
    front: '前视图',
    backend: '后视图',
    left: '左视图',
};
export const uploadProps = {
    name: 'file',
    listType: 'picture-card',
    className: styles.uploader,
    showUploadList: false,
    action: `/api/common/uploadkit`,
};

export const UploadBtn = ({ type }) => (
    <div>
        <Icon type={type} />
        <div className="ant-upload-text">Upload</div>
    </div>
);

const UploadCom = ({ type, isPlain, handleChange, selectedPlainColor, selectedFlowerColor }) => {
    console.log(type, typeProps[type]);
    const selected = isPlain ? selectedPlainColor : selectedFlowerColor;
    return (
        <Col span="8" className={styles.center}>
            <div className={styles.title}>{typeProps[type]}</div>
            <Upload
                {...uploadProps}
                onChange={info => {
                    handleChange(info, type, isPlain);
                }}
            >
                {selected[type] ? (
                    <Avatar src={`${selected[type]}`}></Avatar>
                ) : (
                    <UploadBtn
                        type={selected.utype === type && selected.loading ? 'loading' : 'plus'}
                    ></UploadBtn>
                )}
            </Upload>
        </Col>
    );
};

export default UploadCom;
