'use client';
import ModalProvider from 'components/ModalProvider';
import Image from 'next/image';
import React, { useState } from 'react';
import { formatNumber } from 'utils/common';
import { VietQR } from 'vietqr';
const ButtonPayment = (props: { price: number }) => {
  const [show, setShow] = useState(false);
  const fee = 2; // %

  return (
    <>
      <button
        className="btn-primary md w-full"
        type="button"
        onClick={() => setShow(true)}
      >
        Mua ngay
      </button>
      <ModalProvider show={show} onClose={() => setShow(false)}>
        <div className="flex flex-col w-[35rem] p-4 pt-5 items-center">
          <div className="text-lg font-bold mb-8">Chuyển khoản ngân hàng</div>
          <div className="flex flex-col w-full items-center">
            <div className="flex flex-col items-center mb-8">
              <div className="rounded-lg p-1 border border-gray-300 shadow-sm">
                <Image
                  src={`https://api.vietqr.io/image/970415-0394032912-3UgHVvu.jpg?accountName=NGUYEN%20VAN%20THONG&amount=${props.price}&addInfo=JAPANESE%20EXAM`}
                  alt="qr"
                  width={200}
                  height={200}
                />
              </div>
              <div className="text-gray-500">Quét QR để thanh toán</div>
            </div>
            <div className="mb-8 text-base flex flex-col gap-4 w-full">
              <div className="flex items-center justify-between w-full">
                <div>Số tiền</div>
                <div className="text-gray-500">{formatNumber(props.price)}</div>
              </div>
              <div className="flex items-center justify-between w-full">
                <div>Phí</div>
                <div className="text-gray-500">{`${formatNumber(
                  (props.price * fee) / 100,
                )} (${fee}%)`}</div>
              </div>
              <div className="flex items-center justify-between w-full">
                <div>Số tiền</div>
                <div className="text-gray-500">{formatNumber(props.price)}</div>
              </div>
              <div className="flex items-center justify-between w-full">
                <div>Tổng</div>
                <div className="text-gray-800 font-bold">
                  {formatNumber(props.price * (1 + fee / 100))}
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between w-full">
                  <div>Nội dung</div>
                  <div className="text-gray-800 font-bold">20231511ABC</div>
                </div>
                <div className="text-yellow-300 text-[1.4rem]">
                  * Vui lòng chuyển đúng nội dung ở trên
                </div>
              </div>
            </div>
            <button
              type="button"
              className="btn-primary w-full"
              onClick={() => setShow(false)}
            >
              Đóng
            </button>
          </div>
        </div>
      </ModalProvider>
    </>
  );
};

export default ButtonPayment;
