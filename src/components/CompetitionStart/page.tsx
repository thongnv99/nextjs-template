import Plus from 'assets/svg/plus.svg';
import Calendar from 'assets/svg/calendar.svg';
import Checkcircle from 'assets/svg/check-circle.svg';
const CompetitionStart = () => {
  return (
    <div className="p-1 w-full border border-gray-200 rounded-lg max-w-screen-lg flex justify-between my-2">
      <div className="flex gap-x-10">
        <div className="text-6xl text-[var(--gray-300)] font-['Inter'] my-auto">
          1
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
      <div className="flex items-center gap-x-2 ">
        <button type="button" className="btn-processing btn-icon text-base">
          <Checkcircle /> Đang diễn ra
        </button>
        <button type="button" className="btn-join btn-icon">
          Tham gia thi
        </button>
      </div>
    </div>
  );
};
export default CompetitionStart;
