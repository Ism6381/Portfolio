import { Routes, Route } from "react-router-dom";

import Home from "./pages/Home/Home";
import Project from "./pages/Project/Project";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />

      <Route
        path="/projects/:slug"
        element={<Project />}
      />
    </Routes>
  );
}

export default App;