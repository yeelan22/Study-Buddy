import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUserStore } from '../store/userStore';
import axios from '../utils/axiosInstance';

export function Register() {
  const [data, setData] = useState({ name: '', email: '', password: '', avatar: '' });
  const navigate = useNavigate();
  const setUser = useUserStore((s) => s.setUser);

  const handleChange = (e) => {
    if (e.target.name === 'avatar') {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onloadend = () => setData((prev) => ({ ...prev, avatar: reader.result }));
      reader.readAsDataURL(file);
    } else {
      setData({ ...data, [e.target.name]: e.target.value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('/auth/register', data);
      setUser(res.data.user, res.data.token);
      navigate('/app/dashboard');
    } catch (err) {
      alert(err.response?.data?.error || 'Registration failed');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Register</h2>
      <input type="text" name="name" placeholder="Name" onChange={handleChange} required />
      <input type="email" name="email" placeholder="Email" onChange={handleChange} required />
      <input type="password" name="password" placeholder="Password (8+)" onChange={handleChange} required />
      <input type="file" name="avatar" accept="image/*" onChange={handleChange} />
      <button type="submit">Register</button>
    </form>
  );
}