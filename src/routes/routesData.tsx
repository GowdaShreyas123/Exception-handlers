
import NotFound from '../pages/error/NotFound';
import InternalErrorPage from '../pages/error/InternalErrorPage';
import { Navigate } from 'react-router-dom';

import BrainImagining from '@/pages/dashboard/BrainImagining';
import Landingpage from '@/pages/Landingpage/Landingpage';
import UploadAndPredict from '@/pages/upload/UploadAndPredict';
import VisualDashboard from '@/pages/VisualDashboard';
import Logout from '@/pages/Logout';
import FutureScope from '@/pages/FutureScope';
 
// -------------------------
// Auth (Public) Routes
// -------------------------
export const authRoutes = [
{
    name: 'Root Redirect',
    path: '/',
    element: <Navigate to="/landing-page" replace />,
  },
  {
    name: 'Sign In',
    path: '/landing-page',
    element: <Landingpage />,
  },
];
 
// -------------------------
// Protected (Private) Routes``
// -------------------------
export const protectedRoutes = [
  {
    name: 'Brain Imaging',
    path: '/brainimagining',
    element: <BrainImagining />,
  },
  {
    name:'Upload and Predict',
    path: '/upload',
    element:<UploadAndPredict/>
  },
  {
    name:'Visual Dashboard',
    path: '/visual',
    element:<VisualDashboard/>
  },
  {
    name:'Future Scope',
    path: '/future',
    element:<FutureScope/>
  },
   {
    name:'Logout',
    path: '/logout',
    element:<Logout/>
  }

];
 
// -------------------------
// Error Routes (Optional)
// -------------------------
export const errorRoutes = [
  {
    name: 'Not Found',
    path: '/page-not-found',
    element: <NotFound />,
  },
  {
    name: 'Internal Server Error',
    path: '/internal-server-error',
    element: <InternalErrorPage />,
  },
];
 
 