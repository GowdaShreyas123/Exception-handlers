import { Suspense } from 'react';
import { Route, Routes } from 'react-router-dom';
 
import AppLayout from '../layout/AppLayout';
import AuthLayout from '../layout/AuthLayout';
 
import { ProtectedRoute, LoginAuthentication } from './ProtectedRoutes';
import { authRoutes, protectedRoutes, errorRoutes } from './routesData';
import NotFound from '../pages/error/NotFound';
 
const RoutesComponent = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Routes>
        {/* Default 404 Route */}
        <Route path='*' element={<NotFound />} />
 
        {/* Error Routes */}
        {errorRoutes.map((route, i) => (
          <Route key={i} path={route.path} element={route.element} />
        ))}
 
        {/* Protected Routes with App Layout */}
        <Route element={<AppLayout />}>
          {protectedRoutes.map((route, i) => (
            <Route
              key={i}
              path={route.path}
              element={<ProtectedRoute>{route.element}</ProtectedRoute>}
            />
          ))}
        </Route>
 
        {/* Auth Routes with Auth Layout */}
        <Route element={<AuthLayout />}>
          {authRoutes.map((route, i) => (
            <Route
              key={i}
              path={route.path}
              element={<LoginAuthentication>{route.element}</LoginAuthentication>}
            />
          ))}
        </Route>
      </Routes>
    </Suspense>
  );
};
 
export default RoutesComponent;