import React, { useState, useEffect, useRef } from 'react';
import { get, debounce } from 'lodash';
import { connect } from 'dva';
import { history } from 'umi'

import Waterfall from '@/components/Waterfall'
import { useDebounce } from '@/hooks/useDebounce';

const Com = props => {
    const [key, setKey] = useState(0)
    const [capsuleStatus, setCapsuleStatus] = useState('');
    const [playingVideoUrl, setPlayingVideoUrl] = useState(null);
    const [isLoading, setIsLoading] = useState(false)
    const [searchText, setSearchText] = useState('')

    const ulMaxHRef = useRef(0);
    const scrollContainerRef = useRef({})
    const { capsuleFavoritesMap, currentUser, collapsed } = props
    const {docs, pages, page} = props.list

    useEffect(() => {
        if(key !=0 ) {
            setTimeout(() => {
                setKey(Date.now())
            }, 300)
        }
    }, [collapsed])
    
    useEffect(() => {
        if(!currentUser?._id) {
            return
        }
        const payload = {
            page: 1,
            limit: 20,
            author: currentUser?._id
        }
        if (searchText) {
            payload.name = searchText
        }
        if(capsuleStatus) {
            payload.status = capsuleStatus
        }
        props.dispatch({
            type: 'creativeCapsule/getList',
            payload,
        }).then(() => {
            setKey(Date.now())
        });
        props.dispatch({
            type: 'creativeCapsule/getFavorites',
        });
        return () => {
            props.dispatch({
                type: 'creativeCapsule/clearCapsuleList'
            });
        }
    }, [searchText, currentUser?._id, capsuleStatus])
    
    const handleChangeStatus = value => {
        setCapsuleStatus(value);
    }
    const handleSearchImage = async () => {
        if(Number(page) < pages && !isLoading) {
            setIsLoading(true)
            const payload = {
                author: currentUser?._id,
                page: Number(page) + 1,
                limit: 20
            }
            if (searchText) {
                payload.name = searchText
            }
            await props.dispatch({
                type: 'creativeCapsule/getList',
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
        document.body.style.overflowY = 'hidden';
        return () => {
            document.body.style.overflowY = 'auto'
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
            type: 'creativeCapsule/addFavorite',
            payload: {
                capsule: id
            }
        })
    } 

    const handleDelFavorite = (id) => {
        props.dispatch({
            type: 'creativeCapsule/delFavorite',
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
        <Waterfall
            isLoading={isLoading}
            searchText={searchText}
            setSearchText={setSearchText}
            scrollContainerRef={scrollContainerRef}
            onScroll={debounceScroll}
            sourceData={docs}
            favoritesMap={capsuleFavoritesMap}
            handleGoDIY={handleGoDIY}
            handleDelFavorite={handleDelFavorite}
            handleAddFavorite={handleAddFavorite}
            waterfallKey={key}
            ulMaxHRef={ulMaxHRef}
            hasStatus
            capsuleStatus={capsuleStatus}
            handleChangeStatus={handleChangeStatus}
        />
    );
};

export default connect(state => ({
    ...state.creativeCapsule,
    currentUser: state.user.currentUser,
    collapsed: state.global.collapsed,
}))(Com);
