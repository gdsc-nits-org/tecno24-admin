'use client';
const Event=({params}:{params:any})=>{
    console.log(params.id);
    return(
        <>
            {params.id}
        </>
    );
}

export default Event;