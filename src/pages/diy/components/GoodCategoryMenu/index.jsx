import React,{ useEffect } from 'react';
import { forEach, map,filter,isEmpty, cloneDeep } from 'lodash'
// import { useIntl } from 'umi'
import { useSelector, useDispatch } from '@/hooks/useDvaTools'
import useDiy from '../../hooks/useDiy'
import styles from './index.less'

function filterGoods(capsuleItems, goods) {
    // 提取所有在 capsuleItems 中出现的 goodsId 和 categoryId
    const goodsIds = new Set();
    const categoryIds = new Set();

    forEach(capsuleItems, item => {
        if (item.type === "style" && item.style) {
            forEach(item.style.goodsId, id => goodsIds.add(id));
            forEach(item.style.categoryId, id => categoryIds.add(id));
        }

    });

    const clonedGoods = cloneDeep(goods);
    // 过滤 goods，只保留在 capsuleItems 中出现的 goodsId 和 categoryId
    const filteredGoods = filter(clonedGoods, good => {
        // 检查 goodsId 是否在 capsuleItems 中出现
        if (goodsIds.has(good._id)) {
            // 过滤 category，只保留在 capsuleItems 中出现的 categoryId
            good.category = filter(good.category, cat => categoryIds.has(cat._id));
            return !isEmpty(good.category); // 如果 category 被过滤后为空，则排除该 good
        }
        return false;
    });

    return filteredGoods;
}



export default () => {
    const {
        handleSelectGoodId,
        handleSelectGoodCategryId,
        goods,
        selectedGoodId,
        selectedGoodCategryId,
        originCapsuleItems
    } = useDiy()
    const filteredGoods = filterGoods(originCapsuleItems, goods);
    // const {locale,formatMessage } = useIntl()
    const locale = 1;
    return (
        <div className={styles['good-category-menu']}>
                {map(filteredGoods, (item, i) => (
                    <div key={`${i}-${item._id}`}>
                        <div
                            style={{
                                fontSize: '18px',
                                color: selectedGoodId === item._id ? '#1890FF' : '#000',
                                padding: '8px 0',
                                cursor: 'pointer',
                            }}
                            onClick={() => {
                                if(selectedGoodId === item._id ) {
                                    handleSelectGoodId(undefined);
                                } else {
                                    handleSelectGoodId(item._id);
                                }
                                
                                handleSelectGoodCategryId(undefined);
                            }}
                        >
                            {locale === 'en-US'? item.aliasName : item.name}
                        </div>
                        {Array.isArray(item.category)
                            ? item.category.map(c => (
                                <div
                                    key={c._id}
                                    style={{
                                        fontSize: '15px',
                                        color: selectedGoodCategryId === c._id ? '#1890FF' : '#000',
                                        padding:  '8px 0',
                                        paddingLeft: '10px',
                                        cursor: 'pointer',
                                    }}
                                    onClick={() => {
                                        if(selectedGoodCategryId === c._id) {
                                            handleSelectGoodId(undefined);
                                            handleSelectGoodCategryId(undefined);
                                        } else {
                                            handleSelectGoodId(item._id);
                                            handleSelectGoodCategryId(c._id);
                                        }
                                        
                                    }}
                                >
                                    -{locale === 'en-US'? c.nameen : c.name}
                                </div>
                            ))
                            : null}
                    </div>
                ))}
        </div>

    );
};
