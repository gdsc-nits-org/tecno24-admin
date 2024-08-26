'use client';
interface eventParams{
    id:string
}
export const runtime = "edge";
const Event=({params}:{params:eventParams})=>{
    console.log(params.id);
    return(
        <>
            {params.id}
        </>
    );
}

export default Event;