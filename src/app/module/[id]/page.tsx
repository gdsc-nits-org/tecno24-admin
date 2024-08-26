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
import Link from "next/link";
interface moduleParams{
    id:string
}

const Module=({params}:{params:moduleParams})=>{
    const [module,setModule]=useState("My module");
    return(
        <div className='bg-[#000000] text-[#ffffff] min-h-[100vh] flex flex-col items-center justify-start'>
            <div className='w-[50vw] text-center'>
                <div className='pt-[4rem]'>
                    <h1 className='text-[2rem]'>{module}</h1>
                </div>
                <div className='flex flex-wrap'>
                    <Link href="/event/123">
                    <Card className='p-[1rem] bg-[transparent]'>
                        <CardHeader className="text-[#ffffff]">Event1</CardHeader>
                        <CardDescription>
                            Event description
                        </CardDescription>
                    </Card>
                    </Link>
                </div>
            </div>
        </div>
      );
 }
export default Module;