import { useState, useEffect } from 'react';
import api from '../utils/api';

const UserForm = ({ userToEdit, onSave, onCancel }) => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        role: 'Employee',
        department: '',
        designation: ''
    });

    useEffect(() => {
        if (userToEdit) {
            setFormData({
                name: userToEdit.name,
                email: userToEdit.email,
                password: '', // Don't show password
                role: userToEdit.role,
                department: userToEdit.department || '',
                designation: userToEdit.designation || ''
            });
        }
    }, [userToEdit]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (userToEdit) {
                // Update
                const updateData = { ...formData };
                if (!updateData.password) delete updateData.password; // Don't send empty password
                await api.put(`/users/${userToEdit._id}`, updateData);
            } else {
                // Create
                await api.post('/users', formData);
            }
            onSave();
        } catch (error) {
            console.error(error);
            alert('Operation failed');
        }
    };

    return (
        <div className="bg-white shadow rounded-lg p-6 mb-6">
            <h3 className="text-xl font-bold mb-4">{userToEdit ? 'Edit User' : 'Create New User'}</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Name</label>
                        <input type="text" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" required />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Email</label>
                        <input type="email" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" required />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Password</label>
                        <input type="password" value={formData.password} onChange={e => setFormData({ ...formData, password: e.target.value })}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                            placeholder={userToEdit ? "Leave blank to keep current" : "Required"}
                            required={!userToEdit} />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Role</label>
                        <select value={formData.role} onChange={e => setFormData({ ...formData, role: e.target.value })}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2">
                            <option value="Employee">Employee</option>
                            <option value="Manager">Manager</option>
                            <option value="HR">HR</option>
                            <option value="Developer">Developer</option>
                            <option value="Tester">Tester</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Department</label>
                        <input type="text" value={formData.department} onChange={e => setFormData({ ...formData, department: e.target.value })}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Designation</label>
                        <input type="text" value={formData.designation} onChange={e => setFormData({ ...formData, designation: e.target.value })}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" />
                    </div>
                </div>
                <div className="flex justify-end space-x-3">
                    <button type="button" onClick={onCancel} className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50">Cancel</button>
                    <button type="submit" className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700">Save</button>
                </div>
            </form>
        </div>
    );
};

export default UserForm;
