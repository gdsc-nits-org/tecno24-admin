"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import axios, { AxiosError } from "axios";
import { toast } from "sonner";
import { auth } from "~/app/utils/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { Spinner } from "~/components/ui/spinner";
import { Button } from "~/components/ui/button";

export const runtime = "edge";

export default function CreateEventForm({ params }: { params: { id: string } }) {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    registrationStartTime: "",
    registrationEndTime: "",
    minTeamSize: "",
    maxTeamSize: "",
    posterImage: null as File | null,
    prizeDescription: "",
    stagesDescription: "",
    venue: "",
  });

  const [user, loading] = useAuthState(auth);
  const router = useRouter();

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    setFormData((prev) => ({ ...prev, posterImage: file }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const token = await user?.getIdToken();
    if (!token) {
      toast.error("You must be logged in to create an event.");
      return;
    }

    const data = new FormData();

    // Append fields individually to maintain proper types
    data.append("name", formData.name);
    data.append("description", formData.description);
    data.append("registrationStartTime", formData.registrationStartTime);
    data.append("registrationEndTime", formData.registrationEndTime);
    data.append("minTeamSize", formData.minTeamSize);
    data.append("maxTeamSize", formData.maxTeamSize);
    data.append("prizeDescription", formData.prizeDescription);
    data.append("stagesDescription", formData.stagesDescription);
    data.append("venue", formData.venue);
    data.append("moduleId", params.id);

    // Append file if present
    if (formData.posterImage) {
      data.append("posterImage", formData.posterImage);
    }

    // Optional organizers (if needed later)
    // data.append("organizers", JSON.stringify(["userId1", "userId2"]));

    // Debug check
    for (const [key, value] of data.entries()) {
      console.log(key, value);
    }

    toast.promise(
      axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/event/create`, data, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      }),
      {
        loading: "Creating event...",
        success: () => {
          setTimeout(() => router.push(`/module/${params.id}`), 500);
          return "Event created successfully";
        },
        error: (err: AxiosError<{ msg?: string }>) =>
          err.response?.data?.msg ?? "An unexpected error occurred.",
      }
    );
  };

  if (loading) {
    return (
      <div className="flex h-screen w-screen items-center justify-center gap-3">
        <Spinner size="large" />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-900 py-6">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md space-y-6 rounded-lg bg-gray-800 p-6 shadow-lg"
      >
        <h2 className="text-xl font-semibold text-white text-center">
          Create New Event
        </h2>

        {/* Event Name */}
        <div>
          <label className="block text-sm font-medium text-white">
            Event Name
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Enter event name"
            required
            className="mt-1 block w-full rounded-md bg-black text-white border border-gray-700 p-2"
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-white">
            Description
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Describe the event"
            required
            className="mt-1 block w-full rounded-md bg-black text-white border border-gray-700 p-2"
          />
        </div>

        {/* Registration Start Time */}
        <div>
          <label className="block text-sm font-medium text-white">
            Registration Start
          </label>
          <input
            type="datetime-local"
            name="registrationStartTime"
            value={formData.registrationStartTime}
            onChange={handleChange}
            required
            className="mt-1 block w-full rounded-md border border-gray-700 p-2 text-black"
          />
        </div>

        {/* Registration End Time */}
        <div>
          <label className="block text-sm font-medium text-white">
            Registration End
          </label>
          <input
            type="datetime-local"
            name="registrationEndTime"
            value={formData.registrationEndTime}
            onChange={handleChange}
            required
            className="mt-1 block w-full rounded-md border border-gray-700 p-2 text-black"
          />
        </div>

        {/* Team Sizes */}
        <div className="flex gap-3">
          <div className="flex-1">
            <label className="block text-sm font-medium text-white">
              Min Team Size
            </label>
            <input
              type="number"
              name="minTeamSize"
              value={formData.minTeamSize}
              onChange={handleChange}
              placeholder="e.g. 1"
              required
              className="mt-1 block w-full rounded-md bg-black text-white border border-gray-700 p-2"
            />
          </div>
          <div className="flex-1">
            <label className="block text-sm font-medium text-white">
              Max Team Size
            </label>
            <input
              type="number"
              name="maxTeamSize"
              value={formData.maxTeamSize}
              onChange={handleChange}
              placeholder="e.g. 5"
              required
              className="mt-1 block w-full rounded-md bg-black text-white border border-gray-700 p-2"
            />
          </div>
        </div>

        {/* Poster Image */}
        <div>
          <label className="block text-sm font-medium text-white">
            Poster Image
          </label>
          <input
            type="file"
            name="posterImage"
            accept="image/*"
            onChange={handleFileChange}
            required
            className="mt-1 block w-full rounded-md bg-black text-white border border-gray-700 p-2"
          />
        </div>

        {/* Prize Description */}
        <div>
          <label className="block text-sm font-medium text-white">
            Prize Description
          </label>
          <textarea
            name="prizeDescription"
            value={formData.prizeDescription}
            onChange={handleChange}
            placeholder="Describe prizes or rewards"
            className="mt-1 block w-full rounded-md bg-black text-white border border-gray-700 p-2"
          />
        </div>

        {/* Stages Description */}
        <div>
          <label className="block text-sm font-medium text-white">
            Stages Description
          </label>
          <textarea
            name="stagesDescription"
            value={formData.stagesDescription}
            onChange={handleChange}
            placeholder="e.g., Round 1, Round 2..."
            className="mt-1 block w-full rounded-md bg-black text-white border border-gray-700 p-2"
          />
        </div>

        {/* Venue */}
        <div>
          <label className="block text-sm font-medium text-white">
            Venue
          </label>
          <input
            type="text"
            name="venue"
            value={formData.venue}
            onChange={handleChange}
            placeholder="Enter venue"
            required
            className="mt-1 block w-full rounded-md bg-black text-white border border-gray-700 p-2"
          />
        </div>

        <Button type="submit" className="w-full">
          Create Event
        </Button>
      </form>
    </div>
  );
}