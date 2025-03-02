import { useEffect, useState, useRef } from 'react';
import { getDvaApp } from 'umi';
import { isEqual } from 'lodash'; // 用于深比较

// 实现 useDispatch
export function useDispatch() {
  return getDvaApp()._store.dispatch;
}

/**
 * 自定义 useSelector Hook
 * @param {Function} selector - 从状态中提取值的函数
 * @param {Function} [equalityFn=isEqual] - 比较函数，默认为深比较
 * @returns {any} - 提取的状态值
 */
export function useSelector(selector, equalityFn = isEqual) {
  const store = getDvaApp()._store; // 获取 dva 的 store
  const [state, setState] = useState(() => selector(store.getState())); // 初始化状态
  const selectorRef = useRef(); // 缓存 selector 函数
  const stateRef = useRef(); // 缓存上一次的状态值
  const equalityFnRef = useRef(); // 缓存比较函数

  // 更新 ref 的值
  selectorRef.current = selector;
  stateRef.current = state;
  equalityFnRef.current = equalityFn;

  useEffect(() => {
    // 定义状态变化时的回调函数
    const checkForUpdates = () => {
      const newState = selectorRef.current(store.getState()); // 获取最新的状态
      // 如果状态发生变化，则更新组件状态
      if (!equalityFnRef.current(newState, stateRef.current)) {
        stateRef.current = newState; // 更新上一次的状态
        setState(newState); // 触发组件重新渲染
      }
    };

    // 订阅状态变化
    const unsubscribe = store.subscribe(checkForUpdates);
    // 初始化时检查一次状态
    checkForUpdates();

    // 组件卸载时取消订阅
    return () => unsubscribe();
  }, [store]);

  return state; // 返回当前的状态
}
