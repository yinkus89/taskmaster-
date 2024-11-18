import { lazy, Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Navbar from "./components/Navbar";
import HomePage from "./pages/HomePage";

// Lazy loaded components
const LoginPage = lazy(() => import("./pages/LoginPage"));
const SignupPage = lazy(() => import("./pages/SignupPage"));
const TaskFormPage = lazy(() => import("./pages/TaskFormPage"));
const TaskDetailsPage = lazy(() => import("./pages/TaskDetailsPage"));
const TaskListPage = lazy(() => import("./pages/TaskListPage"));
const PublicTasksPage = lazy(() => import("./pages/PublicTasksPage"));
const PublicTaskDetailsPage = lazy(() => import("./pages/PublicTaskDetailsPage"));
const ProfilePage = lazy(() => import("./pages/ProfilePage"));
const AboutUsPage = lazy(() => import("./pages/AboutUsPage"));

function App() {
  return (
    <>
      <Header />
      <Navbar />
      <div className="container">
        <Suspense fallback={<p>Loading...</p>}>
          <Routes>
            {/* Home Page */}
            <Route path="/" element={<HomePage />} />

            {/* Authentication Routes */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />

            {/* Task Routes */}
            <Route path="/tasks">
              <Route index element={<TaskListPage />} />
              <Route path="new" element={<TaskFormPage />} />
              <Route path=":taskId" element={<TaskDetailsPage />} />
              <Route path="public" element={<PublicTasksPage />} />
              <Route path="public/:taskId" element={<PublicTaskDetailsPage />} />
            </Route>

            {/* About Us Page */}
            <Route path="/aboutus" element={<AboutUsPage />} />  {/* Ensure path matches the Navbar */}

            {/* Profile Page */}
            <Route path="/profile" element={<ProfilePage />} />
          </Routes>
        </Suspense>
      </div>
      <Footer />
    </>
  );
}

export default App;
