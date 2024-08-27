"use client";
import { useState,useEffect } from "react";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
  } from "../../../components/ui/card"

  import {
    Popover,
    PopoverContent,
    PopoverTrigger,
  } from "../../../components/ui/popover";
  
import Link from "next/link";
import axios from "axios";


import { useAuthState } from 'react-firebase-hooks/auth';
import { useIdToken } from "react-firebase-hooks/auth";
import { auth } from "../../utils/firebase";



interface moduleParams{
    id:string
}


export const runtime = "edge";
const Module=({params}:{params:moduleParams})=>{
    const [user, loading, error] = useAuthState(auth);
    const [userIdToken, loadingToken, errorToken] = useIdToken(auth);
    const [module,setModule]=useState("My module");
    const [name,setName]=useState("abce");
    const [description,setDescription]=useState("");
    const [maxTeamSize,setMaxTeamSize]=useState("");
    const [minTeamSize,setMinTeamSize]=useState("");
    const [posterImage,setPosterImage]=useState("abce");
    const [prizeDescription,setPrizeDescription]=useState("fdadf");
    const [stagesDescription,setStagesDescription]=useState("fdfa");
    const [venue,setVenue]=useState("NIT Silchar");
    const [lat,setLat]=useState("abce");
    const [lng,setLng]=useState("abce");
    const [registrationStartTime,setRegistrationStartTime]=useState("Tue Aug 16 2022 18:47:42 GMT+0530 (India Standard Time)");
    const [registrationEndTime,setRegistrationEndTime]=useState("Tue Aug 16 2022 18:47:42 GMT+0530 (India Standard Time)");
    const [extraQuestions,setExtraQuestions]=useState([{ question: "What is your favorite color?", answer: "Blue" },
        { question: "What is your pet's name?", answer: "Max" }]);

    const [events,setEvents]=useState([
        {
            id:1,
            name:"Event 1",
            description:"Some Description About Event",
            destination:"/event/1"
        },
        {
            id:2,
            name:"Event 2",
            description:"Some Description About Event 2",
            destination:"/event/2"
        }
    ]);
    const [neweventtype,setNeweventype]=useState("solo");
    const createEvent=async(e: React.FormEvent<HTMLButtonElement>)=>{
        e.preventDefault();
        try{
            console.log("Start");
            const createEvnt=await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/event/create`,{
                    moduleId:params.id,
                    name: name,
                    posterImage: "posterImage",
                    maxTeamSize:Number(maxTeamSize),
                    minTeamSize:Number(minTeamSize),
                    attendanceIncentive: 1,
                    registrationIncentive: 1,
                    prizeDescription: "prizeDescription",
                    stagesDescription: "stagesDescription",
                    description: description,
                    venue: "venue",
                    lat: "24.7560907",
                    lng: "92.7823423",
                    registrationStartTime: "2024-08-27T15:30:00",
                    registrationEndTime: "2024-08-27T15:30:00",
                    extraQuestions: []  
                },
                {
                    headers: {
                        Authorization: `Bearer 1000000` // Add your token here
                    }
                }
                
             );
             console.log(createEvnt);
        }
        catch (error:any) {
            console.error('Error creating event:', error.response ? error.response.data : error.message);
        }
    }
    return(
        <div className='bg-[#000000] text-[#ffffff] min-h-[100vh] flex flex-col items-center justify-start'>
            <div className='w-[50vw] text-center'>
                <div className='pt-[4rem]'>
                    <h1 className='text-[2rem]'>{module}</h1>
                </div>
                <div className='flex flex-wrap items-center'>
                    {events.map((item,i)=>
                        <Link href={item.destination} key = {i} className="m-4">
                            <Card className='p-[1rem] bg-[transparent]'>
                                <CardHeader className="text-[#ffffff]">{item.name}</CardHeader>
                                <CardDescription>
                                    {item.description}
                                </CardDescription>
                            </Card>
                        </Link>
                    )
                    }
                    <Popover>
                        <PopoverTrigger asChild>
                            <button className='p-4 text-[4rem]'>+</button>
                        </PopoverTrigger>
                        <PopoverContent className="w-80">
                            <div className='flex flex-col items-start'>
                                <label className="text-[0.6rem]">Enter Event Name</label>
                                <input type="text" onChange={(e)=>setName(e.target.value)} value={name}  className="border-b-2 border-[#000000] bg-[transparent] "/>
                           </div>
                           <div className='flex flex-col items-start'>
                                <label className="text-[0.6rem]">Description about the event</label>
                                <textarea className="border-2 border-[#000000] bg-[transparent]" onChange={(e)=>setDescription(e.target.value)} value={description} ></textarea>
                           </div>
                           <div className='flex flex-col items-start'>
                                <label className="text-[0.6rem]">Type of event</label>
                                <div className="flex flex-row"><input type="radio" name="eventype" id="solo" onClick={()=>setNeweventype("solo")}  /><label>Solo</label></div>
                                <div className="flex flex-row"><input type="radio" name="eventype" id="group" onClick={()=>setNeweventype("group")} /><label>Group</label></div>
                           </div>
                           {/* <div className='flex flex-row'>
                            <label>Registration Start</label>
                            <input type="datetime-local" value={registrationStartTime} onChange={(e)=>setRegistrationStartTime(e.target.value)}/>
                           </div>
                           <div className='flex flex-row'>
                            <label>Registration End</label>
                            <input type="datetime-local" value={registrationEndTime} onChange={(e)=>setRegistrationEndTime(e.target.value)}/>
                           </div> */}
                           {
                            neweventtype==="group"?
                            <div className='flex flex-col items-start'>
                               <div className="flex flex-row"><label>Minimum member(s)</label><input className="border-2 border-[#000000]" value={maxTeamSize} onChange={(e)=>setMaxTeamSize(e.target.value)}  type="text" /></div>
                               <div className="flex flex-row"><label>Maximum member(s)</label><input type="text" className="border-2 border-[#000000]" value={minTeamSize}  onChange={(e)=>setMinTeamSize(e.target.value)} /></div>
                            </div>:null
                           }
                           <button onClick={createEvent}>Create Event</button>
                        </PopoverContent>
                    </Popover>

                </div>
            </div>
        </div>
      );
 }
export default Module;