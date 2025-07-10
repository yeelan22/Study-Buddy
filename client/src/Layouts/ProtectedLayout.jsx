import { Navigate, Outlet } from 'react-router-dom';
import  {useUserStore} from "../store/userStore";
import { useEffect } from 'react';

const ProtectedLayout = () => {
  const user = useUserStore((state) => state.user);

  const setUser = useUserStore((state) => state.setUser);
  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem('user'));
    if (stored?.user) setUser(stored.user);
  }, []);


  if (!user) {
    return <Navigate to="/login" />;
  }

  return <Outlet />;
};

export default ProtectedLayout;
