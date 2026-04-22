import { useState, useEffect } from 'react';
import api from '../api/client';

const BugTracker = () => {
    const [bugs, setBugs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [tasks, setTasks] = useState([]);
    const [users, setUsers] = useState([]); // To assign devs
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        severity: 'Medium',
        task: '',
        assignedTo: ''
    });

    const fetchData = async () => {
        try {
            const [bugsRes, tasksRes, usersRes] = await Promise.all([
                api.get('/bugs'),
                api.get('/tasks'),
                api.get('/users') // HR/Manager might need to expose this more broadly or filter for Devs
            ]);
            setBugs(bugsRes.data);
            setTasks(tasksRes.data);
            setUsers(usersRes.data.filter(u => u.role === 'Developer'));
        } catch (err) {
            console.error('Failed to fetch data');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.post('/bugs', formData);
            setShowForm(false);
            fetchData();
        } catch (err) {
            alert('Failed to report bug');
        }
    };

    const handleStatusUpdate = async (id, newStatus) => {
        try {
            await api.put(`/bugs/${id}`, { status: newStatus });
            setBugs(bugs.map(b => b._id === id ? { ...b, status: newStatus } : b));
        } catch (err) {
            alert('Failed to update status');
        }
    };

    if (loading) return <div>Loading bugs...</div>;

    return (
        <div className="bg-white shadow rounded-lg p-6">
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-red-600">Bug Tracker</h3>
                <button onClick={() => setShowForm(!showForm)} className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700">
                    {showForm ? 'Cancel' : 'Report Bug'}
                </button>
            </div>

            {showForm && (
                <form onSubmit={handleSubmit} className="mb-8 bg-red-50 p-4 rounded border border-red-200">
                    <div className="grid grid-cols-1 gap-4">
                        <input type="text" placeholder="Bug Title" className="p-2 border rounded w-full"
                            value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} required />

                        <textarea placeholder="Description" className="p-2 border rounded w-full" rows="3"
                            value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} required />

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <select className="p-2 border rounded" value={formData.severity} onChange={e => setFormData({ ...formData, severity: e.target.value })}>
                                <option>Low</option>
                                <option>Medium</option>
                                <option>High</option>
                                <option>Critical</option>
                            </select>

                            <select className="p-2 border rounded" value={formData.task} onChange={e => setFormData({ ...formData, task: e.target.value })}>
                                <option value="">Select Related Task</option>
                                {tasks.map(t => <option key={t._id} value={t._id}>{t.name}</option>)}
                            </select>

                            <select className="p-2 border rounded" value={formData.assignedTo} onChange={e => setFormData({ ...formData, assignedTo: e.target.value })}>
                                <option value="">Assign Developer</option>
                                {users.map(u => <option key={u._id} value={u._id}>{u.name}</option>)}
                            </select>
                        </div>

                        <button type="submit" className="bg-red-600 text-white px-4 py-2 rounded self-start w-32">Submit Bug</button>
                    </div>
                </form>
            )}

            <div className="space-y-4">
                {bugs.map(bug => (
                    <div key={bug._id} className="border-l-4 border-red-500 bg-gray-50 p-4 rounded shadow-sm">
                        <div className="flex justify-between">
                            <h4 className="font-bold text-lg">{bug.title}</h4>
                            <select className="text-sm border rounded p-1" value={bug.status} onChange={(e) => handleStatusUpdate(bug._id, e.target.value)}>
                                <option>Open</option>
                                <option>In Progress</option>
                                <option>Resolved</option>
                                <option>Closed</option>
                            </select>
                        </div>
                        <p className="text-gray-700 mt-1">{bug.description}</p>
                        <div className="mt-3 flex space-x-4 text-xs text-gray-500">
                            <span>Severity: <strong className={bug.severity === 'Critical' ? 'text-red-600' : ''}>{bug.severity}</strong></span>
                            <span>Reported By: {bug.reportedBy?.name || 'Unknown'}</span>
                            <span>Assigned To: {bug.assignedTo?.name || 'Unassigned'}</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default BugTracker;
