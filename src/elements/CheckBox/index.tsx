import React from 'react';
import { useTranslation } from 'react-i18next';
import Checked from 'assets/svg/check.svg';
import UnChecked from 'assets/svg/square.svg';
import './style.scss';
import { isBlank } from 'utils/common';

interface Checkbox {
  selected?: boolean;
  label?: string;
  name?: string;
  className?: string;
  disabled?: boolean;
  innerHtml?: boolean;
  onChange?: (name?: string, value?: boolean) => void;
}

const Checkbox = (props: Checkbox) => {
  const { t } = useTranslation();

  return (
    <div
      className={`checkbox ${props.className ?? ''}`}
      onClick={event => {
        event.stopPropagation();
        console.log('props', props.selected);
        props.onChange?.(props.name, !Boolean(props.selected));
      }}
    >
      <button
        disabled={props.disabled}
        type="button"
        className={`square ${props.selected ? 'checked' : ''}`}
      >
        {props.selected && <Checked />}
      </button>
      {!isBlank(props.label) &&
        (props.innerHtml ? (
          <div
            className="label text-medium"
            dangerouslySetInnerHTML={{ __html: props.label ?? '' }}
          ></div>
        ) : (
          <div className="label text-medium">{t(props.label!)}</div>
        ))}
    </div>
  );
};

export default Checkbox;
