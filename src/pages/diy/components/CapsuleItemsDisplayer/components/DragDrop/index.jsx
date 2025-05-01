import React from 'react';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

const ItemType = {
  GRID_ITEM: 'grid_item',
};

export const DropItem = ({ id, children, index, moveItem }) => {
  const ref = React.useRef(null);

  const [{ isDragging }, drag] = useDrag({
    type: ItemType.GRID_ITEM,
    item: { type: ItemType.GRID_ITEM, id, index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const [{ isOver }, drop] = useDrop({
    accept: ItemType.GRID_ITEM,
    hover(item, monitor) {
      if (!ref.current) return;

      const dragIndex = item.index;
      const hoverIndex = index;
      if (dragIndex === hoverIndex) return;

      // 获取当前元素的边界信息和鼠标位置
      const hoverBoundingRect = ref.current.getBoundingClientRect();
      const clientOffset = monitor.getClientOffset();

      // 计算元素中心点
      const hoverMiddleX = (hoverBoundingRect.right - hoverBoundingRect.left) / 2;
      const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;

      // 计算鼠标相对于元素的位置
      const hoverClientX = clientOffset.x - hoverBoundingRect.left;
      const hoverClientY = clientOffset.y - hoverBoundingRect.top;

      // 方向判断：确定是横向还是纵向移动
      // 优先判断横向（Grid布局需要）
      const isMovingRight = dragIndex < hoverIndex;
      const isMovingLeft = dragIndex > hoverIndex;

      // 横向拖动逻辑
      if (Math.abs(hoverClientX - hoverMiddleX) > Math.abs(hoverClientY - hoverMiddleY)) {
        if (isMovingRight && hoverClientX < hoverMiddleX) return;
        if (isMovingLeft && hoverClientX > hoverMiddleX) return;
      } 
      // 纵向拖动逻辑
      else {
        if (isMovingRight && hoverClientY < hoverMiddleY) return;
        if (isMovingLeft && hoverClientY > hoverMiddleY) return;
      }

      // 执行移动
      moveItem(dragIndex, hoverIndex);
      item.index = hoverIndex;
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  });

  drag(drop(ref));

  return (
    <div
      ref={ref}
      style={{
        opacity: isDragging ? 0.5 : 1,
        backgroundColor: isOver ? 'rgba(0, 135, 255, 0.1)' : 'transparent',
        transition: 'all 0.2s ease',
        cursor: 'move',
      }}
    >
      {children}
    </div>
  );
};

export const DragDrop = ({ children }) => {
  return <DndProvider backend={HTML5Backend}>{children}</DndProvider>;
};