import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { ROUTE_PATHS } from './routePaths';

const ProtectedRoute = () => {
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

  if (!isAuthenticated) {
    return <Navigate to={ROUTE_PATHS.login} replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;

