import { Navigate, Route, Routes } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Login from '../pages/Login';
import Register from '../pages/Register';
import Dashboard from '../pages/Dashboard';
import ProtectedRoute from './ProtectedRoute';
import { ROUTE_PATHS } from './routePaths';

const AppRoutes = () => {
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

  return (
    <Routes>
      <Route
        path={ROUTE_PATHS.login}
        element={isAuthenticated ? <Navigate to={ROUTE_PATHS.dashboard} replace /> : <Login />}
      />
      <Route
        path={ROUTE_PATHS.register}
        element={isAuthenticated ? <Navigate to={ROUTE_PATHS.dashboard} replace /> : <Register />}
      />

      <Route element={<ProtectedRoute />}>
        <Route path={ROUTE_PATHS.dashboard} element={<Dashboard />} />
      </Route>

      <Route
        path="*"
        element={<Navigate to={isAuthenticated ? ROUTE_PATHS.dashboard : ROUTE_PATHS.login} replace />}
      />
    </Routes>
  );
};

export default AppRoutes;

