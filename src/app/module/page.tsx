
"use client";
import {useState, useReducer} from "react";
import Link from "next/link";
import axios, { AxiosError } from "axios";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
  } from "../../components/ui/popover";
import { Button } from "~/components/ui/button";
import { env } from "~/env";
import { toast } from "sonner";
export const runtime = "edge";
interface createModuleReqParams {
    description: string, 
    coverImage: string, 
    iconImage: string,
    name: string, 
    thirdPartyURL: string
}

const initialCreateModuleReqState = {
    description: "", 
    coverImage: "https://coverImage.png", 
    iconImage: "https://iconImage.png",
    name: "", 
    thirdPartyURL: ""
}

type ACTION =
  | { type: 'SET_MODULE_DESC'; payload: string }
  | { type: 'SET_MODULE_NAME'; payload: string }
  | { type: 'SET_MODULE_TP_URL'; payload: string }
  | { type: 'INIT'; };

function createModuleParamsReducer(state: createModuleReqParams, action: ACTION): createModuleReqParams {
    switch (action.type) {
      case 'SET_MODULE_DESC':
        return { ...state, description: action.payload };
      case 'SET_MODULE_NAME':
        return { ...state, name: action.payload };
      case 'SET_MODULE_TP_URL':
        return { ...state, thirdPartyURL: action.payload };
      case 'INIT':
        return initialCreateModuleReqState
      default:
        return state;
    }
  }

const Module=()=>{
    const [mods,setMods]=useState([
        {
            id:1,
            name:"Module1",
            destination:"/module/1"
        },
        {
            id:2,
            name:"Module2",
            destination:"/module/2"
        }
    ]);
    const [createModuleReqState, dispatchCreateModuleReqState] = useReducer(createModuleParamsReducer, initialCreateModuleReqState)
    const createModule = async() => {
        const payload = createModuleReqState
        console.log(payload)
        const res = await axios.post(`${env.NEXT_PUBLIC_API_URL}/api/module/create`, payload, {
            headers: {
                Authorization: `Bearer 1000000`
            }
        }
        );
        return res
    }
    const onSubmit = () => {
        console.log("Inside on subimt")
        toast.promise(createModule, {
            loading: "Creating Module...",
            success: (data) => {
                dispatchCreateModuleReqState({
                    type: "INIT"
                })
                return "Module Created"
            },
            error: (e: AxiosError) => {
                if (e.status === 403) {
                    return "Error Creating Module. Unauthorized."
                }
                return "Error Creating Module. If you are authorized, please contact support."
            }
        })
    }
    return(
        <div className="flex flex-col items-center justify-start">
            <h1 className="text-[#ffffff]">Create Module Here</h1>
            <div className="flex flex-col items-center flex-wrap">
                {
                    mods.map((item)=>(
                            <Link href={item.destination} key={item.id}>
                                <div className="flex flex-col p-2 text-[#ffffff]">
                                    {item.id}
                                    {item.name}
                                </div>
                            </Link>
                        )
                    )
                }
                <Popover>
                        <PopoverTrigger asChild>
                            <button className='p-4 text-[4rem]'>+</button>
                        </PopoverTrigger>
                        <PopoverContent className="w-80">
                            <div className="flex flex-col">
                                <label>Module Name</label>
                                <input type="text" className="mb-2 text-slate-900" onChange={(e)=> {
                                    dispatchCreateModuleReqState({
                                        type: "SET_MODULE_NAME",
                                        payload: e.target.value
                                    })
                                }} />
                            </div>
                            <div className="flex flex-col">
                                <label>Module Description</label>
                                <input type="text" className="mb-2 text-slate-900" onChange={(e)=> {
                                    dispatchCreateModuleReqState({
                                        type: "SET_MODULE_DESC",
                                        payload: e.target.value
                                    })
                                }} />
                            </div>
                            <div className="flex flex-col">
                                <label>Third Party URL</label>
                                <input type="text" className="mb-2 text-slate-900" onChange={(e)=> {
                                    dispatchCreateModuleReqState({
                                        type: "SET_MODULE_TP_URL",
                                        payload: e.target.value
                                    })
                                }}/>
                            </div>
                            <Button onClick={onSubmit}>
                                Create Module
                            </Button>
                        </PopoverContent>
                    </Popover>
            </div>
        </div>
    );
}
export default Module;
