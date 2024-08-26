"use client";
interface moduleParams{
    id:string
}
export const runtime = "edge";

const Module=({params}:{params:moduleParams})=>{
    return(
        <>{params.id}</>
    );
}
export default Module;