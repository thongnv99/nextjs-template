import { IQuestion } from 'interfaces';
import React from 'react';
import Drag from 'assets/svg/drag.svg';
import { useDrag, useDrop } from 'react-dnd';
import QuestionItem from 'components/QuestionItem';
interface QuestionDndProps {
  idx: number;
  data: IQuestion;
  onDelete(): void;
  onMove(id: number, atIdx: number): void;
  findItem(id: string): number;
}

const QuestionDnd = (props: QuestionDndProps) => {
  const [{ isDragging }, drag] = useDrag(
    () => ({
      type: 'QuestionDnd',
      item: props.data,
      collect: monitor => ({
        isDragging: monitor.isDragging(),
      }),
    }),
    [props.data, props.onMove],
  );

  const [, drop] = useDrop(
    () => ({
      accept: 'QuestionDnd',
      hover({ id: fromId }: IQuestion) {
        if (fromId !== props.data.id) {
          const fromIdx = props.findItem(fromId);
          const toIdx = props.findItem(props.data.id);
          props.onMove(fromIdx, toIdx);
        }
      },
    }),
    [props.onMove, props.data],
  );
  const opacity = isDragging ? 0 : 1;

  return (
    <div ref={drop} style={{ opacity }} className="flex items-center gap-4">
      <QuestionItem
        data={props.data}
        showDelete
        hideAction
        onDelete={props.onDelete}
      />
      <div className="cursor-grab text-gray-500" ref={drag}>
        <Drag />
      </div>
    </div>
  );
};

export default QuestionDnd;
