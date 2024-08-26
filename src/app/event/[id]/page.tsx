'use client';
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "~/components/ui/accordion"
import { Button } from "~/components/ui/button";

interface eventParams {
    id: string
}

export const runtime = "edge";
const accordionData = [
    {
        id: 'item-1',
        trigger: 'Is it accessible?',
        content: 'Yes. It adheres to the WAI-ARIA design pattern.',
    },
    {
        id: 'item-2',
        trigger: 'How do I use it?',
        content: 'You can use it by importing the component and passing the required props.',
    },
    {
        id: 'item-3',
        trigger: 'Is it customizable?',
        content: 'Yes, you can customize it to suit your needs.',
    },
];

//downloadCsv
// const jsonToCSV = (data: any[]): string => {
//     const headers = Object.keys(data[0]);
//     const csvRows = [headers.join(',')];
  
//     for (const row of data) {
//       const values = headers.map(header => {
//         const value = row[header];
//         return typeof value === 'string' ? `"${value.replace(/"/g, '""')}"` : value;
//       });
//       csvRows.push(values.join(','));
//     }
  
//     return csvRows.join('\n');
//   };
//   const downloadCSV = async () => {
//     try {
//       const response = await fetch('/api/get-teams'); // Adjust the API endpoint
//       if (!response.ok) {
//         throw new Error('Network response was not ok');
//       }
  
//       const jsonData = await response.json();
//       const csvData = jsonToCSV(jsonData);
  
//       const blob = new Blob([csvData], { type: 'text/csv' });
//       const url = window.URL.createObjectURL(blob);
//       const link = document.createElement('a');
//       link.href = url;
//       link.setAttribute('download', 'teams.csv');
//       document.body.appendChild(link);
//       link.click();
//       document.body.removeChild(link);
//     } catch (error) {
//       console.error('Error downloading the CSV:', error);
//     }
//   };

const Event = ({params}: { params: eventParams }) => {
    console.log(params.id);
    return (
        <>
            <main className="flex flex-col justify-center items-center w-screen h-screen ">
                <div className="flex flex-row justify-center items-center w-screen text-4xl font-mono font-bold uppercase py-8 my-10"> Robowar </div>
                <div className="flex flex-col justify-center items-center w-screen py-10 my-5">
                    <Accordion type="single" collapsible className="w-1/3 py-0 flex flex-col gap-3">
                        {accordionData.map((item,i) => (
                            <AccordionItem key={i} value={item.id}>
                                <AccordionTrigger>{item.trigger}</AccordionTrigger>
                                <AccordionContent>{item.content}</AccordionContent>
                            </AccordionItem>
                        ))}
                    </Accordion>
                </div>
                <Button className="w-35 text-lg  font-mono font-bold" variant="outline">Download</Button>
            </main>
        </>
    );
}

export default Event;