import { Routes, Route } from "react-router-dom"; // Make sure to import these
import Header from "./component/Header";
import Footer from "./component/Footer";
import Navbar from "./component/Navbar";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import TaskDetailsPage from "./pages/TaskDetailsPage";
import TaskFormPage from "./pages/TaskFormPage";
import TaskPage from "./pages/TaskPage"; // TaskPage component to view details of individual tasks
import AboutUsPage from "./pages/AboutUsPage"; // About Us page
import TaskListPage from "./pages/TaskListPage"; // TaskListPage component to show a list of tasks

function App() {
  return (
    <>
      <Header />
      <Navbar />
      <div className="container">
        <Routes>
          {/* Defining routes with clear paths */}
          <Route path="/" element={<TaskDetailsPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/tasks/new" element={<TaskFormPage />} />
          <Route path="/tasks/:taskId" element={<TaskPage />} />{" "}
          {/* Route for individual task details */}
          <Route path="/about" element={<AboutUsPage />} />{" "}
          {/* About Us route */}
          <Route path="/tasks" element={<TaskListPage />} />{" "}
          {/* Task List route */}
        </Routes>
      </div>
      <Footer />
    </>
  );
}

export default App;
