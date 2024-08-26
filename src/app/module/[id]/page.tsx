"use client";
interface moduleParams{
    id:string
}

const Module=({params}:{params:moduleParams})=>{
    return(
        <>{params.id}</>
    );
}
export default Module;