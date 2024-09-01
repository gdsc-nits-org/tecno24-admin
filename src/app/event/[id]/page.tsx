'use client';

import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "~/components/ui/table";
import { Button } from "~/components/ui/button";
import { useQuery } from '@tanstack/react-query';
import axios from "axios";
import { env } from "~/env";
import { useState } from "react";
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
import { User } from "firebase/auth";
import { useRouter } from "next/navigation";
export const runtime = "edge";


interface TeamMember {
    id: string;
    firebaseId: string;
    firstName: string;
    lastName: string;
    middleName?: string;
    username: string;
    email: string;
    collegeName: string;
    registrationId: string;
    phoneNumber: string;
}

interface Team {
    id: string;
    teamName: string;
    registrationStatus: string;
    members: TeamMember[];
    extraInformation: Record<string, []>;
    eventId: string;
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
    extraQuestions: string[];
    module: Module;
}

interface GetApiName {
    status: string;
    msg: Event;
}

interface GetApiTeam {
    status: string;
    msg: Team[];
}


const fetchEventName = async (id: string) => {
    const { data } = await axios.get<GetApiName>(`${env.NEXT_PUBLIC_API_URL}/api/event/${id}`);
    return data.msg.name;
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
    const [user, loading] = useAuthState(auth)
    const router = useRouter()
    const { data: eventName, error: nameError, isLoading: nameLoading } = useQuery({
        queryKey: ['eventName', params.id],
        queryFn: () => fetchEventName(params.id),
    });

    const { data: teams, error: teamsError, isLoading: teamsLoading } = useQuery({
        queryKey: ['eventTeams', params.id],
        queryFn: () => fetchTeams(params.id, user!),
    });

    const [userId, setUserId] = useState('');
    const [open, setOpen] = useState(false);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const token = await user?.getIdToken();

        if (userId) {
            toast.promise(addOrganizer(userId, params.id, token), {
                success: () => {
                    setOpen(false)
                    return "Organizer Added Successfully";
                },
                loading: "Adding Organizer",
                error: "Failed to add Organizer. Are you Admin?"
            })
        } else {
            toast.error('UserId is required.');
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

    const downloadCSV = () => {
        const headers = [{
            "Sl No.": "Sl No.",
            "Team Name": "Team Name",
            "Name": "Name",
            "Email": "Email",
            "Team Member Phone": "Team Member Phone",
            "College Name": "College Name"
        }];

        const filteredData = teams?.flatMap((team, teamIndex) => {
            const teamHeader = [{
                "Sl No.": `Team ${teamIndex + 1}`,
                "Team Name": team.teamName,
                "Name": '',
                "Email": '',
                "Team Member Phone": '',
                "College Name": ''
            }];

            const teamMembers = team?.members.map((member, memberIndex) => ({
                "Sl No.": memberIndex + 1,
                "Team Name": '',
                "Name": `${member.firstName} ${member.middleName ? member.middleName + ' ' : ''}${member.lastName}`,
                "Email": member.email,
                "Team Member Phone": member.phoneNumber,
                "College Name": member.collegeName
            }));

            return [...teamHeader, ...teamMembers, {}, {}];
        }) ?? [];

        const csvData = jsonToCSV([...headers, ...filteredData]);
        const blob = new Blob([csvData], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `${eventName}`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    if (nameError || teamsError) {
        toast.error("Error Fetching Event Data. Are you Event Organizer?")
        router.push("/dashboard")
    }

    if (loading || nameLoading || teamsLoading) {
        return (
          <div className="flex w-screen h-screen justify-center items-center gap-3">
            <Spinner size="large" />
          </div>
        )
    }


    return (
        <main className="flex flex-col justify-center items-center h-screen p-4">
            <div className="flex flex-row justify-center items-center w-full text-4xl font-mono font-bold uppercase py-8 my-10 text-center">
                {eventName}
            </div>
            {teams?.map((team, teamIndex) => (
                <div key={team.id} className="w-full max-w-4xl p-4 mb-6">
                    <Table className="w-full shadow-md rounded-lg">
                        <TableCaption className="text-left py-2 font-semibold">{`Team ${teamIndex + 1}: ${team.teamName}`}</TableCaption>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-[50px]">Sl No.</TableHead>
                                <TableHead>Team Name</TableHead>
                                <TableHead>Team Member Name</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {team.members.map((member, memberIndex) => (
                                <TableRow key={member.id}>
                                    <TableCell className="font-medium">{memberIndex + 1}</TableCell>
                                    <TableCell>{team.teamName}</TableCell>
                                    <TableCell>{`${member.firstName} ${member.middleName ? member.middleName + ' ' : ''}${member.lastName}`}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            ))}
            <div className="flex flex-row items-center justify-center gap-12">
                <Button onClick={downloadCSV} className="mt-6 text-lg font-mono font-bold" variant="outline">
                    Download
                </Button>
                <Dialog open={open} onOpenChange={setOpen}>
                    <DialogTrigger asChild>
                        <Button className="mt-6 text-lg font-mono font-bold" variant="outline">
                            Add Event Organiser
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Enter Event Organiser User ID</DialogTitle>
                            <DialogDescription>
                                Please enter the User ID of the person you wish to add as an event organiser.
                            </DialogDescription>
                        </DialogHeader>
                        <form onSubmit={handleSubmit} className="flex flex-row items-center justify-center gap-5">
                            <input
                                className="text-black"
                                type="text"
                                value={userId}
                                onChange={(e) => setUserId(e.target.value)}
                                placeholder="User ID"
                                required
                            />
                            <Button type="submit" variant="outline">Submit</Button>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>
        </main>
    );
};

export default Event;
