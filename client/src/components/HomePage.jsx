import React from 'react';
import { Link } from 'react-router-dom';

const HomePage = ({ isAuthenticated }) => {
  return (
    <div className="h-full w-full flex flex-col items-center justify-center ">
      <div className="max-w-4xl w-full text-center space-y-6 px-4">
        <h1 className="text-4xl md:text-5xl font-bold text-blue-600">
          FutureBlink
        </h1>
        
        <h2 className="text-2xl md:text-3xl font-semibold text-gray-700">
          Automated Cold Email Workflow Builder
        </h2>
        
        <div className="space-y-4 md:space-y-6">
          <p className="text-lg md:text-xl text-gray-600">
            Design automated email sequences that convert leads into customers. 
            Create workflows with multiple touchpoints, wait periods, and smart branching logic.
          </p>
          
          <div className="flex flex-wrap gap-4 justify-center py-4">
            <div className="bg-white p-4 rounded-lg shadow-md hover:shadow-xl hover:shadow-blue-200 w-64 text-center ">
              <div className="text-blue-500 font-bold mb-2">Lead Sources</div>
              <p className="text-gray-600">Import leads from CRM or custom lists</p>
            </div>
            
            <div className="bg-white p-4 rounded-lg shadow-md hover:shadow-xl hover:shadow-blue-200 w-64 text-center">
              <div className="text-blue-500 font-bold mb-2">Email Templates</div>
              <p className="text-gray-600">Create and customize professional templates</p>
            </div>
            
            <div className="bg-white p-4 rounded-lg shadow-md hover:shadow-xl hover:shadow-blue-200 w-64 text-center">
              <div className="text-blue-500 font-bold mb-2">Smart Scheduling</div>
              <p className="text-gray-600">Set optimal timing between touchpoints</p>
            </div>
          </div>
        </div>
        
        <div className="mt-8 md:mt-12">
          {isAuthenticated ? (
            <Link 
              to="/dashboard" 
              className="bg-blue-400 hover:bg-blue-700  text-white py-3 px-8 rounded-full text-lg font-medium shadow-lg  hover:scale-105"
            >
              Go to Dashboard
            </Link>
          ) : (
            <div className="space-y-4">
              <span className="bg-blue-600 hover:bg-blue-700 text-white py-3 px-8 rounded-full text-lg font-medium shadow-lg transition-all hover:scale-105 block mx-auto max-w-xs">
              
                Login to Start Building
              </span>
              <p className="text-gray-500">Create your own automated email workflows</p>
            </div>
          )}
        </div>
      </div>
      
      
    </div>
  );
};

export default HomePage;