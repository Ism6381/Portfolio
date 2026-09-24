import {
  lazy,
  Suspense,
} from "react";

import {
  Routes,
  Route,
} from "react-router-dom";

import Home from "./pages/Home/Home";

import ProtectedRoute from "./components/ProtectedRoute/ProtectedRoute";
import ScrollToTop from "./components/ScrollToTop/ScrollToTop";

const Project = lazy(
  () => import("./pages/Project/Project")
);

const AdminLogin = lazy(
  () => import("./pages/AdminLogin/AdminLogin")
);

const AdminDashboard = lazy(
  () =>
    import(
      "./pages/AdminDashboard/AdminDashboard"
    )
);

const AdminProjectForm = lazy(
  () =>
    import(
      "./pages/AdminProjectForm/AdminProjectForm"
    )
);

const ADMIN_PATH = "/ii-control-7x4k";

function App() {
  return (
    <>
      <ScrollToTop />

      <Suspense fallback={null}>
        <Routes>
          <Route
            path="/"
            element={<Home />}
          />

          <Route
            path="/projects/:slug"
            element={<Project />}
          />

          <Route
            path={`${ADMIN_PATH}/login`}
            element={<AdminLogin />}
          />

          <Route
            path={ADMIN_PATH}
            element={
              <ProtectedRoute>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path={`${ADMIN_PATH}/projects/new`}
            element={
              <ProtectedRoute>
                <AdminProjectForm />
              </ProtectedRoute>
            }
          />

          <Route
            path={`${ADMIN_PATH}/projects/:slug/edit`}
            element={
              <ProtectedRoute>
                <AdminProjectForm />
              </ProtectedRoute>
            }
          />
        </Routes>
      </Suspense>
    </>
  );
}

export default App;