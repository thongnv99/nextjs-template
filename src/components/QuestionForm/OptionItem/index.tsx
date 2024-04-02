'use client';
import Checkbox from 'elements/CheckBox';
import React from 'react';
import Editor from 'components/Editor';
import Delete from 'assets/svg/delete.svg';
import { useDrag, useDrop } from 'react-dnd';
import Drag from 'assets/svg/drag.svg';

interface OptionItemProps {
  checked?: boolean;
  onChangeChecked(checked?: boolean): void;
  id: string;
  idx: number;
  value: string;
  onChange(value: string): void;
  onDelete(): void;
  onMove(id: number, atIdx: number): void;
  findItem(id: string): number;
}
const OptionItem = (props: OptionItemProps) => {
  const [{ isDragging }, drag] = useDrag(
    () => ({
      type: 'OptionItem',
      item: { id: props.id, value: props.value },
      collect: monitor => ({
        isDragging: monitor.isDragging(),
      }),
    }),
    [props.id, props.value, props.onMove],
  );

  const [, drop] = useDrop(
    () => ({
      accept: 'OptionItem',
      hover({ id: fromId }: OptionItemProps) {
        if (fromId !== props.id) {
          const fromIdx = props.findItem(fromId);
          const toIdx = props.findItem(props.id);
          props.onMove(fromIdx, toIdx);
        }
      },
    }),
    [props.onMove, props.id, props.value],
  );

  const opacity = isDragging ? 0 : 1;
  return (
    <div ref={drop} style={{ opacity }} className="flex items-center gap-2">
      <div className="cursor-grab text-gray-500" ref={drag}>
        <Drag />
      </div>
      <Checkbox
        selected={props.checked}
        onChange={(_, value) => props.onChangeChecked(value)}
      />
      <div className="uppercase">{props.idx + 1}.</div>
      <div className="flex-1 min-h-[10rem] overflow-hidden">
        <Editor
          data={props.value}
          onChange={props.onChange}
          placeholder="Nhập đáp án"
        />
      </div>
      <Delete
        className="text-gray-500 cursor-pointer"
        onClick={props.onDelete}
      />
    </div>
  );
};

export default OptionItem;
