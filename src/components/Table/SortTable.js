import React from 'react';
import { Table } from 'antd';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

const DraggableBodyRow = ({ index, moveRow, ...restProps }) => {
  const ref = React.useRef(null);
  
  const [{ isOver, dropClassName }, drop] = useDrop({
    accept: 'DraggableBodyRow',
    collect: (monitor) => {
      const { index: dragIndex } = monitor.getItem() || {};
      if (dragIndex === index) {
        return {};
      }
      return {
        isOver: monitor.isOver(),
        dropClassName: dragIndex < index ? 'drop-over-downward' : 'drop-over-upward',
      };
    },
    drop: (item) => {
      moveRow(item.index, index);
      item.index = index;
    },
  });

  const [, drag] = useDrag({
    type: 'DraggableBodyRow',
    item: { index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  drop(drag(ref));

  return (
    <tr
      ref={ref}
      className={`${restProps.className} ${isOver ? dropClassName : ''}`}
      style={{ cursor: 'move', ...restProps.style }}
      {...restProps}
    />
  );
};

const DragSortingTable = ({ dataSource, columns, size = 'middle', title, onMoveArray }) => {
  const moveRow = (dragIndex, hoverIndex) => {
    onMoveArray({ dragIndex, hoverIndex });
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <Table
        title={() => <b>{title}</b>}
        columns={columns}
        dataSource={dataSource}
        components={{
          body: {
            row: DraggableBodyRow,
          },
        }}
        onRow={(record, index) => ({
          index,
          moveRow,
        })}
        pagination={false}
        size={size}
      />
    </DndProvider>
  );
};

export default DragSortingTable;