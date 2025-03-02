import { useRef, useEffect } from 'react';

export function useDebounce(callback, delay) {
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
