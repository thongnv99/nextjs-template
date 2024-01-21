
const GroupButton=()=>{
    return(
        <div className="flex">
            <button type="button" className="btn !border-r-0 !rounded-tr-none !rounded-br-none">View all</button>
            <button type="button" className="btn !rounded-none">Monitored</button>
            <button type="button" className="btn !border-l-0  !rounded-tl-none !rounded-bl-none">Text</button>
        </div>
    )
}
export default GroupButton