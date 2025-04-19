import React, { useState } from 'react';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

// 1. 正确定义拖拽项目类型
const ItemType = {
  GRID_ITEM: 'grid_item', // 使用更具体的类型名称
};

export const DropItem = ({ id, children, index, moveItem }) => {
  const ref = React.useRef(null);

  // 2. 确保使用正确的类型
  const [{ isDragging }, drag] = useDrag({
    type: ItemType.GRID_ITEM, // 使用定义的类型
    item: { type: ItemType.GRID_ITEM, id, index }, // 必须在item中包含type
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const [, drop] = useDrop({
    accept: ItemType.GRID_ITEM, // 使用相同的类型
    hover(item, monitor) {
      if (!ref.current) return;
      
      const dragIndex = item.index;
      const hoverIndex = index;

      if (dragIndex === hoverIndex) return;

      // 计算位置
      const hoverBoundingRect = ref.current.getBoundingClientRect();
      const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
      const clientOffset = monitor.getClientOffset();
      const hoverClientY = clientOffset.y - hoverBoundingRect.top;

      // 只在鼠标超过项目一半高度时移动
      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) return;
      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) return;

      moveItem(dragIndex, hoverIndex);
      item.index = hoverIndex;
    },
  });

  // 3. 正确连接drag和drop
  drag(drop(ref));

  return (
    <div
      ref={ref}
      style={{
        opacity: isDragging ? 0.5 : 1,
      }}
    >
      {children}
    </div>
  );
};

const GridContainer = () => {
  const [items, setItems] = useState([
    { id: 1, text: '项目 1' },
    { id: 2, text: '项目 2' },
    { id: 3, text: '项目 3' },
    { id: 4, text: '项目 4' },
    { id: 5, text: '项目 5' },
    { id: 6, text: '项目 6' },
  ]);

  const moveItem = (dragIndex, hoverIndex) => {
    const dragItem = items[dragIndex];
    const newItems = [...items];
    newItems.splice(dragIndex, 1);
    newItems.splice(hoverIndex, 0, dragItem);
    setItems(newItems.map((item, index) => ({ ...item, index }))); // 更新索引
  };

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: '16px',
        padding: '16px',
      }}
    >
      {items.map((item, index) => (
        <GridItem
          key={item.id}
          id={item.id}
          text={item.text}
          index={index}
          moveItem={moveItem}
        />
      ))}
    </div>
  );
};

export const DragDrop = ({children}) => {
  return (
    <DndProvider backend={HTML5Backend}>
        {children}
    </DndProvider>
  );
};

export default DragDrop;