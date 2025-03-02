import { useState } from 'react';
import { Modal } from 'antd'
import { isFunction } from 'lodash'
import Icon, { HomeOutlined } from '@ant-design/icons';

const DropperSvg  = () => ( <svg class="btn__icon" role="img" alt="eye dropper" height="60px" width="60px" xmlns="http://www.w3.org/2000/svg"
version="1.1" viewBox="0 0 50 50" x="0px" y="0px">
    <path
        d="M42.033 3.101c-1.284 0-2.474 0.493-3.381 1.4l-4.932 4.932-3.080-3.084-6.067 6.063 2.498 2.498-18.652 18.652c-1.397 1.397-1.925 3.384-1.449 5.253l0.118 0.46-3.992 3.996 3.634 3.634 3.996-3.992 0.46 0.118c1.871 0.476 3.855-0.054 5.253-1.453l18.652-18.652 2.498 2.498 6.063-6.063-3.084-3.084 4.932-4.932c1.87-1.87 1.87-4.893 0-6.763l-0.077-0.073-0.008-0.012c-0.907-0.907-2.097-1.396-3.381-1.396zM42.033 4.118c0.996 0 1.953 0.391 2.661 1.099l0.085 0.085c1.299 1.299 1.255 3.619 0.244 5.082l-0.244 0.24-4.932 4.936-5.412-5.412 4.932-4.932c0.709-0.709 1.669-1.099 2.665-1.099zM30.636 7.788l11.576 11.576-4.626 4.622-11.576-11.576 4.626-4.622zM27.787 15.625l6.58 6.58-18.648 18.656c-1.289 1.289-3.231 1.673-4.915 0.973l-0.313-0.13-3.764 3.764-2.193-2.201 3.76-3.764-0.13-0.313c-0.701-1.684-0.313-3.623 0.973-4.911l18.652-18.652z">
    </path>
</svg>)

import styles from './index.less'

const EyeDropperPicker = ({modalProps = {}}) => {
    const { onOk } = modalProps;
  const [selectedColor, setSelectedColor] = useState('');
  const [error, setError] = useState('');

  // 检测浏览器支持性
  const isSupported = 'EyeDropper' in window;

  const handleOpenPicker = async () => {
    setError('');
    
    try {
      // @ts-ignore - 暂时忽略 TS 类型检查（某些浏览器可能未包含类型声明）
      const eyeDropper = new window.EyeDropper();
      
      const result = await eyeDropper.open();
      setSelectedColor(result.sRGBHex);
    } catch (err) {
      // 用户取消取色时会触发 AbortError
      if (err instanceof DOMException && err.name === 'AbortError') {
        return;
      }
      setError('无法使用取色器，请确保浏览器支持该功能');
    }
  };

  const handleOk = () => {
    if(isFunction(onOk)) {
        onOk(selectedColor)
    }
  }

  if (!isSupported) {
    return (
      <div className={styles["error"]}>
        当前浏览器不支持 EyeDropper API，请使用 Chrome 95+ 或 Edge 96+
      </div>
    );
  }

  return (
    <Modal
        {...modalProps}
        closable={false}
        top={112}
        //   visible={visible}
        onOk={handleOk}
    >
        <div className={styles["picker-container"]}>

        
        <div 
            className={styles["picker-button"]}
            onClick={handleOpenPicker}
            aria-label="打开取色器"
        >
            <Icon component={DropperSvg}/>
        </div>

        {selectedColor && (
            <div className={styles["color-preview"]}>
            <div 
                className={styles["color-block"]}
                style={{ backgroundColor: selectedColor }}
            />
            <span className={styles["color-value"]}>{selectedColor}</span>
            </div>
        )}

        {error && <div className={styles["error"]}>{error}</div>}
        </div>
    </Modal>
  );
};

export default EyeDropperPicker;