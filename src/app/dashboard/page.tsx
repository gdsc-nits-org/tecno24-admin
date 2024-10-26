"use client";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../utils/firebase";
import { Button } from "~/components/ui/button";
import { Spinner } from "~/components/ui/spinner";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { useSignOut } from "react-firebase-hooks/auth";
import { redirect } from "next/navigation";
import axios from "axios";
import { env } from "~/env";
import { toast } from "sonner";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
export const runtime = "edge";

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
  const res = await axios.get<GetModuleAPIResponse>(
    `${env.NEXT_PUBLIC_API_URL}/api/module`,
  );
  return res.data;
};

export default function Dashboard() {
  const [user, loading, error] = useAuthState(auth);
  const [signOut] = useSignOut(auth);

  const {
    data,
    isLoading,
    error: queryError,
    refetch,
  } = useQuery({
    queryKey: ["modules"],
    queryFn: fetchModules,
    enabled: false,
  });
  useEffect(() => {
    toast.promise(refetch(), {
      error: "Error Loading Modules",
    });
  }, [refetch]);

  if (error || queryError) {
    return (
      <div>
        There was some error. Please contact support: tech@tecnoesis.co.in{" "}
      </div>
    );
  }

  if (loading || isLoading) {
    return (
      <div className="flex h-screen w-screen items-center justify-center gap-3">
        <Spinner size="large" />
      </div>
    );
  }

  if (user) {
    return (
      <div className="flex flex-col items-center justify-center pb-10">
        <main className="my-2 flex flex-row items-center justify-center gap-4">
          <div className="text-xl">Signed in as {user?.displayName} </div>
          <Button variant={"secondary"} onClick={() => signOut()}>
            Sign Out
          </Button>
        </main>
        <div className="my-3 mb-8 flex items-center justify-center gap-4">
          <span className="text-4xl">Modules</span>
          <Link href={"/create"}>
            <Button variant={"secondary"}>Create Module</Button>
          </Link>
        </div>
        <div className="flex w-3/4 flex-row flex-wrap items-center justify-center gap-2">
          {data?.msg?.map((module) => (
            <Link href={`/module/${module.id}`} key={module.id}>
              <Card className="h-[350px] w-[350px] overflow-y-clip">
                <CardHeader>
                  <CardTitle>{module.name}</CardTitle>
                  <CardContent>
                    <p>Events: {module.events.length}</p>
                  </CardContent>
                  <CardDescription>
                    {module.description == " " ? (
                      <p className="text-red-500">No Description</p>
                    ) : (
                      module.description
                    )}
                  </CardDescription>
                </CardHeader>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    );
  } else {
    redirect("/");
  }
}
