import React, { useState, useEffect, useRef } from 'react';
import { Card, Button, Modal } from 'antd';
import { PageHeaderWrapper } from '@ant-design/pro-layout';

import { connect } from 'dva';

import Waterfall from 'waterfalljs-layout/dist/react/index.esm';

function useDebounce(callback, delay) {
    const timeoutRef = useRef(null);
  
    useEffect(() => {
      // 清理上一次的定时器
      return () => {
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }
      };
    }, []);
  
    return (...args) => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      timeoutRef.current = setTimeout(() => {
        callback(...args);
      }, delay);
    };
  }

const defimages = [
    'https://picsum.photos/640/200/?random',
    'https://picsum.photos/360/640/?random',
    'https://picsum.photos/480/720/?random',
    'https://picsum.photos/480/640/?random',
    'https://picsum.photos/360/?random',
    'https://picsum.photos/360/520/?random',
    'https://picsum.photos/520/360/?random',
    'https://picsum.photos/520/360/?random',
    'https://picsum.photos/520/360/?random',
    'https://picsum.photos/720/640/?random',
    'https://picsum.photos/420/640/?random',
    'https://picsum.photos/520/640/?random',
    'https://picsum.photos/620/640/?random',
];

const customStyleGrid = `#react-waterfall-grid-comps li>div {
  border-radius: 8px;
  font-size: 20px;
  overflow: hidden;
  color: rgba(0, 0, 0, 0.6);
  margin-bottom: 20px;
  padding: 6px;
  background: rgb(255, 255, 255);
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.1);
  transition: all 0.5s
}
#react-waterfall-grid-comps li>div:hover {
  transform: translateY(-6px);
  box-shadow: 0 30px 50px rgba(0, 0, 0, 0.3);
  transition: all 0.3s
}
#react-waterfall-grid-comps li>div>img {
  width: 100%
}`;

const Com = props => {
    const [images, setImages] = useState(defimages);
    const ulMaxHRef = useRef(0);
    const scrollContainerRef = useRef({})

    const handleSearchImage = async () => {
        function random(min, max) {
            return min + Math.floor(Math.random() * (max - min + 1));
        }
        const arr = [];
        for (let i = 0; i < 9; i++) {
            const imgSrc = `${defimages[i]}=${random(1, 10000)}`;
            arr.push(imgSrc);
        }
        setImages(prev => [...prev, ...arr]);
    };

    useEffect(() => {
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = 'auto'
        }
    }, []);

    const handleScroll = e => {
        const {scrollTop, clientHeight} = scrollContainerRef.current;
       
        if (scrollTop + clientHeight + 100 > ulMaxHRef.current) {
            handleSearchImage()
            console.log('滚动到底部执行加载逻辑，代替点击 loadmore 按钮');
        }
    }

    const debounceScroll = useDebounce(handleScroll, 300)

    return (
        // <PageHeaderWrapper>
            <Card style={{ marginBottom: '20px' }}>
                <div
                    style={{
                        height: 'calc(100vh - 150px)',
                        overflowY: 'scroll',
                    }}
                    ref={scrollContainerRef}
                    onScroll={debounceScroll}
                >
                    <Waterfall
                        mode="grid"
                        el="#react-waterfall-grid-comps"
                        columnWidth={'auto'}
                        columnCount={5}
                        columnGap={24}
                        rowGap={24}
                        customStyle={customStyleGrid}
                        onChangeUlMaxH={h => (ulMaxHRef.current = h)}
                    >
                        {images.map((item, index) => {
                            return (
                                <li key={index} onClick={() => alert('图片地址为:' + item)}>
                                    <div>
                                        {index + 1}
                                        <img src={item} alt="" />
                                    </div>
                                </li>
                            );
                        })}
                    </Waterfall>
                </div>
            </Card>
        // </PageHeaderWrapper>
    );
};

export default connect(state => ({
    ...state.creativeCapsule,
}))(Com);
