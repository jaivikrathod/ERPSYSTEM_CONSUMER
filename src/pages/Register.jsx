import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { registerApi } from '../api';

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const onChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError('');

    try {
      await registerApi(formData);
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 p-10 bg-white rounded-xl shadow-md">
        <h2 className="text-center text-3xl font-extrabold text-gray-900">Create your account</h2>

        {error && <div className="bg-red-50 p-4 rounded-md text-sm text-red-600">{error}</div>}

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <input
              type="text"
              name="name"
              required
              placeholder="Full name"
              className="block w-full px-3 py-2 border border-gray-300 rounded-md"
              value={formData.name}
              onChange={onChange}
            />
            <input
              type="email"
              name="email"
              required
              placeholder="Email address"
              className="block w-full px-3 py-2 border border-gray-300 rounded-md"
              value={formData.email}
              onChange={onChange}
            />
            <input
              type="password"
              name="password"
              required
              placeholder="Password"
              className="block w-full px-3 py-2 border border-gray-300 rounded-md"
              value={formData.password}
              onChange={onChange}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-2 px-4 rounded-md text-white bg-indigo-600 hover:bg-indigo-700 ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
          >
            {loading ? 'Creating account...' : 'Register'}
          </button>

          <div className="text-center text-sm">
            <span className="text-gray-600">Already have an account? </span>
            <Link to="/login" className="font-medium text-indigo-600 hover:text-indigo-500">
              Sign in
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;
