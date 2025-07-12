import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useUserStore } from '../store/userStore';

export function Login() {
  const [data, setData] = useState({ emailOrName: '', password: '' });
  const navigate = useNavigate();
  const setUser = useUserStore((s) => s.setUser);

  const handleChange = (e) => setData({ ...data, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5001/api/auth/login', data);
      setUser(res.data.user); // ✅ set Zustand state only
      navigate('/app/dashboard');
    } catch (err) {
      alert(err.response?.data?.error || 'Login failed');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Login</h2>
      <input type="text" name="emailOrName" placeholder="Name or Email" onChange={handleChange} required />
      <input type="password" name="password" placeholder="Password" onChange={handleChange} required />
      <button type="submit">Login</button>
    </form>
  );
}
