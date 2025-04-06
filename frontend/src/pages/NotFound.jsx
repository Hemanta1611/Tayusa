import React from 'react';
import { Link } from 'react-router-dom';
import { FaHome, FaExclamationTriangle } from 'react-icons/fa';

function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4">
      <div className="text-center">
        <FaExclamationTriangle className="mx-auto h-16 w-16 text-yellow-500" />
        <h1 className="mt-4 text-4xl font-bold text-gray-900">Page Not Found</h1>
        <p className="mt-2 text-lg text-gray-600">
          Sorry, we couldn't find the page you're looking for.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
          >
            <FaHome className="mr-2" />
            Go back home
          </Link>
        </div>
      </div>
    </div>
  );
}

export default NotFound;
