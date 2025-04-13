import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

const Dashboard = () => {
  const navigate = useNavigate();
  const [view, setView] = useState('grid');
  
  const getUserId = () => {
    try {
      const token = localStorage.getItem('token');
      if (token) {
        const tokenParts = token.split('.');
        const payload = JSON.parse(atob(tokenParts[1]));
        return payload.id;
      }
      
      return null;
    } catch (error) {
      console.error('Error getting user ID:', error);
      return null;
    }
  };

  const userId = getUserId();

  const { data, isLoading, isError } = useQuery({
    queryKey: ['workflows-list'],
    queryFn: () => axios.get(`http://localhost:4000/api/users/${userId}/workflows`).then(res => res.data)
  });

  const workflows = Array.isArray(data) ? data : [];

  if (isLoading) return (
    <div className="min-h-screen pt-20 flex items-center justify-center">
      <div className="animate-pulse flex flex-col items-center">
        <div className="h-10 w-40 bg-gray-200 rounded mb-4"></div>
        <div className="h-32 w-full max-w-md bg-gray-200 rounded"></div>
      </div>
    </div>
  );
  
  if (isError) return (
    <div className="min-h-screen pt-20 p-6 flex items-center justify-center">
      <div className="bg-red-50 border border-red-200 text-red-700 p-6 rounded-lg max-w-md text-center">
        <h2 className="text-xl font-semibold mb-2">Error Loading Workflows</h2>
        <p>We couldn't load your workflows. Please try again later.</p>
        <button onClick={() => window.location.reload()} className="mt-4 bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700">
          Retry
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen pt-16 p-6 w-full bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white p-6 rounded-xl shadow-sm mb-6">
          <div className="flex flex-col md:flex-row md:justify-between md:items-center space-y-4 md:space-y-0">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">
                Your Workflows
              </h1>
              <p className="text-gray-500 mt-1">Manage and monitor your email workflows</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="bg-gray-100 p-1 rounded-lg flex">
                <button 
                  onClick={() => setView('grid')}
                  className={`px-3 py-1 rounded-md transition-all ${view === 'grid' ? 'bg-white shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                  </svg>
                </button>
                <button 
                  onClick={() => setView('list')}
                  className={`px-3 py-1 rounded-md transition-all ${view === 'list' ? 'bg-white shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
              <button 
                onClick={() => navigate('/create-workflow')}
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 flex items-center gap-2 transition-all shadow-sm hover:shadow"
              >
                <span>+</span> Create Campaign
              </button>
            </div>
          </div>
        </div>

        {workflows.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm p-10 text-center">
            <div className="max-w-md mx-auto">
              <div className="bg-blue-50 h-32 w-32 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <h2 className="text-2xl font-semibold text-gray-800 mb-2">No Campaigns Yet</h2>
              <p className="text-gray-500 mb-6">Create your first email campaign to start engaging with your audience.</p>
              <button 
                onClick={() => navigate('/create-workflow')}
                className="bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 inline-flex items-center gap-2 transition-all shadow-sm hover:shadow"
              >
                <span>+</span> Create Your First Campaign
              </button>
            </div>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <div className="bg-white p-6 rounded-xl shadow-sm">
                <h3 className="text-gray-500 text-sm font-medium">Total Campaigns</h3>
                <p className="text-3xl font-bold text-gray-800 mt-1">{workflows.length}</p>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-sm">
                <h3 className="text-gray-500 text-sm font-medium">Scheduled Campaigns</h3>
                <p className="text-3xl font-bold text-gray-800 mt-1">
                  {workflows.filter(wf => wf.sequenceSettings?.launchDate).length}
                </p>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-sm">
                <h3 className="text-gray-500 text-sm font-medium">Latest Campaign</h3>
                <p className="text-xl font-semibold text-gray-800 mt-1 truncate">
                  {workflows.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))[0]?.name || 'None'}
                </p>
              </div>
            </div>

            {view === 'grid' ? (
              <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                {workflows.map((wf) => (
                  <div
                    key={wf._id}
                    className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-all cursor-pointer border border-gray-100 group"
                    onClick={() => navigate(`/workflow/${wf._id}`)}
                  >
                    <div className="flex justify-between items-start mb-3">
                      <h2 className="text-xl font-semibold text-gray-800 group-hover:text-blue-600 transition-colors truncate pr-2">
                        {wf.name || `Workflow #${wf._id.slice(0, 6).toUpperCase()}`}
                      </h2>
                      <span className="bg-blue-50 text-blue-600 text-xs px-2 py-1 rounded-full">
                        {wf.sequenceSettings?.launchDate ? 'Scheduled' : 'Draft'}
                      </span>
                    </div>

                    <div className="flex items-center text-sm text-gray-500 mb-4">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      Created: {new Date(wf.createdAt).toLocaleDateString()}
                    </div>
                    
                    {wf.sequenceSettings?.launchDate && (
                      <div className="bg-blue-50 p-3 rounded-lg mb-4">
                        <div className="flex items-start">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <div>
                            <p className="text-sm font-medium text-blue-700">Scheduled for:</p>
                            <p className="text-sm text-blue-600">
                              {new Date(wf.sequenceSettings.launchDate).toLocaleString()}
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                    
                    <div className="flex justify-between items-center">
                      <div className="text-xs text-gray-500">
                        ID: {wf._id.slice(0, 6).toUpperCase()}
                      </div>
                      <button className="text-sm text-blue-600 hover:text-blue-800 font-medium">
                        View Details →
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Scheduled</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {workflows.map((wf) => (
                      <tr key={wf._id} className="hover:bg-gray-50 cursor-pointer" onClick={() => navigate(`/workflow/${wf._id}`)}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{wf.name || 'Untitled Campaign'}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${wf.sequenceSettings?.launchDate ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                            {wf.sequenceSettings?.launchDate ? 'Scheduled' : 'Draft'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(wf.createdAt).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {wf.sequenceSettings?.launchDate ? new Date(wf.sequenceSettings.launchDate).toLocaleString() : '-'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {wf._id.slice(0, 6).toUpperCase()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <button 
                            className="text-blue-600 hover:text-blue-900"
                            onClick={(e) => {
                              e.stopPropagation();
                              navigate(`/workflow/${wf._id}`);
                            }}
                          >
                            Edit
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
