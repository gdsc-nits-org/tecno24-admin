'use client';
import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../utils/firebase";

const CompleteProfile = () => {
    const router = useRouter();
    const [user, loading, error] = useAuthState(auth);
    const [formData, setFormData] = useState({
        firstName: "",
        middleName: "",
        lastName: "",
        phoneNumber: "",
        username: "",
        collegeName: "",
        registrationId: "",
        balance: 0,
    });

    const handleChange = (e: any) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e: any) => {
        e.preventDefault();
        try {
            if (user) {
                const idToken = await user.getIdToken(); 
                const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/signup`, {
                    email: user.email,
                    firebaseId: user.uid,
                    imageUrl: user.photoURL,
                    ...formData,
                }, {
                    headers: {
                        Authorization: `Bearer ${idToken}`, 
                    },
                });

                if (response.status === 200) {
                    router.push('/dashboard');
                }
            }
        } catch (error) {
            console.error("Error submitting form:", error);
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-900">
            <form
                onSubmit={handleSubmit}
                className="bg-gray-800 p-6 rounded-lg shadow-md w-full max-w-md"
            >
                <h2 className="text-2xl font-bold mb-6 text-center text-white">Complete Your Profile</h2>

                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-300">First Name</label>
                    <input
                        type="text"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleChange}
                        required
                        className="mt-1 block w-full px-3 py-2 border border-gray-600 bg-gray-700 text-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                </div>

                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-300">Middle Name</label>
                    <input
                        type="text"
                        name="middleName"
                        value={formData.middleName}
                        onChange={handleChange}
                        className="mt-1 block w-full px-3 py-2 border border-gray-600 bg-gray-700 text-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                </div>

                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-300">Last Name</label>
                    <input
                        type="text"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleChange}
                        required
                        className="mt-1 block w-full px-3 py-2 border border-gray-600 bg-gray-700 text-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                </div>

                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-300">Phone Number</label>
                    <input
                        type="text"
                        name="phoneNumber"
                        value={formData.phoneNumber}
                        onChange={handleChange}
                        required
                        className="mt-1 block w-full px-3 py-2 border border-gray-600 bg-gray-700 text-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                </div>

                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-300">Username</label>
                    <input
                        type="text"
                        name="username"
                        value={formData.username}
                        onChange={handleChange}
                        required
                        className="mt-1 block w-full px-3 py-2 border border-gray-600 bg-gray-700 text-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                </div>

                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-300">College Name</label>
                    <input
                        type="text"
                        name="collegeName"
                        value={formData.collegeName}
                        onChange={handleChange}
                        required
                        className="mt-1 block w-full px-3 py-2 border border-gray-600 bg-gray-700 text-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                </div>

                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-300">Registration ID</label>
                    <input
                        type="text"
                        name="registrationId"
                        value={formData.registrationId}
                        onChange={handleChange}
                        required
                        className="mt-1 block w-full px-3 py-2 border border-gray-600 bg-gray-700 text-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                </div>

                <button
                    type="submit"
                    className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                >
                    Submit
                </button>
            </form>
        </div>
    );
}

export default CompleteProfile;
