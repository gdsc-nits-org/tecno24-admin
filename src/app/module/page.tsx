"use client";
import {useState} from "react";
import Link from "next/link";
import axios from "axios";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
  } from "../../components/ui/popover";
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
    const [name,setName]=useState("ewfdew");
    const [description,setDescription]=useState("wefw");

    const [iconImage,setIconImage]=useState("efew");
    const [coverImage,setCoverImage]=useState("efewf");
    const [thirdPartyURL,setThirdPartyURL]=useState("fewfew");
    const createModule=async (e: any)=>{
        e.preventDefault();
        try{
                const createMod=await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/module/create`,{
                    name:name,
                    description:description,
                    iconImage:iconImage,
                    coverImage:coverImage,
                    thirdPartyURL:thirdPartyURL
                },
                {
                    headers: {
                        Authorization: `Bearer 1000000` // Add your token here
                    }
                }
                );

        }
        catch (error) {
            console.error(error);
        }
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
                                <input type="text" onChange={(e)=>setName(e.target.value)} value={name}  />
                            </div>
                            <div className="flex flex-col">
                                <label>Module Description</label>
                                <input type="text" onChange={(e)=>setDescription(e.target.value)} value={description}  />
                            </div>
                            <div className="flex flex-col">
                                <label>Third Party URL</label>
                                <input type="text" onChange={(e)=>setThirdPartyURL(e.target.value)} value={thirdPartyURL}  />
                            </div>
                            <button onClick={createModule}>Create Module</button>
                        </PopoverContent>
                    </Popover>
            </div>
        </div>
    );
}
export default Module;