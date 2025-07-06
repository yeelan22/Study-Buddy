import { Navigate, Outlet } from 'react-router-dom';
import  {useUserStore} from "../store/userStore";

const ProtectedLayout = () => {
  const user = useUserStore((state) => state.user);

  if (!user) {
    return <Navigate to="/login" />;
  }

  return <Outlet />;
};

export default ProtectedLayout;
