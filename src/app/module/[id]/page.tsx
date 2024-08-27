"use client";
import { useState, useReducer } from "react";
import {
    Card,
    CardDescription,
    CardHeader,
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
import { Button } from "~/components/ui/button";

interface moduleParams{
    id: string
}

interface createEventRequestParams{
    moduleId: string,
    name: string,
    description: string,
    minTeamSize: number,
    maxTeamSize: number,
    posterImage: string,
    prizeDescription: string,
    stagesDescription: string,
    venue: string,
    lat: string,
    lng: string,
    registrationStartTime: string,
    registrationEndTime: string,
    extraQuestions: []
}

const initialCreateEventState: createEventRequestParams = {
    moduleId: "",
    name: "",
    description: "",
    minTeamSize: 1,
    maxTeamSize: 1,
    posterImage: "https://image.png",
    prizeDescription: "Random place",
    stagesDescription: "Random Ass place",
    venue: "9D 109",
    lat: "24.756090",
    lng: "24.756090",
    registrationStartTime: "",
    registrationEndTime: "",
    extraQuestions: []
}

type ACTION =
  | { type: 'SET_MODULE_ID'; payload: string }
  | { type: 'SET_EVENT_NAME'; payload: string }
  | { type: 'SET_EVENT_DESC'; payload: string }
  | { type: 'SET_EVENT_MIN_TEAM_SZ'; payload: number }
  | { type: 'SET_EVENT_MAX_TEAM_SZ'; payload: number }
  | { type: 'SET_EVENT_POSTER'; payload: string }
  | { type: 'SET_EVENT_PRIZE_DESC'; payload: string }
  | { type: 'SET_EVENT_VENUE'; payload: string }
  | { type: 'SET_EVENT_LAT'; payload: string }
  | { type: 'SET_EVENT_LON'; payload: string }
  | { type: 'SET_EVENT_REG_START'; payload: string }
  | { type: 'SET_EVENT_REG_END'; payload: string }
  | { type: 'SET_EVENT_EXTRA_Q'; payload: [] };

function createEventParamsReducer(state: createEventRequestParams, action: ACTION): createEventRequestParams {
    switch (action.type) {
      case 'SET_MODULE_ID':
        return { ...state, moduleId: action.payload };
      case 'SET_EVENT_NAME':
        return { ...state, name: action.payload };
      case 'SET_EVENT_DESC':
        return { ...state, description: action.payload };
      case 'SET_EVENT_MIN_TEAM_SZ':
        return { ...state, minTeamSize: action.payload };
      case 'SET_EVENT_MAX_TEAM_SZ':
        return { ...state, maxTeamSize: action.payload };
      case 'SET_EVENT_POSTER':
        return { ...state, posterImage: action.payload };
      case 'SET_EVENT_PRIZE_DESC':
        return { ...state, prizeDescription: action.payload };
      case 'SET_EVENT_VENUE':
        return { ...state, venue: action.payload };
      case 'SET_EVENT_LAT':
        return { ...state, lat: action.payload };
      case 'SET_EVENT_LON':
        return { ...state, lng: action.payload };
      case 'SET_EVENT_REG_START':
        return { ...state, registrationStartTime: action.payload };
      case 'SET_EVENT_REG_END':
        return { ...state, registrationEndTime: action.payload };
      case 'SET_EVENT_EXTRA_Q':
        return { ...state, extraQuestions: action.payload };

      default:
        return state;
    }
  }

export const runtime = "edge";


const Module=({ params }:{ params: moduleParams })=>{
    const [user, loading, error] = useAuthState(auth);
    const [usermoduleIdToken, loadingToken, errorToken] = useIdToken(auth);
    const [createEventReqState, dispatchCreateEventReqState] = useReducer(createEventParamsReducer, initialCreateEventState)

    async function createEvent() {
        console.log("Module moduleId:", params.id)
        dispatchCreateEventReqState({
            type: "SET_MODULE_ID",
            payload: params.id
        })
        const payload = {
            ...createEventReqState,
            moduleId: params.id,
            registrationIncentive : 1,
            attendanceIncentive: 1
        }
        console.log(payload)

        const res= await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/event/create`,  payload,
        {
            headers: {
                Authorization: `Bearer 1000000` // Add your token here
            }
        }
        );
        console.log(res)

    }

    const [events,setEvents]=useState([
        {
            moduleId:1,
            name:"Event 1",
            description:"Some Description About Event",
            destination:"/event/1"
        },
        {
            moduleId:2,
            name:"Event 2",
            description:"Some Description About Event 2",
            destination:"/event/2"
        }
    ]);
    const [neweventtype,setNeweventype]=useState("solo");
    return(
        <div className='bg-[#000000] text-[#ffffff] min-h-[100vh] flex flex-col items-center justify-start'>
            <div className='w-[50vw] text-center'>
                <div className='pt-[4rem]'>
                    <h1 className='text-[2rem]'> Robotron Module </h1>
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
                        <PopoverContent className="w-full">
                            <div className='flex flex-col items-start'>
                                <label className="text-[1rem]">Enter Event Name</label>
                                <input type="text" onChange={(e)=> {
                                    dispatchCreateEventReqState({
                                        type: 'SET_EVENT_NAME',
                                        payload: e.target.value
                                    })
                                } } className="bg-white w-[500px] text-slate-900"/>
                           </div>
                           <div className='flex flex-col items-start'>
                                <label className="text-[1rem]">Description about the event</label>
                                <textarea className="bg-white resize-y h-[200px] w-[500px] text-slate-900" onChange={(e)=>{
                                    dispatchCreateEventReqState({
                                        type: "SET_EVENT_DESC",
                                        payload: e.target.value
                                    })
                                }}></textarea>
                           </div>
                           <div className='flex flex-col items-start'>
                                <label className="text-[1rem]">Type of event</label>
                                <div className="flex flex-row"><input type="radio" name="eventype" id="solo" onClick={()=>setNeweventype("solo")}  /><label>Solo</label></div>
                                <div className="flex flex-row"><input type="radio" name="eventype" id="group" onClick={()=>setNeweventype("group")} /><label>Group</label></div>
                           </div>
                           <div className='flex flex-row my-1 gap-2'>
                                <label>Registration Start</label>
                                <input type="datetime-local" className="text-slate-900"  onChange={(e)=> {
                                    dispatchCreateEventReqState({
                                        type: "SET_EVENT_REG_START",
                                        payload: e.target.value
                                    })
                                }}/>
                           </div>
                           <div className='flex flex-row gap-2 my-1'>
                                <label>Registration End</label>
                                <input type="datetime-local" className="text-slate-900" onChange={(e)=> {
                                    dispatchCreateEventReqState({
                                        type: "SET_EVENT_REG_END",
                                        payload: e.target.value
                                    })
                                }}/>
                           </div>
                           {
                            neweventtype==="group" ?
                            <div className='flex flex-col items-start'>
                               <div className="flex flex-row">
                                    <label>Minimum member(s)</label>
                                    <input className="text-slate-900" type="number" defaultValue={1} onChange={(e)=>{
                                        dispatchCreateEventReqState({
                                        type: "SET_EVENT_MIN_TEAM_SZ",
                                        payload: e.target.valueAsNumber,
                                    })
                                }} />
                                </div>
                                <div className="flex flex-row">
                                <label>Maximum member(s)</label>
                                <input type="number" className="text-slate-900" defaultValue={1} onChange={(e)=>{
                                 dispatchCreateEventReqState({
                                    type: "SET_EVENT_MAX_TEAM_SZ",
                                    payload: e.target.valueAsNumber,
                                 })
                                }} />
                                </div>
                            </div> : null
                           }
                           <Button  onClick={createEvent}>
                            Create Event
                           </Button>
                        </PopoverContent>
                    </Popover>

                </div>
            </div>
        </div>
      );
 }
export default Module;