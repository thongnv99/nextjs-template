import { ICellRendererParams } from 'ag-grid-community';
import React from 'react';

interface ButtonCell extends ICellRendererParams {
  buttons?: Array<{
    render: React.FunctionComponent<{ onClick(): void; className?: string }>;
    onClick: (data?: Record<string, unknown>) => void;
    hide?: (data?: Record<string, unknown>) => boolean;
  }>;
}
const ButtonCell = (props: ButtonCell) => {
  return (
    <div className="flex gap-4">
      {props.buttons?.map((item, idx) => {
        if (item.hide?.(props.data)) {
          return null;
        }
        return (
          <div key={idx}>
            {
              <item.render
                onClick={() => item.onClick(props.data)}
              ></item.render>
            }
          </div>
        );
      })}
    </div>
  );
};

export default ButtonCell;
