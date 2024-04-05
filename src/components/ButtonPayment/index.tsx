'use client';
import ModalProvider from 'components/ModalProvider';
import { usePaymentMethod } from 'hooks/common';
import Image from 'next/image';
import React, { useEffect, useRef, useState } from 'react';
import { formatNumber, isBlank, uuid } from 'utils/common';
import { VietQR } from 'vietqr';
import { usePaymentCodeMutation, usePaymentPaidMutation } from './mutations';
import Loader from 'components/Loader';
const ButtonPayment = (props: { price: number }) => {
  const [show, setShow] = useState(false);
  const [isConfirm, setIsConfirm] = useState(false); // đã xác nhận thanh toán hay chưa
  const [qrCode, setQrCode] = useState('');
  const fee = 2; // %
  const componentId = useRef(uuid());
  const { data: paymentMethods } = usePaymentMethod();
  const { trigger: confirmPaid } = usePaymentPaidMutation(
    componentId.current,
    () => setShow(false),
  );
  const {
    trigger: getPaymentCode,
    reset,
    data: paymentCodeRes,
  } = usePaymentCodeMutation(componentId.current);
  useEffect(() => {
    if (show) {
      setIsConfirm(false);
    }
  }, [show]);

  const handleQr = async () => {
    const vietQR = new VietQR({
      clientID: 'de8a0804-a76d-41e5-8ad6-31503ce7d5f4',
      apiKey: '17c29f09-4ea2-4417-b9c2-7f020d35de42',
    });
    const bankInfo = paymentMethods?.items[0].params.banks?.[0];
    const res = await getPaymentCode({
      packageId: '6571f27010e06d02e39ce5a1',
      paymentMethodId: '657426ae8a4cb7ec76676a43',
    });

    const paymentCode = res?.paymentCode;

    if (bankInfo) {
      try {
        const res = await vietQR.genQRCodeBase64({
          bank: bankInfo.bankCode,
          accountName: bankInfo.accountName,
          accountNumber: bankInfo.accountNumber,
          amount: props.price,
          memo: paymentCode,
        });
        const qrCode = res.data?.data?.qrDataURL;
        setQrCode(qrCode);
      } catch (error) {}
    }
    setIsConfirm(true);
  };

  const handleConfirmPaid = () => {
    confirmPaid({ id: paymentCodeRes?.id });
  };

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
        <Loader
          id={componentId.current}
          className="flex flex-col w-[50rem] p-4 pt-5 items-center"
        >
          <div className="text-lg font-bold mb-8">
            {isConfirm ? 'Chuyển khoản ngân hàng' : 'Xác nhận thanh toán'}
          </div>
          <div className="flex flex-col w-full items-center">
            {isConfirm && (
              <div className="flex flex-col items-center mb-8">
                <div className="rounded-lg p-1 border border-gray-300 shadow-sm">
                  <Image
                    src={
                      !isBlank(qrCode)
                        ? qrCode
                        : `https://api.vietqr.io/image/970415-0394032912-3UgHVvu.jpg?accountName=NGUYEN%20VAN%20THONG&amount=${props.price}&addInfo=JAPANESE%20EXAM`
                    }
                    alt="qr"
                    width={200}
                    height={200}
                  />
                </div>
                <div className="text-gray-500">Quét QR để thanh toán</div>
              </div>
            )}
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
              {isConfirm && (
                <div>
                  <div className="flex items-center justify-between w-full">
                    <div>Nội dung</div>
                    <div className="text-gray-800 font-bold">
                      {paymentCodeRes?.paymentCode}
                    </div>
                  </div>
                  <div className="text-green-700 text-[1.4rem]">
                    * Yêu cầu thanh toán đã được gửi đi thành công. Vui lòng
                    chuyển khoản với nội dung ở trên. Xác nhận chuyển khoản và
                    chờ nhân viên xác nhận!
                  </div>
                </div>
              )}
            </div>
            <div className="flex flex-col gap-3 w-full">
              {isConfirm ? (
                <button
                  type="button"
                  className="btn-primary "
                  onClick={handleConfirmPaid}
                >
                  Xác nhận chuyển khoản
                </button>
              ) : (
                <button
                  type="button"
                  className="btn-primary "
                  onClick={handleQr}
                >
                  Xác nhận thanh toán
                </button>
              )}
              <button
                type="button"
                className="btn "
                onClick={() => setShow(false)}
              >
                Đóng
              </button>
            </div>
          </div>
        </Loader>
      </ModalProvider>
    </>
  );
};

export default ButtonPayment;
