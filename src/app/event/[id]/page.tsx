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
    extraInformation: Record<string, any>;
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
    extraQuestions: any[];
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

const fetchTeams = async (id: string) => {
    const { data } = await axios.get<GetApiTeam>(`${env.NEXT_PUBLIC_API_URL}/api/team/event/${id}/registered_teams`, {
        headers: {
            Authorization: `Bearer 1000000`, // Replace with actual token
        },
    });
    return data.msg;
};

const Event = ({ params }: { params: EventParams }) => {
    const { data: eventName, error: nameError, isLoading: nameLoading } = useQuery({
        queryKey: ['eventName', params.id],
        queryFn: () => fetchEventName(params.id),
    });

    const { data: teams, error: teamsError, isLoading: teamsLoading } = useQuery({
        queryKey: ['eventTeams', params.id],
        queryFn: () => fetchTeams(params.id),
    });

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
        //CSV headers
        const headers = [{
            "Sl No.": "Sl No.",
            "Team Name": "Team Name",
            "Name": "Name",
            "Email": "Email",
            "Team Member Phone": "Team Member Phone",
            "College Name": "College Name"
        }];

        const filteredData = teams?.flatMap((team, teamIndex) => {
            // Add a row for the team index
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
        });

        // Combine the headers with the data
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

    if (nameLoading || teamsLoading) return <div>Loading...</div>;
    if (nameError || teamsError) return <div>Error fetching data</div>;

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
            <Button onClick = {downloadCSV} className="mt-6 text-lg font-mono font-bold" variant="outline">
                Download
            </Button>
        </main>
    );
};

export default Event;
