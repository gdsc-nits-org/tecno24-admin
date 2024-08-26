'use client';
interface eventParams{
    id:string
}
const Event=({params}:{params:eventParams})=>{
    console.log(params.id);
    return(
        <>
            {params.id}
        </>
    );
}

export default Event;