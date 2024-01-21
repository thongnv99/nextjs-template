import Plus from 'assets/svg/plus.svg';
import Calendar from 'assets/svg/calendar.svg';
import Checkcircle from 'assets/svg/check-circle.svg'
import Alertcircle from 'assets/svg/alert-circle.svg';;
import { COMPETITION_STATUS } from 'global';
interface CompetitionProps {
  competition: {
    id: number;
    time: string;
    status: string;
  };
}

const CompetitionStart = ({competition}:CompetitionProps) => {
  return (
    <div className="p-1 w-full border border-gray-200 rounded-lg max-w-screen-lg flex justify-between my-2">
      <div className="flex gap-x-10">
        <div className="text-6xl text-[var(--gray-300)] font-['Inter'] my-auto">
          {/* {props.id} */}
        </div>
        <div>
          <p className="text-sm font-medium text-[var(--brand-800)] font-['Inter']">
            Tiêu đề cuộc thi
          </p>
          <p className="text-[var(--black-80)] font-['Quicksand'] flex items-center gap-x-1">
            <Calendar />
            15/11/2023 - 16/11/2023
          </p>
        </div>
      </div>
      {
        COMPETITION_STATUS.HAPPENNING===competition.status ?( <div className="flex items-center gap-x-2 ">
        <button type="button" className="btn-processing btn-icon text-base hover:cursor-default">
          <Checkcircle /> Đang diễn ra
        </button>
        <button type="button" className="btn-join btn-icon ">
          Tham gia thi
        </button>
      </div>):( <div className="flex items-center  gap-x-2">
        <button
          type="button"
          className="!text-[var(--error-600)] btn btn-icon text-base font-['Inter'] !bg-[var(--error-100)] hover:cursor-default"
        >
          <Alertcircle /> Đã kết thúc
        </button>
      </div>)
      }
      
    </div>
  );
};
export default CompetitionStart;
