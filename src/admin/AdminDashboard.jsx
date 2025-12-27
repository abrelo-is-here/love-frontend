import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navb from '../Navbar.jsx';
import { Users, Loader, XCircle, Heart, Calendar, Lock } from 'lucide-react';

const API_ENDPOINT = 'https://love-backend-two.vercel.app/api/messages';
const PAGE_SIZE = 5;

export default function AdminDashboard() {
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isUnauthorized, setIsUnauthorized] = useState(false);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalMessages, setTotalMessages] = useState(0);

  useEffect(() => {
    const fetchMessages = async () => {
      setIsLoading(true);
      setError(null);
      setIsUnauthorized(false);

      const token = localStorage.getItem('token');

      if (!token) {
        setIsUnauthorized(true);
        setIsLoading(false);
        setError('Authentication token not found. Please log in as Admin.');
        return;
      }

      try {
        const response = await axios.get(
          `${API_ENDPOINT}?page=${currentPage}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setMessages(response.data.messages);
        setCurrentPage(response.data.currentPage);
        setTotalPages(response.data.totalPages);
        setTotalMessages(response.data.totalMessages);

      } catch (err) {
        if (err.response) {
          if (err.response.status === 401 || err.response.status === 403) {
            setIsUnauthorized(true);
            setError(`Access Denied. Status: ${err.response.status}`);
          } else {
            setError(
              `Server Error: ${err.response.data?.error || err.response.statusText}`
            );
          }
        } else if (err.request) {
          setError('Network Error: No response received from server.');
        } else {
          setError('An unexpected error occurred.');
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchMessages();
  }, [currentPage]);

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

  return (
    <div className="min-h-screen bg-gray-50">
      <Navb />

      <div className="container mx-auto px-4 py-8">

        {/* Header */}
        <div className="flex items-center justify-between border-b pb-4 mb-8">
          <h1 className="text-3xl font-extrabold text-indigo-700 flex items-center gap-3">
            <Users size={32} className="text-indigo-500" />
            Submission Records Dashboard
          </h1>
          <span className="bg-indigo-100 text-indigo-700 text-sm font-semibold px-3 py-1 rounded-full">
            Total Submissions: {totalMessages}
          </span>
        </div>

        {/* Loading */}
        {isLoading && (
          <div className="flex flex-col items-center justify-center p-12 bg-white rounded-xl shadow-lg">
            <Loader size={48} className="animate-spin text-indigo-500" />
            <p className="mt-4 text-xl font-medium text-gray-600">
              Loading submissions...
            </p>
          </div>
        )}

        {/* Unauthorized */}
        {isUnauthorized && (
          <div className="flex flex-col items-center justify-center p-12 bg-red-50 rounded-xl shadow-lg border border-red-300">
            <Lock size={48} className="text-red-500" />
            <h3 className="mt-4 text-2xl font-bold text-red-700">
              Access Denied
            </h3>
            <p className="mt-2 text-gray-600 text-center">
              You do not have administrative privileges or your session has expired.
            </p>
          </div>
        )}

        {/* Error */}
        {error && !isUnauthorized && (
          <div className="flex items-center p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
            <XCircle size={24} className="mr-3" />
            <p className="font-semibold">Error: {error}</p>
          </div>
        )}

        {/* Table */}
        {!isLoading && !error && !isUnauthorized && messages.length > 0 && (
          <>
            <div className="overflow-x-auto bg-white rounded-xl shadow-2xl">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-indigo-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                      #
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                      Submitter Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                      Crush Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase flex items-center gap-1">
                      <Calendar size={14} /> Submission Date
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-100">
                  {messages.map((message, index) => (
                    <tr key={message._id} className="hover:bg-indigo-50">
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">
                        {(currentPage - 1) * PAGE_SIZE + index + 1}
                      </td>
                      <td className="px-6 py-4 text-sm font-medium text-indigo-600">
                        {message.username}
                      </td>
                      <td className="px-6 py-4 text-sm font-semibold text-gray-800 flex items-center gap-2">
                        <Heart size={14} className="text-pink-500 fill-pink-500" />
                        {message.lovername}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {formatDate(message.createdAt)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="flex justify-center items-center gap-4 mt-6">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => p - 1)}
                className="px-4 py-2 bg-indigo-600 text-white rounded disabled:opacity-50"
              >
                Previous
              </button>

              <span className="text-sm font-semibold text-gray-700">
                Page {currentPage} of {totalPages}
              </span>

              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((p) => p + 1)}
                className="px-4 py-2 bg-indigo-600 text-white rounded disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </>
        )}

        {/* No Data */}
        {!isLoading && !error && !isUnauthorized && messages.length === 0 && (
          <div className="text-center p-12 bg-white rounded-xl shadow-lg border border-dashed border-gray-300">
            <Heart size={48} className="text-gray-400 mx-auto" />
            <h3 className="mt-4 text-xl font-medium text-gray-700">
              No Submissions Yet
            </h3>
          </div>
        )}

      </div>
    </div>
  );
}
