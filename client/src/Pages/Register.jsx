import { useUserStore } from '../store/userStore'; // adjust path if needed
import { useNavigate } from 'react-router-dom';
export function Register() {
  const [data, setData] = useState({ name: '', email: '', password: '', avatar: '' });
  const navigate = useNavigate();
  const setUser = useUserStore((state) => state.setUser); // ✅

  const handleChange = (e) => {
    if (e.target.name === 'avatar') {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onloadend = () => setData({ ...data, avatar: reader.result });
      reader.readAsDataURL(file);
    } else {
      setData({ ...data, [e.target.name]: e.target.value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5001/api/auth/register', data);
      localStorage.setItem('user', JSON.stringify(res.data));
      setUser(res.data.user); // ✅ Sync with Zustand
      navigate('/app/dashboard');
    } catch (err) {
      console.error(err.response?.data || err.message);
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
