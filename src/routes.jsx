import { Navigate } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from './context/AuthContext';
import Login from './pages/Login';
import UserForm from './pages/UserForm';

// Protected route component
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useContext(AuthContext);
  
  if (loading) {
    return <div>Loading...</div>;
  }
  
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }
  
  return children;
};

// Route definitions
const routes = [
  {
    path: '/',
    element: <Navigate to="/login" />
  },
  {
    path: '/login',
    element: <Login />
  },
  {
    path: '/user-form',
    element: (
      <ProtectedRoute>
        <UserForm />
      </ProtectedRoute>
    )
  },
  {
    path: '*',
    element: <Navigate to="/login" />
  }
];

export default routes;