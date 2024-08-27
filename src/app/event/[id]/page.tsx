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

interface eventParams {
    id: string
}

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
//download csv
const jsonToCSV = (data: any[]): string => {
    if (data.length === 0) return '';
  
    const headers = Object.keys(data[0]);
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
  
      const jsonData = await response.json();
      
      // Filter or map the data as needed
      const filteredData = jsonData.map((item: any) => ({
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

const Event = ({ params }: { params: eventParams }) => {
    // console.log(params.id);
    return (
        <main className="flex flex-col justify-center items-center h-screen  p-4">
            <div className="flex flex-row justify-center items-center w-full text-4xl font-mono font-bold uppercase py-8 my-10 text-center">
                Robowar
            </div>
            {tablesData.map((table) => (
                <div key={table.id} className="w-full max-w-4xl p-4 mb-6">
                    <Table className="w-full  shadow-md rounded-lg">
                        <TableCaption>{table.caption}</TableCaption>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-[100px]">Invoice</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Method</TableHead>
                                <TableHead className="text-right">Amount</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {table.rows.map((row, index) => (
                                <TableRow key={index}>
                                    <TableCell className="font-medium">{row.invoice}</TableCell>
                                    <TableCell>{row.status}</TableCell>
                                    <TableCell>{row.method}</TableCell>
                                    <TableCell className="text-right">{row.amount}</TableCell>
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