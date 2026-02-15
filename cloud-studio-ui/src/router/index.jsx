import { createBrowserRouter, Navigate } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import Home from '../pages/Home/Home';
import LearningCenter from '../pages/LearningCenter/LearningCenter';
import AppMarketplace from '../pages/AppMarketplace/AppMarketplace';
import TemplateCenter from '../pages/TemplateCenter/TemplateCenter';
import CourseDetailPage from '../pages/CourseDetailPage/CourseDetailPage';
import CourseLearnPage from '../pages/CourseLearnPage/CourseLearnPage';
import AppDetailPage from '../pages/AppDetailPage/AppDetailPage';
import UserProfilePage from '../pages/UserProfilePage/UserProfilePage';
import SettingsPage from '../pages/SettingsPage/SettingsPage';
import ComingSoon from '../pages/ComingSoon/ComingSoon';
import CreateCoursePage from '../pages/CreateCoursePage/CreateCoursePage';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
    children: [
      {
        index: true,
        element: <Navigate to="/home" replace />,
      },
      {
        path: '/home',
        element: <Home />,
      },
      {
        path: '/learn',
        element: <LearningCenter />,
      },
      {
        path: '/courses/create',
        element: <CreateCoursePage />,
      },
      {
        path: '/market',
        element: <AppMarketplace />,
      },
      {
        path: '/templates',
        element: <TemplateCenter />,
      },
      {
        path: '/course/:courseId',
        element: <CourseDetailPage />,
      },
      {
        path: '/app/:appId',
        element: <AppDetailPage />,
      },
      {
        path: '/app/:appId/edit',
        element: <ComingSoon title="应用编辑器" description="应用编辑体验即将上线。" />,
      },
      {
        path: '/profile/:userId',
        element: <UserProfilePage />,
      },
      {
        path: '/settings',
        element: <SettingsPage />,
      },
    ],
  },
  {
    path: '/course/:courseId/learn',
    element: <CourseLearnPage />,
  },
]);

export default router;
