'use client';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import { Button } from "~/components/ui/button";
import { useQuery } from '@tanstack/react-query';
import axios, { type AxiosError } from "axios";
import { env } from "~/env";
import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog"
import { toast } from "sonner";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "~/app/utils/firebase";
import { Spinner } from "~/components/ui/spinner";
import type { User } from "firebase/auth";
import { useRouter } from "next/navigation";
import { CommandInput, CommandList, CommandEmpty, CommandGroup, CommandItem, Command } from "~/components/ui/command";

export const runtime = "edge";

interface _User {
  email: string,
  firstName: string,
  middleName: string,
  lastName: string,
  phoneNumber: string,
  username: string
  id: string,
  imageUrl: string
}

interface UserResponse {
  eventId: string;
  id: string;
  userId: string;
  user: _User
}

interface allUserResponse {
  balance: number;
  collegeName: string;
  email: string;
  firebaseId: string;
  firstName: string;
  id: string;
  imageUrl: string;
  lastName: string;
  middleName: string;
  phoneNumber: string;
  registrationId: string;
  username: string;
}

interface TeamMember {
  user: {
    id: string;
    username: string;
    firstName: string;
    middleName: string;
    lastName: string;
    imageUrl: string;
    phoneNumber: number;
    email: string;
    collegeName: string;
    registrationId: string;
  };
}

interface Team {
  id: string;
  teamName: string;
  registrationStatus: string;
  members: TeamMember[];
  transactionId?: string;
  verificationPhoto?: string;
  codeforcesID?: string;
}

interface EventParams {
  id: string;
}

interface Module {
  id: string;
  name: string;
  description: string;
  iconImage: string;
  coverImage: string;
  thirdPartyURL: string;
}

interface Event {
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
  extraQuestions: string[];
  module: Module;
  organizers: UserResponse[];
}

interface GetApiTeam {
  status: string;
  msg: Team[];
}


const fetchEvent = async (id: string) => {
  const { data } = await axios.get<{ msg: Event }>(`${env.NEXT_PUBLIC_API_URL}/api/event/${id}`);
  return data.msg;
};

const fetchTeams = async (id: string, user: User) => {
  const token = await user.getIdToken()
  const { data } = await axios.get<GetApiTeam>(`${env.NEXT_PUBLIC_API_URL}/api/team/event/${id}/registered_teams`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return data.msg;
};

const fetchAllUsers = async (token: string) => {
  try {
    const { data } = await axios.get<{ msg: allUserResponse[] }>(`${env.NEXT_PUBLIC_API_URL}/api/user`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return data.msg;
  } catch {
    return []
  }
}

async function addOrganizer(userId: string, eventId: string, token: string | undefined) {
  const data = {
    organizers: [userId]
  };
  const response = await axios.post(
    `${env.NEXT_PUBLIC_API_URL}/api/event/add/organiser/${eventId}`,
    data,
    {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  );
  return response
}

const Event = ({ params }: { params: EventParams }) => {
  const [user, loading] = useAuthState(auth);
  const router = useRouter()
  const { data: event, error: eventError, isLoading: eventLoading } = useQuery({
    queryKey: ['event', params.id],
    queryFn: () => fetchEvent(params.id),
  });

  const [organizers, setOrganizers] = useState<UserResponse[]>([]);
  useEffect(() => {
    if (eventLoading || eventError || !event) return;
    setOrganizers(prevOrganizers => [...prevOrganizers, ...event.organizers])
  }, [event, eventError, eventLoading])

  const { data: teams, error: teamsError, isLoading: teamsLoading } = useQuery({
    queryKey: ['eventTeams', params.id],
    queryFn: () => fetchTeams(params.id, user!),
  });
  const [open, setOpen] = useState(false);

  const [organizer, setOrganizer] = useState<string>("");

  const [allUsers, setAllUsers] = useState<allUserResponse[]>([]);
  useEffect(() => {
    void (async () => {
      const token = await user?.getIdToken();
      if (!token) return;
      setAllUsers(await fetchAllUsers(token))
    })()
  }, [user])


  const handleSubmit = async (username: string) => {
    const token = await user?.getIdToken();

    if (username) {
      toast.promise(addOrganizer(username, params.id, token), {
        success: () => {
          setOpen(false)
          return "Organizer Added Successfully";
        },
        loading: "Adding Organizer",
        error: (e: AxiosError<{ status: string, msg: string }>) => {
          return e.response?.data.msg
        }
      })
    } else {
      toast.error('Username is required.');
    }
  };

  const jsonToCSV = (data: Record<string, string | number>[]): string => {
    if (data.length === 0) return '';
    const headers = data[0] ? Object.keys(data[0]) : [];

    const csvRows = [headers.join(',')];

    for (const row of data) {
      const values = headers.map(header => {
        const value = row[header];
        return typeof value === 'string' ? `"${value.replace(/"/g, '""')}"` : value;
      });
      csvRows.push(values.join(','));
    }

    return csvRows.join('\n');
  };
  console.log(teams)
  const downloadCSV = () => {
    const isSoloEvent = event?.maxTeamSize === 1;

    const filteredData = teams?.map((team, teamIndex) => {
      if (isSoloEvent) {
        // Solo event format: Sl No., Name, Mobile Number, Transaction ID, Verification Photo
        const member = team.members[0];
        return {
          "Sl No.": teamIndex + 1,
          "Name": member ? `${member.user.firstName} ${member.user.middleName ? member.user.middleName + ' ' : ''}${member.user.lastName}` : '',
          "Mobile Number": member?.user.phoneNumber ?? '',
          "Transaction ID": team.transactionId ?? '',
          "Payment Verification Photo": team.verificationPhoto ?? ''
          
        };
      } else {
        // Group event format: Sl No., Team Name, Team Leader Name, Member 1, Member 2, ..., Mobile Number, Transaction ID, Verification Photo
        const rowData: Record<string, string | number> = {
          "Sl No.": teamIndex + 1,
          "Team Name": team.teamName,
          "Team Leader Name": team.members[0] ? `${team.members[0].user.firstName} ${team.members[0].user.middleName ? team.members[0].user.middleName + ' ' : ''}${team.members[0].user.lastName}` : ''
        };

        // Add members starting from Member 1 (second member onwards)
        team.members.slice(1).forEach((member, idx) => {
          rowData[`Member ${idx + 1} Name`] = `${member.user.firstName} ${member.user.middleName ? member.user.middleName + ' ' : ''}${member.user.lastName}`;
        });

        // Add team leader's mobile number, transaction ID and verification photo
        rowData["Mobile Number of Team Leader"] = team.members[0]?.user.phoneNumber ?? '';
        rowData["Transaction ID"] = team.transactionId ?? '';
        rowData["Payment Verification Photo"] = team.verificationPhoto ?? '';
        rowData["Codeforces ID"] = team.codeforcesID ?? '';

        return rowData;
      }
    }) ?? [];

    const csvData = jsonToCSV([...filteredData]);
    const blob = new Blob([csvData], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `${event?.name}.csv`);
    link.setAttribute('download', `${event?.name}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (eventError || teamsError) {
    toast.error("Error Fetching Event Data. Are you Event Organizer?")
    router.push("/dashboard")
  }

  if (loading || eventLoading || teamsLoading) {
    return (
      <div className="flex w-screen h-screen justify-center items-center gap-3">
        <Spinner size="large" />
      </div>
    )
  }

  const isSoloEvent = event?.maxTeamSize === 1;

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4">
      <div className="my-1 flex w-full flex-row items-center justify-center text-center font-mono text-4xl font-bold uppercase">
        {event?.name}
      </div>
      <div className="my-1 flex w-full flex-col items-center justify-center py-2 text-center font-mono text-xl font-bold uppercase">
        Organisers
        {<br />}
        <div>
          {
            organizers.map((organizer) => {
              return (
                <div className="text-sm font-normal flex flex-col gap-2" key={organizer.id}>
                  {organizer.user.username}
                </div>
              )
            })
          }
        </div>
      </div>
      {teams?.map((team, teamIndex) => (
        <div key={team.id} className="mb-6 w-full max-w-4xl p-4">
          <Table className="w-full rounded-lg shadow-md">
            <TableHeader>
              <TableRow>
                <TableHead className="w-[50px]">Sl No.</TableHead>
                {isSoloEvent ? (
                  <>
                    <TableHead>Name</TableHead>
                    <TableHead>Mobile Number</TableHead>
                    <TableHead>Transaction ID</TableHead>
                    <TableHead>Payment Verification Photo</TableHead>
                    <TableHead>Codeforces ID</TableHead>
                  </>
                ) : (
                  <>
                    <TableHead>Team Name</TableHead>
                    <TableHead>Team Leader Name</TableHead>
                    {team.members.slice(1).map((_, idx) => (
                      <TableHead key={idx}>Member {idx + 1} Name</TableHead>
                    ))}
                    <TableHead>Team Leader Mobile Number</TableHead>
                    <TableHead>Transaction ID</TableHead>
                    <TableHead>Payment Verification Photo</TableHead>
                  </>
                )}
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell className="font-medium">
                  {teamIndex + 1}
                </TableCell>
                {isSoloEvent ? (
                  <>
                    <TableCell>
                      {team.members[0] ? `${team.members[0].user.firstName} ${team.members[0].user.middleName ? team.members[0].user.middleName + ' ' : ''}${team.members[0].user.lastName}` : ''}
                    </TableCell>
                    <TableCell>{team.members[0]?.user.phoneNumber}</TableCell>
                    <TableCell>{team.transactionId ?? 'N/A'}</TableCell>
                    <TableCell>
                      {team.verificationPhoto ? (
                        <a href={team.verificationPhoto} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                          View
                        </a>
                      ) : 'N/A'}
                    </TableCell>
                    <TableCell>{team.codeforcesID ?? 'N/A'}</TableCell>
                  </>
                ) : (
                  <>
                    <TableCell>{team.teamName}</TableCell>
                    <TableCell>
                      {team.members[0] ? `${team.members[0].user.firstName} ${team.members[0].user.middleName ? team.members[0].user.middleName + ' ' : ''}${team.members[0].user.lastName}` : ''}
                    </TableCell>
                    {team.members.slice(1).map((member, idx) => (
                      <TableCell key={idx}>
                        {`${member.user.firstName} ${member.user.middleName ? member.user.middleName + ' ' : ''}${member.user.lastName}`}
                      </TableCell>
                    ))}
                    <TableCell>{team.members[0]?.user.phoneNumber}</TableCell>
                    <TableCell>{team.transactionId ?? 'N/A'}</TableCell>
                    <TableCell>
                      {team.verificationPhoto ? (
                        <a href={team.verificationPhoto} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                          View
                        </a>
                      ) : 'N/A'}
                    </TableCell>
                  </>
                )}
              </TableRow>
            </TableBody>
          </Table>
        </div>
      ))}
      <div className="flex flex-row items-center justify-center gap-12">
        <Button
          onClick={downloadCSV}
          className="mt-6 font-mono text-lg font-bold"
          variant="outline"
        >
          Download
        </Button>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button
              className="mt-6 font-mono text-lg font-bold"
              variant="outline"
            >
              Add Event Organiser
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Enter Event Organiser Username</DialogTitle>
              <DialogDescription>
                Please enter the username of the person you wish to add as an
                event organiser.
              </DialogDescription>
            </DialogHeader>
            <Command value={organizer} onValueChange={setOrganizer}>
              <CommandInput placeholder="Type a command or search..." />
              <CommandList>
                <CommandEmpty>No results found.</CommandEmpty>
                <CommandGroup>
                  {
                    allUsers
                      .filter(user => !organizers.some(org => org.userId === user.id))
                      .map((user) => (
                        <CommandItem key={user.id} onSelect={async () => {
                          await handleSubmit(user.username)
                        }}>
                          {`${user.username} - ${user.firstName} ${user.lastName} (${user.registrationId})`}
                        </CommandItem>
                      ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </DialogContent>
        </Dialog>
      </div>
    </main>
  );
};

export default Event;
