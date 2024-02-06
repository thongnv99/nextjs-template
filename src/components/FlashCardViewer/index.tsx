'use client';
import React, { useEffect, useState } from 'react';
import './style.scss';
import { useKeenSlider, TrackDetails } from 'keen-slider/react';
import 'keen-slider/keen-slider.min.css';
import { IFlashCard } from 'interfaces';
import Left from 'assets/svg/chevron-left.svg';
import Right from 'assets/svg/chevron-right.svg';
import { useMutation } from 'hooks/swr';
import { FLASH_CARD_STATUS, METHOD } from 'global';

const FlipCard = ({ data }: { data: IFlashCard }) => {
  const [active, setActive] = useState(false);
  const [status, setStatus] = useState(data.status);
  const { trigger: updateFlashCard } = useMutation(
    'FLASH_CARD_UPDATE_FLASH_CARD',
    {
      url: '/api/v1/flashcards/{flashcardId}',
      method: METHOD.PUT,
      notification: {
        title: 'Cập nhật flash card',
        content: 'Cập nhật flash card thành công.',
      },
      onSuccess() {
        // props.onClose();
        // props.onRefresh();
      },
    },
  );

  const changeStatus = (status: FLASH_CARD_STATUS) => {
    console.log({
      status,
      flashcardId: data.id,
    });
    updateFlashCard({
      status,
      flashcardId: data.id,
    });
    setStatus(status);
  };
  const toggleActive = () => {
    setActive(!active);
  };

  return (
    <div className="bg-[#2B308B] rounded-2xl flex flex-col h-full w-full">
      <div
        className={`flip-card w-full cursor-pointer bg-[#2B308B] relative flex-1    ${
          active ? 'active' : ''
        }`}
        onClick={toggleActive}
      >
        <div className="flip-card-inner">
          <div
            className="flip-card-front text-[4rem] flex items-center justify-center rounded-2xl"
            dangerouslySetInnerHTML={{ __html: data.question }}
          ></div>
          <div
            className="flip-card-back text-[4rem] flex items-center justify-center rounded-2xl"
            dangerouslySetInnerHTML={{ __html: data.answer }}
          ></div>
        </div>
      </div>
      <div className="flex justify-center items-center gap-4 mt-8">
        <div
          className={`px-4 py-2 bg-gray-200 cursor-pointer rounded-sm ${
            status === FLASH_CARD_STATUS.REVIEW_AGAIN
              ? '!bg-yellow-500 text-white'
              : ''
          }`}
          onClick={() => changeStatus(FLASH_CARD_STATUS.REVIEW_AGAIN)}
        >
          Yêu thích
        </div>
        <div
          className={`px-4 py-2 bg-gray-200 cursor-pointer rounded-sm ${
            status === FLASH_CARD_STATUS.UNREVIEW
              ? '!bg-red-500 text-white'
              : ''
          }`}
          onClick={() => changeStatus(FLASH_CARD_STATUS.UNREVIEW)}
        >
          Chưa thuộc
        </div>
        <div
          className={`px-4 py-2 bg-gray-200 cursor-pointer rounded-sm ${
            status === FLASH_CARD_STATUS.REVIEWED
              ? '!bg-green-500 text-white'
              : ''
          }`}
          onClick={() => changeStatus(FLASH_CARD_STATUS.REVIEWED)}
        >
          Đã thuộc
        </div>
      </div>
      <div className="w-full p-2 flex items-center justify-center text-gray-100">
        Click để lật flashcard
      </div>
    </div>
  );
};

const FlashCardViewer = (props: {
  flashCards: IFlashCard[];
  currentIdx: number;
}) => {
  const [details, setDetails] = React.useState<TrackDetails | null>(null);

  const [sliderRef, instance] = useKeenSlider<HTMLDivElement>({
    loop: true,
    detailsChanged(s) {
      setDetails(s.track.details);
    },
    initial: props.currentIdx,
  });

  const scaleStyle = (idx: number) => {
    if (!details) return {};
    const slide = details.slides[idx];
    const scale_size = 0.7;
    const scale = 1 - (scale_size - scale_size * slide.portion);
    return {
      transform: `scale(${scale})`,
      WebkitTransform: `scale(${scale})`,
    };
  };

  const handleNext = () => {
    instance.current?.next();
  };

  const handlePrev = () => {
    instance.current?.prev();
  };

  return (
    <div className="flex flex-col gap-8">
      <div className=" relative">
        <div
          ref={sliderRef}
          className="keen-slider zoom-out !h-[60vh] !w-[60vw]"
        >
          {props.flashCards.map((data, idx) => (
            <div key={idx} className="keen-slider__slide zoom-out__slide ">
              <div className="h-full w-full absolute" style={scaleStyle(idx)}>
                <FlipCard data={data} />
              </div>
            </div>
          ))}
        </div>

        <div className="flex absolute top-full left-0 w-full gap-8 justify-center mt-4">
          <div
            className="h-[3rem] w-[3rem] cursor-pointer rounded-[50%] border text-white border-white flex items-center justify-center"
            onClick={handlePrev}
          >
            <Left />
          </div>
          <div
            className="h-[3rem] w-[3rem] cursor-pointer rounded-[50%] border text-white border-white flex items-center justify-center"
            onClick={handleNext}
          >
            <Right />
          </div>
        </div>
      </div>
    </div>
  );
};

export default FlashCardViewer;
