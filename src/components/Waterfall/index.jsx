import { useState } from 'react';
import { Input, Button, Modal, Spin, Radio } from 'antd';
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
import { intl } from '@/utils/utils'
import styles from './index.less'

const IconAll = () => (
    <svg t="1749574635201" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1398" width="20" height="20"><path d="M663.296 995.584a94.72 94.72 0 0 1-94.72-94.72V663.04a94.72 94.72 0 0 1 94.72-94.72h237.824a95.488 95.488 0 0 1 94.72 94.72v237.824a94.72 94.72 0 0 1-94.72 94.72z m0-377.6a45.056 45.056 0 0 0-45.056 45.056v237.824A45.056 45.056 0 0 0 663.296 947.2h237.824a45.056 45.056 0 0 0 46.08-46.336V663.04a45.056 45.056 0 0 0-45.056-45.056zM122.88 995.584a94.72 94.72 0 0 1-94.72-94.72V663.04a94.72 94.72 0 0 1 94.72-94.72h238.336a94.464 94.464 0 0 1 94.208 94.72v237.824a94.72 94.72 0 0 1-94.72 94.72z m0-377.6A45.056 45.056 0 0 0 76.8 663.04v237.824A45.056 45.056 0 0 0 122.88 947.2h238.336a45.056 45.056 0 0 0 45.056-45.056V663.04a45.056 45.056 0 0 0-45.056-45.056z m540.416-162.304a94.72 94.72 0 0 1-94.72-94.72V123.136a94.72 94.72 0 0 1 94.72-94.72h237.824a95.488 95.488 0 0 1 94.72 94.72v237.824a94.72 94.72 0 0 1-94.72 94.72z m0-377.6a45.056 45.056 0 0 0-45.056 45.056v237.824a45.056 45.056 0 0 0 45.056 45.056h237.824A45.056 45.056 0 0 0 947.2 360.96V123.136a45.056 45.056 0 0 0-46.08-45.056zM122.88 455.68a94.72 94.72 0 0 1-94.72-94.72V123.136a94.72 94.72 0 0 1 94.72-94.72h238.336a94.464 94.464 0 0 1 94.208 94.72v237.824a94.72 94.72 0 0 1-94.72 94.72z m0-377.6A45.056 45.056 0 0 0 76.8 123.136v237.824a45.056 45.056 0 0 0 46.08 45.056h238.336a45.056 45.056 0 0 0 45.056-45.056V123.136a45.056 45.056 0 0 0-45.056-45.056z" fill="#1E1F1F" p-id="1399"></path></svg>
)

const IconPublished = () => (
    <svg t="1749574833810" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2296" width="20" height="20"><path d="M817.657468 775.758196 454.710202 664.079674l362.949312-418.788062-474.627834 418.788062L63.836911 552.403199 957.255877 77.775364 817.657468 775.758196 817.657468 775.758196zM454.710202 943.275467 454.710202 747.839333l111.673405 55.838749L454.710202 943.275467 454.710202 943.275467z" fill="#272636" p-id="2297"></path></svg>
)

const IconUnPublish = () => (
    <svg t="1749574692218" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1566" width="20" height="20"><path d="M864 825.792L448 693.632l416-495.36-544 495.36-320-132.16L1024 0l-160 825.792zM448 1024v-231.232l128 66.048L448 1024z" fill="#E8E8E8" p-id="1567"></path></svg>
)

const IconPending = () => (
    <svg t="1749574762256" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1931" width="20" height="20"><path d="M1021.72 463.41a7.91 7.91 0 1 0-15.72 1.49c1.47 15.56 2.21 31.41 2.21 47.1 0 273.6-222.59 496.19-496.19 496.19S15.81 785.6 15.81 512 238.4 15.81 512 15.81c148.76 0 286.89 66.81 381.56 183.59L747 207.58a7.9 7.9 0 0 0 0.43 15.79h0.45l161.81-9h0.18a5.27 5.27 0 0 0 0.71-0.18 7.35 7.35 0 0 0 1.58-0.41c0.24-0.09 0.53-0.09 0.76-0.2s0.25-0.22 0.4-0.3 0.16-0.13 0.24-0.18 0.48-0.18 0.69-0.34 0.29-0.37 0.47-0.54a5.5 5.5 0 0 0 0.61-0.47 6.07 6.07 0 0 0 0.45-0.74 8.11 8.11 0 0 0 0.76-1.26c0.09-0.21 0.27-0.37 0.35-0.59s0-0.55 0.12-0.82a7.53 7.53 0 0 0 0.23-1.58 5.36 5.36 0 0 0 0.1-0.7l-8.58-160.79a7.91 7.91 0 1 0-15.76 0.83l7.25 136.4C802.72 66.27 662.63 0 512 0 229.68 0 0 229.68 0 512s229.68 512 512 512 512-229.68 512-512c0-16.18-0.77-32.53-2.28-48.59z" p-id="1932" fill="#8a8a8a"></path><path d="M515.72 258.79a7.86 7.86 0 0 0-8.08 7.74l-7.09 323c0 0.15 0.07 0.27 0.08 0.42a7.36 7.36 0 0 0 0.29 1.61 8.65 8.65 0 0 0 0.39 1.37 7.52 7.52 0 0 0 0.81 1.26 7.76 7.76 0 0 0 0.93 1.19 8 8 0 0 0 1.16 0.81 7.41 7.41 0 0 0 1.45 0.82c0.13 0.05 0.23 0.16 0.37 0.21l311 100.63a7.9 7.9 0 1 0 4.86-15L516.49 584l7-317.14a7.93 7.93 0 0 0-7.77-8.07z" p-id="1933" fill="#8a8a8a"></path></svg>
) 
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
}
#react-waterfall-grid-comps li>div:hover {
  transform: translateY(-6px);
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.1);
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
#react-waterfall-grid-comps>li.show {
    transition: none !important;
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
    waterfallKey,
    ulMaxHRef,
    hasStatus,
    capsuleStatus,
    handleChangeStatus
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
                {hasStatus && <Radio.Group 
                        style={{
                            marginLeft: '10px',
                            position: 'absolute',
                            top: '-56px',
                            left: '380px',
                            zIndex: 999
                        }} 
                        value={capsuleStatus} 
                        onChange={e => handleChangeStatus(e.target.value)}
                    >
                        <Radio.Button className={styles['icon-button']} value=""><IconAll/></Radio.Button>
                        <Radio.Button className={styles['icon-button']} value="pending"><IconPending/></Radio.Button>
                        <Radio.Button className={styles['icon-button']} value="published"><IconPublished/></Radio.Button>
                        <Radio.Button className={styles['icon-button']} value="draft"><IconUnPublish/></Radio.Button>
                </Radio.Group>}
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
                                            <StarFilled onClick={() => { handleDelFavorite(favoritesMap[item?._id]?._id)}} style={starIconStyle} /> : 
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