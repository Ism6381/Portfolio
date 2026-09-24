import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import "./_adminDashboard.scss";

const API_URL = import.meta.env.VITE_API_URL;

function AdminDashboard() {
  const navigate = useNavigate();

  const [projects, setProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await fetch(
          `${API_URL}/api/projects`
        );

        if (!response.ok) {
          throw new Error("Failed to load projects");
        }

        const data = await response.json();

        const sortedProjects = [...data].sort((a, b) =>
          (a.number || "").localeCompare(b.number || "")
        );

        setProjects(sortedProjects);
      } catch (error) {
        console.error("Error loading projects:", error);

        setError("Projects could not be loaded.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchProjects();
  }, []);

  const handleLogout = async () => {
  try {
    await fetch(`${API_URL}/api/auth/logout`, {
      method: "POST",
      credentials: "include",
    });
  } catch (error) {
    console.error("Logout error:", error);
  } finally {
    navigate("/admin/login");
  }
};

  const handleDelete = async (project) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${project.title}"?`
    );

    if (!confirmed) {
      return;
    }

    try {
      const response = await fetch(
        `${API_URL}/api/projects/${project._id}`,
        {
          method: "DELETE",
          credentials: "include",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to delete project"
        );
      }

      setProjects((currentProjects) =>
        currentProjects.filter(
          (currentProject) =>
            currentProject._id !== project._id
        )
      );
    } catch (error) {
      console.error("Error deleting project:", error);

      alert("Something went wrong while deleting the project.");
    }
  };

  return (
    <main className="admin-dashboard">
      <div className="admin-dashboard__container">

        <header className="admin-dashboard__header">
          <div>
            <p className="admin-dashboard__eyebrow">
              Admin Dashboard
            </p>

            <h1>
              Manage
              <span>projects.</span>
            </h1>
          </div>

          <div className="admin-dashboard__header-actions">
            <Link to="/">
              View Portfolio ↗
            </Link>

            <button
              type="button"
              onClick={handleLogout}
            >
              Log out
            </button>
          </div>
        </header>

        <section className="admin-dashboard__projects">
          <div className="admin-dashboard__section-header">
            <div>
              <p>Portfolio Projects</p>

              <span>
                {projects.length}{" "}
                {projects.length === 1
                  ? "project"
                  : "projects"}
              </span>
            </div>

            <Link
              to="/admin/projects/new"
              className="admin-dashboard__add"
            >
              + Add Project
            </Link>
          </div>

          {isLoading && (
            <p>Loading projects...</p>
          )}

          {error && (
            <p>{error}</p>
          )}

          {!isLoading && !error && (
            <div className="admin-dashboard__list">
              {projects.map((project) => (
                <article
                  className="admin-project"
                  key={project._id}
                >
                  <span className="admin-project__number">
                    {project.number}
                  </span>

                  <div className="admin-project__info">
                    <h2>{project.title}</h2>

                    <p>
                      {project.technologies.join(" / ")}
                    </p>
                  </div>

                  <div className="admin-project__actions">
                    <Link
                      to={`/admin/projects/${project.slug}/edit`}
                    >
                      Edit
                    </Link>

                    <button
                      type="button"
                      onClick={() =>
                        handleDelete(project)
                      }
                    >
                      Delete
                    </button>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>

      </div>
    </main>
  );
}

export default AdminDashboard;