// hooks/useLeavePageConfirm.ts
import { useEffect } from 'react';
import { history } from 'umi';

/**
 * 离开页面确认提示 Hook
 * @param enabled 是否启用提示
 * @param message 提示消息（浏览器可能忽略自定义消息）
 */
export function useLeavePageConfirm(enabled, message = '您有未保存的更改，确定要离开吗？') {
  useEffect(() => {
    if (!enabled) return;

    // 处理浏览器标签关闭/刷新
    const handleBeforeUnload = (e) => {
      e.preventDefault();
      e.returnValue = message;
      return e.returnValue;
    };

    // 处理路由跳转
    const unblock = history.block((location) => {
      if (enabled) {
        return confirm(message);
      }
      return true;
    });

    window.addEventListener('beforeunload', handleBeforeUnload);
    
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      unblock();
    };
  }, [enabled, message]);
}