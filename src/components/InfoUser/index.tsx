import User from 'assets/svg/user.svg';
import React, { useEffect } from 'react';
interface EmailName {
  name: string;
  email: string;
}
const InfoUser = (props: EmailName) => {
  return (
    <div className="flex gap-x-2 items-center">
      <div className="flex items-center rounded-full bg-[var(--gray-50)] p-2">
        <User />
      </div>
      <div className="">
        <p className="leading-normal ">{props?.name}</p>
        <p className="leading-normal  text-[var(--gray-500)]">{props?.email}</p>
      </div>
    </div>
  );
};
export default InfoUser;
