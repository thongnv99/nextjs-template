import { METHOD } from 'global';
import React from 'react';
import { fetcher } from 'utils/restApi';
import CheckIcon from 'assets/svg/check-icon.svg';
import PremiumIcon from 'assets/svg/premium-icon.svg';
import { formatNumber } from 'utils/common';
import ButtonPayment from 'components/ButtonPayment';
import { PaymentPackageRes } from 'interfaces';
import { getPaymentPackages } from 'services/common';

const features = ['Làm bài thi', 'flash card', 'Viết blog'];

const PaymentPage = async () => {
  const packages = await getPaymentPackages();
  return (
    <div className="w-full h-full flex flex-col items-center justify-center m-auto max-w-screen-lg">
      <div className="text-lg text-primary-500 mb-12">Thanh toán</div>
      <div className="flex">
        {packages.map(item => (
          <div
            key={item.id}
            className=" rounded-3xl border border-gray-200 p-8 flex flex-col items-center"
          >
            <div className="mb-5">
              <PremiumIcon />
            </div>
            <div className="text-xl font-bold text-primary-700 ">
              {item.name}
            </div>
            <div className="text-base flex items-center mt-2 -mb-2">
              <div className="text-base text-gray-500 line-through mr-2">
                {formatNumber(item.price)} VNĐ
              </div>
              <div className=" h-8 flex leading-[100%]  items-center rounded-[1.6rem] px-2 bg-primary-50 text-primary-700">
                {' '}
                Giảm {item.discount}%
              </div>
            </div>
            <div className="text-[4.8rem] font-bold text-gray-900 mb-2">
              {formatNumber(item.price * (1 - (item.discount ?? 0)))} VNĐ
            </div>
            <div className="py-8 w-full flex flex-col gap-4">
              {features.map((feature, idx) => (
                <div key={idx} className="flex gap-3">
                  <CheckIcon />
                  <div className="text-base text-gray-500">{feature}</div>
                </div>
              ))}
            </div>
            <ButtonPayment price={item.price} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default PaymentPage;
