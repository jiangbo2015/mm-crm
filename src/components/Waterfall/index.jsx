import { useState } from 'react';
import { Input, Button, Modal, Spin } from 'antd';
import { get, debounce } from 'lodash';
import { filterImageUrl } from '@/utils/utils';
import { connect } from 'dva';
import { history } from 'umi';
import {
    StarFilled,
    StarOutlined,
    PlaySquareFilled
  } from '@ant-design/icons';
import { VideoPlayingModal } from '@/components/VideoPlayingModal'
import Waterfall from 'waterfalljs-layout/dist/react/index.esm';
import { useDebounce } from '@/hooks/useDebounce';
import styles from './index.less'


export const VideoItem = ({src, handleVideoClick}) => (
        <div className={styles["video-wrapper"]}>
            <video
                onClick={handleVideoClick}
                // onEnded={() => onPlay(null)}
            >
                <source src={src} type="video/mp4" />
            </video>
        </div>
)

const { Search } = Input;

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
#react-waterfall-grid-comps li>div>video {
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
    cursor: 'pointer',
    zIndex: 9,
}

const playIconStyle = { 
    position: 'absolute', 
    left: '50%',  /* 水平方向居中 */
    top: '50%',   /* 垂直方向居中 */
    transform: 'translate(-50%, -50%)', /* 偏移自身宽高的50% */
    fontSize: '38px',
    color: '#0000007e',
    cursor: 'pointer',
    zIndex: 9,
}

const MyWaterfall = ({
    isLoading,
    searchText,
    setSearchText,
    scrollContainerRef,
    onScroll,
    sourceData,
    favoritesMap,
    handleGoDIY,
    handleDelFavorite,
    handleAddFavorite,
    waterfallKey
}) => {
    const [playingVideoUrl, setPlayingVideoUrl] = useState(null);
    return  (
        <Spin spinning={isLoading}>
            <div style={{ marginBottom: '20px', position: 'relative' }}>
                <Search 
                    placeholder="搜索"
                    allowClear
                    onSearch={v => {
                        setSearchText(v)
                    }} 
                    className={styles['search-input']}
                    size='large'
                    style={{ 
                        width: 360,
                        position: 'absolute',
                        top: '-56px',
                        zIndex: 999
                    }}  
                />
                {playingVideoUrl && <VideoPlayingModal modalProps={{onCancel: ()=> setPlayingVideoUrl(null)}} viedoUrl={playingVideoUrl} />}
                <div
                    key={waterfallKey}
                    style={{
                        height: 'calc(100vh - 150px)',
                        overflowY: 'scroll',
                    }}
                    ref={scrollContainerRef}
                    onScroll={onScroll}
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
                        {(sourceData || []).map((item, index) => {
                            return (
                                <li key={index + '' + searchText}>
                                    <div style={{position: 'relative'}}>
                                        {!!favoritesMap[item?._id] ? 
                                            <StarFilled onClick={() => { handleDelFavorite(capsuleFavoritesMap[item?._id]?._id)}} style={starIconStyle} /> : 
                                            <StarOutlined onClick={() => { handleAddFavorite(item?._id)}} style={starIconStyle} />
                                        }
                                        { get(item, 'capsuleItems.0.type') === 'video' &&
                                            <PlaySquareFilled 
                                                onClick={() => {
                                                    setPlayingVideoUrl(filterImageUrl(get(item, 'capsuleItems.0.fileUrl')))
                                                }} 
                                                style={playIconStyle} 
                                            />
                                        }
                                        {get(item, 'capsuleItems.0.type') === 'video' ? 
                                            <VideoItem 
                                                handleVideoClick={() => handleGoDIY(item?._id)}
                                                src={filterImageUrl(get(item, 'capsuleItems.0.fileUrl'))}
                                            />
                                            : <img 
                                                onClick={() => handleGoDIY(item?._id)}
                                                src={filterImageUrl(item.imgUrl || 
                                                get(item, 'capsuleItems.0.fileUrl') || 
                                                get(item, 'capsuleItems.0.finishedStyleColorsList.0.imgUrlFront'))} alt="" style={{minHeight: 100}} 
                                            />
                                        }
                                        <p style={{ 
                                            fontSize: 14, 
                                            fontWeight: 'bold',
                                            color: '#000', 
                                            background: 'rgba(255,255,255,0.5)',
                                            position: 'absolute',
                                            bottom: -14,
                                            left: 0,
                                            right: 0,
                                            padding: '6px 8px'
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
    )
}

export default MyWaterfall