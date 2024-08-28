'use client';
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "~/components/ui/table"

import { Button } from "~/components/ui/button";
import { useState, useEffect } from "react";
import axios from "axios";
import { env } from "~/env";
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
    extraInformation: Record<string, any>[];
    eventId: string;
}

interface EventParams {
    id: string;
}
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

const Event = ({ params }: { params: EventParams }) => {
    const [name, setName] = useState("");
    const [teams, setTeams] = useState<Team[]>([]);
    useEffect(() => {
        // console.log(params.id)
        const fetchTeams = async () => {
            try {
                const name = await axios.get(`${env.NEXT_PUBLIC_API_URL}/api/event/${params.id}`)
                const response = await axios.get(`${env.NEXT_PUBLIC_API_URL}/api/team/event/${params.id}/registered_teams`,
                    {
                        headers: {
                            'Authorization': `Bearer 1000000`
                        }
                    })
                console.log(response.data.msg)
                setTeams(response.data.msg);
                setName(name.data.msg.name);
            } catch (error) {
                console.error("Error fetching team data:", error);
            }
        };

        fetchTeams();
    }, []);

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

        const filteredData = teams.flatMap((team, teamIndex) => {
            // Add a row for the team index
            const teamHeader = [{
                "Sl No.": `Team ${teamIndex + 1}`,
                "Team Name": team.teamName,
                "Name": '',
                "Email": '',
                "Team Member Phone": '',
                "College Name": ''
            }];

            // Add members of the team
            const teamMembers = team.members.map((member, memberIndex) => ({
                "Sl No.": memberIndex + 1,
                "Team Name": '',
                "Name": `${member.firstName} ${member.middleName ? member.middleName + ' ' : ''}${member.lastName}`,
                "Email": member.email,
                "Team Member Phone": member.phoneNumber,
                "College Name": member.collegeName
            }));

            // Return the combined array of the team header, members, and  empty rows for spacing
            return [...teamHeader, ...teamMembers, {}, {}];
        });

        // Combine the headers with the data
        const csvData = jsonToCSV([...headers, ...filteredData]);
        const blob = new Blob([csvData], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `${name}`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };


    return (
        <main className="flex flex-col justify-center items-center h-screen p-4">
            <div className="flex flex-row justify-center items-center w-full text-4xl font-mono font-bold uppercase py-8 my-10 text-center">
                {name}
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
            <Button onClick={downloadCSV} className="mt-6 text-lg font-mono font-bold" variant="outline">
                Download
            </Button>
        </main>
    );
}

export default Event;