import { lazy, type ComponentType } from 'react';
import { createHashRouter, RouterProvider } from 'react-router-dom';
import { ErrorPage } from './components/ErrorPage';
import { Layout } from './components/Layout';
import { UpdatePrompt } from './components/UpdatePrompt';
import { HomePage } from './pages/HomePage';

/**
 * Every page except Home is its own file that loads the first time it is
 * opened, so the first visit downloads much less. (Layout shows a short
 * "Loading..." while a page file arrives.)
 */
const page = <K extends string>(load: () => Promise<Record<K, ComponentType>>, name: K) =>
  lazy(() => load().then((m) => ({ default: m[name] })));

const AboutPage = page(() => import('./pages/AboutPage'), 'AboutPage');
const CertificatePage = page(() => import('./pages/CertificatePage'), 'CertificatePage');
const ClosetPage = page(() => import('./pages/ClosetPage'), 'ClosetPage');
const DailyPage = page(() => import('./pages/DailyPage'), 'DailyPage');
const HowAiPage = page(() => import('./pages/HowAiPage'), 'HowAiPage');
const LessonDetailPage = page(() => import('./pages/LessonDetailPage'), 'LessonDetailPage');
const LessonsPage = page(() => import('./pages/LessonsPage'), 'LessonsPage');
const MemoryPage = page(() => import('./pages/MemoryPage'), 'MemoryPage');
const ParentsPage = page(() => import('./pages/ParentsPage'), 'ParentsPage');
const ProgressPage = page(() => import('./pages/ProgressPage'), 'ProgressPage');
const QuizPage = page(() => import('./pages/QuizPage'), 'QuizPage');
const ReviewPage = page(() => import('./pages/ReviewPage'), 'ReviewPage');
const SettingsPage = page(() => import('./pages/SettingsPage'), 'SettingsPage');
const TutorPage = page(() => import('./pages/TutorPage'), 'TutorPage');

// Hash router keeps deep links working on static hosting with no server config.
const router = createHashRouter([
  {
    path: '/',
    element: <Layout />,
    // Layout itself crashed: friendly page instead of a blank screen.
    errorElement: <ErrorPage />,
    children: [
      {
        // A crashed page shows the error page inside the normal header and menu.
        errorElement: <ErrorPage />,
        children: [
          { index: true, element: <HomePage /> },
          { path: 'lessons', element: <LessonsPage /> },
          { path: 'lessons/:topic', element: <LessonDetailPage /> },
          { path: 'quiz', element: <QuizPage /> },
          { path: 'memory', element: <MemoryPage /> },
          { path: 'tutor', element: <TutorPage /> },
          { path: 'closet', element: <ClosetPage /> },
          { path: 'daily', element: <DailyPage /> },
          { path: 'review', element: <ReviewPage /> },
          { path: 'parents', element: <ParentsPage /> },
          { path: 'progress', element: <ProgressPage /> },
          { path: 'certificate/:topic', element: <CertificatePage /> },
          { path: 'how-ai', element: <HowAiPage /> },
          { path: 'about', element: <AboutPage /> },
          { path: 'settings', element: <SettingsPage /> },
          { path: '*', element: <HomePage /> },
        ],
      },
    ],
  },
]);

export function App() {
  return (
    <>
      <RouterProvider router={router} />
      {/* Outside the router so it also works on the title screen */}
      <UpdatePrompt />
    </>
  );
}
