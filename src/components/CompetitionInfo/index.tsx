const CompetitionInfo=()=>{
    return (
        <div className="flex gap-x-10 items-center">
            <div>
            <div className="flex flex-col items-center">
                <p className="text-[2.4rem]">100</p>
                <p className="text-[var(--gray-300)] text-[1.2rem]">Người tham gia</p>
            </div>
            <div className="flex flex-col items-center">
                <p className="text-[2.4rem]">30</p>
                <p className="text-[var(--gray-300)] text-[1.2rem]">Đạt điểm khá</p>
            </div>
            </div>
            <div >
            <div className="flex flex-col items-center">
                <p className="text-[2.4rem]">30</p>
                <p className="text-[var(--gray-300)] text-[1.2rem]">Đạt điểm trung bình</p>
            </div>
            <div className="flex flex-col items-center">
                <p className="text-[2.4rem]">40</p>
                <p className="text-[var(--gray-300)] text-[1.2rem]">Đạt điểm giỏi</p>
            </div>
            </div>
        </div>
        
    )
}
export default CompetitionInfo