"use client";
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from "../utils/firebase";
import { Button } from '~/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { useSignOut } from 'react-firebase-hooks/auth';
import { redirect } from "next/navigation";
import axios from 'axios';
import { env } from '~/env';
import { toast } from 'sonner';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';

interface Module {
  coverImage: string;
  description: string;
  events: Event[];
  iconImage: string;
  id: string;
  name: string;
}

interface GetModuleAPIResponse {
  status: string;
  msg: Module[];
}

const fetchModules = async (): Promise<GetModuleAPIResponse> => {
  const res = await axios.get<GetModuleAPIResponse>(`${env.NEXT_PUBLIC_API_URL}/api/module`);
  return res.data;
};

export default function Dashboard() {
  const [user, loading, error] = useAuthState(auth);
  const [signOut] = useSignOut(auth);

  const { data, isLoading, error: queryError, isSuccess } = useQuery({
    queryKey: ['modules'],
    queryFn: fetchModules,
  });

  if (isSuccess)
    toast.success("Modules Fetched Successfully.");

  if (error || queryError) {
    toast.error('Could Not Fetch Modules');
    return <div>There was some error. Please contact support</div>;
  }

  if (loading || isLoading) {
    return <div>Loading...</div>;
  }

  if (user) {
    return (
      <div className="flex flex-col justify-center items-center">
        <main className='flex flex-row justify-center items-center gap-4 my-2'>
          <div className="text-xl">Signed in as {user?.displayName} </div>
          <Button variant={"secondary"} onClick={() => signOut()}>Sign Out</Button>
        </main>
        <span className="text-4xl my-3 mb-8">Modules</span>
        <div className="w-3/4 flex flex-row flex-wrap gap-2 items-center justify-center">
          {
            data?.msg?.map((module) => (
              <Link href={`/module/${module.id}`} key={module.id}>
                <Card className="w-[250px] h-[200px]">
                  <CardHeader>
                    <CardTitle>{module.name}</CardTitle>
                    <CardDescription>{module.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p>Card Content</p>
                  </CardContent>
                  <CardFooter>
                    <p>Card Footer</p>
                  </CardFooter>
                </Card>
              </Link>
            ))
          }
        </div>
      </div>
    );
  } else {
    redirect("/");
  }
}
