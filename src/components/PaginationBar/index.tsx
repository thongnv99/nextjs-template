import React from 'react';
import ChevronLeft from 'assets/svg/chevron-left.svg';
import ChevronRight from 'assets/svg/chevron-right.svg';

type Props = {
  totalPages: number;
  page: number;
  onChangePage?: (page: number) => void;
};

const PaginationBar = (props: Props) => {
  const decrementPage = () => {
    if (props.page - 1 >= 1) {
      props.onChangePage?.(props.page - 1);
    }
  };

  const incrementPage = () => {
    if (props.page + 1 >= props.totalPages) {
      props.onChangePage?.(props.page + 1);
    }
  };

  return (
    <div className="flex gap-4 justify-center py-4 items-center">
      <div
        className="cursor-pointer text-gray-500 hover:text-gray-900"
        onClick={decrementPage}
      >
        <ChevronLeft />
      </div>
      {new Array(props.totalPages).fill(1).map((_, idx) => (
        <div
          className={`${
            props.page === idx + 1 ? 'bg-[var(--primary-500)] text-white' : ''
          } border border-gray-200 rounded-md w-[3rem] cursor-pointer items-center justify-center flex aspect-square`}
          key={idx}
          onClick={() => props.onChangePage?.(idx + 1)}
        >
          {idx + 1}
        </div>
      ))}

      <div
        className="cursor-pointer text-gray-500 hover:text-gray-900"
        onClick={incrementPage}
      >
        <ChevronRight />
      </div>
    </div>
  );
};

export default PaginationBar;
