import React from 'react';
import { useTranslation } from 'react-i18next';
import Checked from 'assets/svg/check.svg';
import UnChecked from 'assets/svg/square.svg';
import './style.scss';

interface Checkbox {
  selected?: boolean;
  label: string;
  name?: string;
  className?: string;
  onChange(name?: string, value?: boolean): void;
}

const Checkbox = (props: Checkbox) => {
  const { t } = useTranslation();

  const onChange: React.MouseEventHandler<HTMLDivElement> = event => {
    event.stopPropagation();
    props.onChange(props.name, !Boolean(props.selected));
  };
  return (
    <div className={`checkbox ${props.className ?? ''}`} onClick={onChange}>
      <button className={`square ${props.selected ? 'checked' : ''}`}>
        {props.selected && <Checked />}
      </button>
      <div className="label text-medium">{t(props.label)}</div>
    </div>
  );
};

export default Checkbox;
