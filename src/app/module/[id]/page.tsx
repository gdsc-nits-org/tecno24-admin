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
  prizeDescription: string;
  stagesDescription: string;
  description: string;
  venue: string;
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
  const mod = await axios.get<GetModuleAPIResponse>(
    `${env.NEXT_PUBLIC_API_URL}/api/module`,
  );
  const temp = mod?.data?.msg.filter((item) => item.id === id);
  return temp && temp.length > 0 ? temp[0]?.name : null;
};

const fetchData = async (id: string) => {
  const data = await axios.get<GetEventAPIResponse>(
    `${env.NEXT_PUBLIC_API_URL}/api/module/${id}/event`,
  );
  return data?.data?.msg;
};

const Module = ({ params }: { params: moduleParams }) => {
  const [neweventtype, setNeweventype] = useState("solo");

  const { data: modName, error: modNameError } = useQuery({
    queryKey: ["modName", params.id],
    queryFn: () => fetchModName(params.id),
  });

  const {
    data: events,
    error: eventsError,
    isError,
    isSuccess,
  } = useQuery({
    queryKey: ["events", params.id],
    queryFn: () => fetchData(params.id),
  });

  // if(isSuccess){
  //     toast.success("Events fetched successfully")
  // }
  if (isError || eventsError) {
    toast.error("Failed to fetch events");
  }

  const router = useRouter();
  const createEvent = () => {
    router.push(`${params.id}/createEvent`);
  };

  return (
    <div className="flex min-h-[100vh] flex-col items-center justify-start bg-[#000000] text-[#ffffff]">
      <div className="flex flex-col items-center justify-center gap-10 py-6 text-center">
        <div className="pt-[4rem]">
          <div className="text-4xl font-semibold text-cyan-600">{modName} </div>
        </div>
        <div className="flex flex-wrap items-center justify-center gap-5">
          {events?.map((event) => {
            return (
              <Link href={`/event/${event.id}`} key={event.id}>
                <div className="flex h-[350px] w-[350px] flex-col overflow-y-clip border-2 px-8 hover:border-cyan-600">
                  <span className="mb-4 mt-8 text-2xl font-extrabold text-cyan-600">
                    {event.name}
                  </span>
                  <span className="truncate font-light">
                    {event.description}
                  </span>
                  <br />
                  <span>Min Team Size: {event.minTeamSize}</span>
                  <span>Max Team Size: {event.maxTeamSize}</span>
                  <br />
                  {/* <span>Registration Start: {event.registrationStartTime}</span>
                  <span>Registration End: {event.registrationEndTime}</span> */}
                  <span>
                    Registration Start:{" "}
                    <span className="text-cyan-600">
                      {new Date(event.registrationStartTime).toLocaleString(
                        "en-US",
                        {
                          weekday: "short",
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                          timeZone: "UTC",
                        },
                      )}{" "}
                    </span>
                  </span>
                  <span>
                    Registration End:{" "}
                    <span className="text-cyan-600">
                      {new Date(event.registrationEndTime).toLocaleString(
                        "en-US",
                        {
                          weekday: "short",
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                          timeZone: "UTC",
                        },
                      )}{" "}
                    </span>
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
        <Button onClick={createEvent} type="submit">
          {" "}
          Create Event
        </Button>
      </div>
    </div>
  );
};
export default Module;
