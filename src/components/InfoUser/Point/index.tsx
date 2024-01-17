import React from "react";
import './style.scss';
interface Point{
    point:number,
} 
const InfoUserPoint=(props:Point)=>{
    return (
        <div className="flex items-center gap-x-2">
        <div className="progress rounded-full w-60" role="progressbar" aria-label="Success example" aria-valuenow={props.point} aria-valuemin={0} aria-valuemax={100}>
            <div className="progress-bar bg-success" style={{ width: `${props.point}%` }}>123</div>
            
        </div>
        <span>{props.point}</span>
        </div>
    )
}
export default InfoUserPoint