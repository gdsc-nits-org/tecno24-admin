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

interface EventParams {
    id: string;
}

interface UserData {
    avatar_url: string;
    login: string;
}

export const runtime = "edge";
const tablesData = [
    {
        id: 1,
        caption: 'Invoices for August',
        rows: [
            { invoice: 'INV001', status: 'Paid', method: 'Credit Card', amount: '$250.00' },
            { invoice: 'INV002', status: 'Pending', method: 'PayPal', amount: '$75.00' },
        ],
    },
    {
        id: 2,
        caption: 'Invoices for September',
        rows: [
            { invoice: 'INV003', status: 'Paid', method: 'Bank Transfer', amount: '$400.00' },
            { invoice: 'INV004', status: 'Overdue', method: 'Credit Card', amount: '$150.00' },
        ],
    },
];

// Convert JSON to CSV
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

const downloadCSV = async () => {
    try {
        const response = await fetch('https://api.github.com/users'); // Adjust the API endpoint
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const jsonData: UserData[] = await response.json() as UserData[];;
        const filteredData = jsonData.map((item: UserData) => ({
            field1: item.avatar_url,
            field2: item.login,
        }));
        const csvData = jsonToCSV(filteredData);
        const blob = new Blob([csvData], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'teams.csv');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    } catch (error) {
        console.error('Error downloading the CSV:', error);
    }
};
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
    eventId: string;
    eventName: string;
}

const Event = ({ params }: { params: EventParams }) => {
    const [teams, setTeams] = useState<Team[]>([]);
    const { eventId, eventName } = params;

    useEffect(() => {
        const fetchTeams = async () => {
            try {
                const response = await axios.get(`${env.NEXT_PUBLIC_API_URL}/api/team/event/${eventId}/registered_teams`);
                setTeams(response.data);
            } catch (error) {
                console.error("Error fetching team data:", error);
            }
        };

        fetchTeams();
    }, [eventId]);

    return (
        <main className="flex flex-col justify-center items-center h-screen p-4">
        <div className="flex flex-row justify-center items-center w-full text-4xl font-mono font-bold uppercase py-8 my-10 text-center">
            {eventName}
        </div>
        {teams.map((team, teamIndex) => (
            <div key={team.id} className="w-full max-w-4xl p-4 mb-6">
                <Table className="w-full shadow-md rounded-lg">
                    <TableCaption className="text-left py-2 font-semibold">{`Team ${teamIndex + 1}: ${team.teamName}`}</TableCaption>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[50px]">Sl No.</TableHead>
                            <TableHead>Team Name</TableHead>
                            <TableHead>Team Member Name</TableHead>
                            <TableHead>Registration Status</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {team.members.map((member, memberIndex) => (
                            <TableRow key={member.id}>
                                <TableCell className="font-medium">{memberIndex + 1}</TableCell>
                                <TableCell>{team.teamName}</TableCell>
                                <TableCell>{`${member.firstName} ${member.middleName ? member.middleName + ' ' : ''}${member.lastName}`}</TableCell>
                                <TableCell>{team.registrationStatus}</TableCell>
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