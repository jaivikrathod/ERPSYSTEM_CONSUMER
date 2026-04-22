import { useState, useEffect } from 'react';
import api from '../api/client';

const SprintList = () => {
    const [sprints, setSprints] = useState([]);
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        goal: '',
        startDate: '',
        endDate: '',
        project: ''
    });

    const fetchData = async () => {
        try {
            const [sprintsRes, projectsRes] = await Promise.all([
                api.get('/sprints'),
                api.get('/projects')
            ]);
            setSprints(sprintsRes.data);
            setProjects(projectsRes.data);
            if (projectsRes.data.length > 0 && !formData.project) {
                setFormData(prev => ({ ...prev, project: projectsRes.data[0]._id }));
            }
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
            await api.post('/sprints', formData);
            setShowForm(false);
            fetchData(); // Refresh
        } catch (err) {
            alert('Failed to create sprint');
        }
    };

    if (loading) return <div>Loading sprints...</div>;

    return (
        <div className="bg-white shadow rounded-lg p-6">
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold">Active Sprints</h3>
                <button onClick={() => setShowForm(!showForm)} className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700">
                    {showForm ? 'Cancel' : 'Start New Sprint'}
                </button>
            </div>

            {showForm && (
                <form onSubmit={handleSubmit} className="mb-8 bg-gray-50 p-4 rounded border">
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <input type="text" placeholder="Sprint Name (e.g. Sprint 24)" className="p-2 border rounded"
                            value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} required />
                        <select className="p-2 border rounded" value={formData.project} onChange={e => setFormData({ ...formData, project: e.target.value })}>
                            {projects.map(p => <option key={p._id} value={p._id}>{p.name}</option>)}
                        </select>
                        <input type="date" className="p-2 border rounded" required
                            value={formData.startDate} onChange={e => setFormData({ ...formData, startDate: e.target.value })} />
                        <input type="date" className="p-2 border rounded" required
                            value={formData.endDate} onChange={e => setFormData({ ...formData, endDate: e.target.value })} />
                        <input type="text" placeholder="Sprint Goal" className="p-2 border rounded sm:col-span-2"
                            value={formData.goal} onChange={e => setFormData({ ...formData, goal: e.target.value })} />
                    </div>
                    <button type="submit" className="mt-4 bg-green-600 text-white px-4 py-2 rounded">Create Sprint</button>
                </form>
            )}

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {sprints.map(sprint => (
                    <div key={sprint._id} className="border rounded-lg p-4 hover:shadow-md transition">
                        <div className="flex justify-between items-start">
                            <div>
                                <h4 className="font-bold text-lg">{sprint.name}</h4>
                                <p className="text-sm text-gray-500">{sprint.project?.name || 'Unknown Project'}</p>
                            </div>
                            <span className={`px-2 py-1 text-xs rounded-full ${sprint.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                                {sprint.status}
                            </span>
                        </div>
                        <p className="mt-2 text-gray-600 text-sm">{sprint.goal}</p>
                        <div className="mt-4 text-xs text-gray-400">
                            {new Date(sprint.startDate).toLocaleDateString()} - {new Date(sprint.endDate).toLocaleDateString()}
                        </div>
                    </div>
                ))}
                {sprints.length === 0 && <p className="text-gray-500 col-span-full text-center py-8">No sprints found. Start one above!</p>}
            </div>
        </div>
    );
};

export default SprintList;
