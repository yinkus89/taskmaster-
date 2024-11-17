import { lazy, Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import Header from "./component/Header";
import Footer from "./component/Footer";
import Navbar from "./component/Navbar";
import HomePage from "./pages/HomePage";
import AboutUsPage from "./pages/AboutUsPage";


// Lazy loaded components
const LoginPage = lazy(() => import("./pages/LoginPage"));
const SignupPage = lazy(() => import("./pages/SignupPage"));
const TaskFormPage = lazy(() => import("./pages/TaskFormPage"));
const TaskDetailsPage = lazy(() => import("./pages/TaskDetailsPage"));
const TaskListPage = lazy(() => import("./pages/TaskListPage"));
const PublicTasksPage = lazy(() => import("./pages/PublicTasksPage"));
const PublicTaskDetailsPage = lazy(() => import("./pages/PublicTaskDetailsPage"));

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

            {/* About Page */}
            <Route path="/about" element={<AboutUsPage />} />

            
            
          </Routes>
        </Suspense>
      </div>
      <Footer />
    </>
  );
}

export default App;
