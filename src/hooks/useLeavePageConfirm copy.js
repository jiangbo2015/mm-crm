// hooks/useEnhancedLeaveGuard.ts
import { useEffect } from 'react';
import { history } from 'umi';

// interface LeaveGuardOptions {
//   enabled: boolean;
//   onBeforeLeave?: () => boolean | Promise<boolean>;
//   message?: string;
//   useBrowserPrompt?: boolean;
//   useRouteBlock?: boolean;
// }

/**
 * 增强版离开页面守卫 Hook
 * @param options 配置选项
 */
export function useEnhancedLeaveGuard(options) {
  const {
    enabled,
    onBeforeLeave,
    message = '您有未保存的更改，确定要离开吗？',
    useBrowserPrompt = true,
    useRouteBlock = true,
  } = options;

  useEffect(() => {
    if (!enabled) return;

    // 处理浏览器标签关闭/刷新
    const handleBeforeUnload = (e) => {
      if (useBrowserPrompt) {
        e.preventDefault();
        e.returnValue = message;
        return e.returnValue;
      }
    };

    // 处理路由跳转
    const unblock = useRouteBlock 
      ? history.block(async (location) => {
          if (!enabled) return true;
          
          if (onBeforeLeave) {
            const canLeave = await Promise.resolve(onBeforeLeave());
            return canLeave;
          }
          
          return confirm(message);
        })
      : () => {};

    if (useBrowserPrompt) {
      window.addEventListener('beforeunload', handleBeforeUnload);
    }

    return () => {
      if (useBrowserPrompt) {
        window.removeEventListener('beforeunload', handleBeforeUnload);
      }
      unblock();
    };
  }, [enabled, message, onBeforeLeave, useBrowserPrompt, useRouteBlock]);
}