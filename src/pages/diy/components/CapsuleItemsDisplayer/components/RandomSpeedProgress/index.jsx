import React, { useState, useEffect } from 'react';
import { Progress } from 'antd';

const RandomSpeedProgress = () => {
  const [percent, setPercent] = useState(0);
  const duration = 10000; // 10秒总时长(毫秒)
  const startTime = React.useRef(null);
  const lastUpdateTime = React.useRef(0);
  const remainingPercent = React.useRef(100);

  useEffect(() => {
    startTime.current = Date.now();
    lastUpdateTime.current = startTime.current;
    remainingPercent.current = 100;

    const updateProgress = () => {
      const now = Date.now();
      const elapsed = now - startTime.current;
      
      if (elapsed >= duration) {
        setPercent(100);
        return;
      }

      // 计算剩余时间和剩余百分比
      const remainingTime = duration - elapsed;
      const timeSinceLastUpdate = now - lastUpdateTime.current;
      
      // 随机决定这次更新要增加多少百分比 (0.1%到3%之间)
      const randomIncrement = Math.random() * 2.9 + 0.1;
      const increment = Math.min(randomIncrement, remainingPercent.current);
      
      setPercent(prev => {
        const newPercent = prev + increment;
        remainingPercent.current = 100 - newPercent;
        return newPercent;
      });

      // 计算下一次更新的时间间隔 (100ms到500ms之间随机)
      const nextInterval = Math.random() * 400 + 100;
      
      lastUpdateTime.current = now;
      setTimeout(updateProgress, nextInterval);
    };

    updateProgress();

    return () => clearTimeout(updateProgress);
  }, []);

  return (
    <div style={{ width: '80%', margin: '50px auto' , color:"#000"}}>
      <p>图片生成中，请稍等片刻......</p>
      <Progress 
        percent={percent} 
        strokeColor="#000"
        status="active"
        showInfo={false}
      />
      <p>当前进度: {percent.toFixed(1)}%</p>
    </div>
  );
};

export default RandomSpeedProgress;