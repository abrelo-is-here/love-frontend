import React, { useState, useEffect } from 'react';
import axios from 'axios'; // Import Axios
import Navb from '../Navbar.jsx';
import { Users, Loader, XCircle, Heart, Calendar, Lock } from 'lucide-react'; 

// Define the API endpoint
const API_ENDPOINT = 'https://love-backend-two.vercel.app/api/messages';

export default function AdminDashboard() {
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isUnauthorized, setIsUnauthorized] = useState(false);

  // --- Data Fetching Logic using Axios ---
  useEffect(() => {
    const fetchMessages = async () => {
      setIsLoading(true);
      setError(null);
      setIsUnauthorized(false);
      
      const token = localStorage.getItem('token'); 
      console.log(token)

      if (!token) {
        setIsUnauthorized(true);
        setIsLoading(false);
        setError("Authentication token not found. Please log in as Admin.");
        return;
      }
      
      try {
        // Axios GET request with Authorization header
        const response = await axios.get(API_ENDPOINT, {
          headers: {
            // Attach the token in the Authorization header
            'Authorization': `Bearer ${token}`, 
          }
        });

        // Axios automatically parses JSON and throws an error for 4xx/5xx responses, 
        // simplifying the success check.
        setMessages(response.data);
        
      } catch (err) {
        // Axios error handling is centralized in the catch block
        if (err.response) {
            // Server responded with a status other than 2xx
            if (err.response.status === 401 || err.response.status === 403) {
                // Unauthorized or Forbidden access (due to your protect/authorize middleware)
                setIsUnauthorized(true);
                setError(`Access Denied. Status: ${err.response.status}`);
            } else {
                // Other server errors (e.g., 500)
                setError(`Server Error: ${err.response.data.error || err.response.statusText}`);
            }
        } else if (err.request) {
            // Request was made but no response received (e.g., network error)
            setError("Network Error: No response received from server.");
        } else {
            // Something else happened
            setError("An unexpected error occurred during the request setup.");
        }
        
      } finally {
        setIsLoading(false);
      }
    };

    fetchMessages();
  }, []); // Empty dependency array means this runs once on mount

  // --- Utility Function for Formatting Date ---
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // --- UI Rendering ---
  return (
    <div className="min-h-screen bg-gray-50">
      <Navb />
      
      <div className="container mx-auto px-4 py-8">
        
        {/* Header Section */}
        <div className="flex items-center justify-between border-b pb-4 mb-8">
            <h1 className="text-3xl font-extrabold text-indigo-700 flex items-center gap-3">
                <Users size={32} className="text-indigo-500" />
                Submission Records Dashboard
            </h1>
            <span className="bg-indigo-100 text-indigo-700 text-sm font-semibold px-3 py-1 rounded-full">
                Total Submissions: {messages.length}
            </span>
        </div>

        {/* --- Feedback States (Loading, Error, Unauthorized) --- */}
        
        {isLoading && (
          <div className="flex flex-col items-center justify-center p-12 bg-white rounded-xl shadow-lg">
            <Loader size={48} className="animate-spin text-indigo-500" />
            <p className="mt-4 text-xl font-medium text-gray-600">Loading names from the server...</p>
          </div>
        )}

        {isUnauthorized && (
            <div className="flex flex-col items-center justify-center p-12 bg-red-50 rounded-xl shadow-lg border border-red-300">
                <Lock size={48} className="text-red-500" />
                <h3 className="mt-4 text-2xl font-bold text-red-700">Access Denied</h3>
                <p className="mt-2 text-gray-600 text-center">
                    You do not have administrative privileges or your session has expired. Please log in.
                </p>
            </div>
        )}

        {error && !isUnauthorized && (
          <div className="flex items-center p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg" role="alert">
            <XCircle size={24} className="mr-3 flex-shrink-0" />
            <p className="font-semibold">Error: {error}</p>
          </div>
        )}

        {/* --- Data Table --- */}
        {!isLoading && !error && !isUnauthorized && messages.length > 0 && (
          <div className="overflow-x-auto bg-white rounded-xl shadow-2xl">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-indigo-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    #
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Submitter Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Crush Name (Prank Target)
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider flex items-center gap-1">
                    <Calendar size={14}/> Submission Date
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-100">
                {messages.map((message, index) => (
                  <tr key={message._id} className="hover:bg-indigo-50 transition duration-100">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {index + 1}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-indigo-600">
                      {message.username}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 font-semibold flex items-center gap-2">
                       <Heart size={14} className="text-pink-500 fill-pink-500"/>
                      {message.lovername}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(message.createdAt)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        
        {/* No Data State */}
        {!isLoading && !error && !isUnauthorized && messages.length === 0 && (
          <div className="text-center p-12 bg-white rounded-xl shadow-lg border border-dashed border-gray-300">
            <Heart size={48} className="text-gray-400 mx-auto" />
            <h3 className="mt-4 text-xl font-medium text-gray-700">No Submissions Yet</h3>
            <p className="mt-1 text-gray-500">The "Abreham" recipient must be waiting patiently...</p>
          </div>
        )}

      </div>
    </div>
  );
}