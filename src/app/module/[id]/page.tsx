"use client";
import { useState } from "react";
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
interface moduleParams{
    id:string
}
export const runtime = "edge";
const Module=({params}:{params:moduleParams})=>{
    const [module,setModule]=useState("My module");
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
                                <input type="text" className="border-b-2 border-[#000000] bg-[transparent] "/>
                           </div>
                           <div className='flex flex-col items-start'>
                                <label className="text-[0.6rem]">Description about the event</label>
                                <textarea className="border-2 border-[#000000] bg-[transparent]"></textarea>
                           </div>
                           <div className='flex flex-col items-start'>
                                <label className="text-[0.6rem]">Type of event</label>
                                <div className="flex flex-row"><input type="radio" name="eventype" id="solo" onClick={()=>setNeweventype("solo")}  /><label>Solo</label></div>
                                <div className="flex flex-row"><input type="radio" name="eventype" id="group" onClick={()=>setNeweventype("group")} /><label>Group</label></div>
                           </div>
                           {
                            neweventtype==="group"?
                            <div className='flex flex-col items-start'>
                               <div className="flex flex-row"><label>Minimum member(s)</label><input className="border-2 border-[#000000]" type="number" /></div>
                               <div className="flex flex-row"><label>Maximum member(s)</label><input type="number" className="border-2 border-[#000000]" /></div>
                            </div>:null
                           }
                        </PopoverContent>
                    </Popover>

                </div>
            </div>
        </div>
      );
 }
export default Module;