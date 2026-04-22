import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { getTasksApi } from '../api';

const Dashboard = () => {
  const { user } = useSelector((state) => state.auth);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchTasks = async () => {
    try {
      setLoading(true);
      // Example authorized API call
      const response = await getTasksApi();
      setTasks(response.data.data || []);
      setError('');
    } catch (err) {
      console.error('Error fetching tasks', err);
      // Let's degrade gracefully if API fails or doesn't exist yet
      setError('Could not fetch tasks. The API might not be implemented yet.');
      setTasks([]); 
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // fetchTasks();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-8">
        <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
          <div>
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              Welcome to Dashboard
            </h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">
              Hello, {user?.name || user?.email || 'User'}!
            </p>
          </div>
          <button
            onClick={fetchTasks}
            className="px-4 py-2 bg-indigo-100 text-indigo-700 rounded-md hover:bg-indigo-200 transition-colors"
          >
            Refresh Data
          </button>
        </div>
      </div>

      <div className="bg-white shadow sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
          <h3 className="text-lg leading-6 font-medium text-gray-900">
            Your Tasks
          </h3>
        </div>
        
        <div className="p-6">
          {loading ? (
            <p className="text-gray-500 text-center py-4">Loading data...</p>
          ) : error ? (
            <div className="bg-yellow-50 p-4 rounded-md text-yellow-700 text-sm italic">
              {error}
              <p className="mt-2 text-xs">Note: This is expected if the backend API is not responding or not set up yet.</p>
            </div>
          ) : tasks.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No tasks found. Create one?</p>
          ) : (
            <ul className="divide-y divide-gray-200">
              {tasks.map((task) => (
                <li key={task._id || task.id} className="py-4">
                  <div className="flex space-x-3">
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center justify-between">
                        <h3 className="text-sm font-medium">{task.title}</h3>
                        <p className="text-sm text-gray-500">{new Date(task.createdAt).toLocaleDateString()}</p>
                      </div>
                      <p className="text-sm text-gray-500">{task.description}</p>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
