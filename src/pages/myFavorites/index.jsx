import React, { useState, useEffect, useRef } from 'react';
import { Input, Button, Modal, Spin } from 'antd';
import { get,debounce } from 'lodash';
import { filterImageUrl } from '@/utils/utils';
import { connect } from 'dva';
import { history } from 'umi'
import {
    StarFilled,
    StarOutlined,
  } from '@ant-design/icons';
import Waterfall from 'waterfalljs-layout/dist/react/index.esm';
import { useDebounce } from '@/hooks/useDebounce';
import styles from './index.less'
const { Search } = Input;

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

const customStyleGrid = `
#react-waterfall-grid-comps li>div {
  border-radius: 18px;
  font-size: 20px;
  overflow: hidden;
  color: rgba(0, 0, 0, 0.6);
  margin-bottom: 20px;
  padding: 0px;
  background: rgb(255, 255, 255);
  transition: all 0.5s;
}
#react-waterfall-grid-comps li>div:hover {
  transform: translateY(-6px);
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.1);
  transition: all 0.3s
}
#react-waterfall-grid-comps {
    padding: 0;
    column-gap: 24px;
}
#react-waterfall-grid-comps li>div>img {
  width: 100%;
    cursor: pointer;
}
#react-waterfall-grid-comps li>div>span {
  display: none;
}
#react-waterfall-grid-comps li>div:hover>span {
  display: block;
}
`;

const starIconStyle = { 
    position: 'absolute', 
    right: '12px', 
    top: '18px', 
    fontSize: '26px',
    color: '#f7d102',
    cursor: 'pointer'
}

const Com = props => {
    const [key, setKey] = useState(0)
    const [images, setImages] = useState(defimages);
    const [isLoading, setIsLoading] = useState(false)
    const [searchText, setSearchText] = useState('')
    const ulMaxHRef = useRef(0);
    const scrollContainerRef = useRef({})
    const { capsuleFavoritesMap } = props
    const {docs, pages, page} = props.list

    useEffect(() => {
        const payload = {
            page: 1,
            limit: 20
        }
        if (searchText) {
            payload.name = searchText
        }
        props.dispatch({
            type: 'myFavorites/getList',
            payload,
        }).then(() => {
            setKey(Date.now())
        });
        props.dispatch({
            type: 'myFavorites/getFavorites',
        });
        return () => {
            props.dispatch({
                type: 'myFavorites/clearCapsuleList'
            });
        }
    }, [searchText])
    

    const handleSearchImage = async () => {
        if(Number(page) < pages && !isLoading) {
            const payload = {
                page: Number(page) + 1,
                limit: 20
            }
            if (searchText) {
                payload.name = searchText
            }
            setIsLoading(true)
            await props.dispatch({
                type: 'myFavorites/getList',
                payload,
            });
            setIsLoading(false)
        }
        
        // function random(min, max) {
        //     return min + Math.floor(Math.random() * (max - min + 1));
        // }
        // const arr = [];
        // for (let i = 0; i < 9; i++) {
        //     const imgSrc = `${defimages[i]}=${random(1, 10000)}`;
        //     arr.push(imgSrc);
        // }
        // setImages(prev => [...prev, ...arr]);
        
    };

    useEffect(() => {
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = 'auto'
        }
    }, []);

    const handleScroll = e => {
        const {scrollTop, clientHeight} = scrollContainerRef.current;
       console.log('scroll')
        if (scrollTop + clientHeight + 100 > ulMaxHRef.current) {
            handleSearchImage()
            console.log('滚动到底部执行加载逻辑，代替点击 loadmore 按钮');
        }
    }

    const debounceScroll = useDebounce(handleScroll, 300)

    const handleAddFavorite = (id) => {
        props.dispatch({
            type: 'myFavorites/addFavorite',
            payload: {
                capsule: id
            }
        })
    } 

    const handleDelFavorite = (id) => {
        props.dispatch({
            type: 'myFavorites/delFavorite',
            payload: id
        })
    } 

      const handleResize = debounce(() => {
        setKey(Date.now())
      }, 200); 
    
        useEffect(() => {
            // 添加 resize 事件监听器
            window.addEventListener('resize', handleResize);
        
            // 清除事件监听器
            return () => {
              window.removeEventListener('resize', handleResize);
            };
          }, [handleResize]); // 依赖项中添加 handleResize
          const handleGoDIY = (id) => {
            history.push(`/diy/${id}`)
        }
    return (
        <Spin spinning={isLoading}>
            <div style={{ marginBottom: '20px', position: 'relative' }}>
                <Search 
                    placeholder="搜索"
                    allowClear
                    onSearch={setSearchText} 
                    size='large'
                    className={styles['search-input']}
                    style={{ 
                        width: 360,
                        position: 'absolute',
                        top: '-56px',
                        zIndex: 999
                    }}  
                />
                <div
                    key={key}
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
                        {(docs || []).map((item, index) => {
                            // const item = favorite?.capsule
                            return (
                                <li key={index}>
                                    <div style={{position: 'relative'}}>
                                        {!!capsuleFavoritesMap[item?._id] ? 
                                            <StarFilled onClick={() => { handleDelFavorite(capsuleFavoritesMap[item?._id]?._id)}} style={starIconStyle} /> : 
                                            <StarOutlined onClick={() => { handleAddFavorite(item?._id)}} style={starIconStyle} />
                                        }
                                        <img 
                                            onClick={() => handleGoDIY(item?._id)}
                                            src={filterImageUrl(item.imgUrl || 
                                            get(item, 'capsuleItems.0.fileUrl') || 
                                            get(item, 'capsuleItems.0.finishedStyleColorsList.0.imgUrlFront'))} alt="" style={{minHeight: 100}} 
                                        />
                                        <p style={{ 
                                            fontSize: 14, 
                                            fontWeight: 'bold',
                                            color: '#000', 
                                            background: 'rgba(255,255,255,0.5)',
                                            position: 'absolute',
                                            bottom: -14,
                                            left: 0,
                                            right: 0,
                                            padding: '0 8px'
                                        }}>
                                            {item?.name}
                                        </p>
                                    </div>
                                </li>
                            );
                        })}
                    </Waterfall>
                </div>
            </div>
        </Spin>
    );
};

export default connect(state => ({
    ...state.myFavorites,
}))(Com);
