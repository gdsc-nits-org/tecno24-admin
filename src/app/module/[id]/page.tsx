"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import Link from "next/link";
import axios from "axios";
import { Button } from "~/components/ui/button";
import { env } from "~/env";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";

interface moduleParams {
    id: string;
}

interface module {
    id: string;
    name: string;
    description: string;
    iconImage: string;
    coverImage: string;
    thirdPartyURL: string;
}

interface event {
    id: string;
    name: string;
    posterImage: string;
    maxTeamSize: number;
    minTeamSize: number;
    attendanceIncentive: number;
    registrationIncentive: number;
    prizeDescription: string;
    stagesDescription: string;
    description: string;
    venue: string;
    lat: string;
    lng: string;
    registrationStartTime: string;
    registrationEndTime: string;
    extraQuestions?: object[];
    module: module;
}



export const runtime = "edge";

interface GetEventAPIResponse {
    status: string;
    msg: event[];
}

interface ModuleForName {
    coverImage: string;
    description: string;
    events: Event[];
    iconImage: string;
    id: string;
    name: string;
}

interface GetModuleAPIResponse {
    status: string;
    msg: ModuleForName[];
}

const fetchModName = async (id: string) => {
    const mod = await axios.get<GetModuleAPIResponse>(`${env.NEXT_PUBLIC_API_URL}/api/module`);
    const temp = mod?.data?.msg.filter((item) => item.id === id);
    return temp && temp.length > 0 ? temp[0]?.name : null;
};

const fetchData = async (id: string) => {
    const data = await axios.get<GetEventAPIResponse>(`${env.NEXT_PUBLIC_API_URL}/api/module/${id}/event`);
    return data?.data?.msg;
};

const Module = ({ params }: { params: moduleParams }) => {
    const [neweventtype, setNeweventype] = useState("solo");

    const { data: modName, error: modNameError } = useQuery({
        queryKey: ["modName", params.id],
        queryFn: () => fetchModName(params.id),
    });
   

    const { data: events, error: eventsError, isError, isSuccess } = useQuery({
        queryKey: ["events", params.id],
        queryFn: () => fetchData(params.id),
    });

    if(isSuccess){
        toast.success("Events fetched successfully")
    }
    if(isError || eventsError){
        toast.error("Failed to fetch events")
    }
   
    const router = useRouter();
    const createEvent = () => {
        router.push(`${params.id}/createEvent`)
    }
    
    return (
        <div className='bg-[#000000] text-[#ffffff] min-h-[100vh] flex flex-col items-center justify-start'>
            <div className='text-center flex flex-col gap-10 items-center justify-center py-6'>
                <div className='pt-[4rem]'>
                    <h1 className='text-[2rem]'>{modName} </h1>
                </div>
                <div className='flex flex-wrap items-center justify-center gap-5'>
                    {
                        events?.map((event) => {
                            return (
                                <Link href={`/event/${event.id}`} key={event.id}>
                                    <div className="flex flex-col p-[3rem] border-2" >
                                        <h2>{event.name}</h2>
                                        <h4>{event.description}</h4>
                                    </div>
                                </Link>
                            )
                        })
                    }
                </div>
                <Button onClick={createEvent} type="submit"> Create Event</Button>

            </div>
        </div>
    );
}
export default Module;