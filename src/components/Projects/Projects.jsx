import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import "./_projects.scss";

const API_URL = import.meta.env.VITE_API_URL;

function Projects() {
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

        const sortedProjects = [...data].sort(
          (a, b) =>
            (a.number || "").localeCompare(
              b.number || ""
            )
        );

        setProjects(sortedProjects);
      } catch (error) {
        console.error(
          "Error loading projects:",
          error
        );

        setError(
          "Projects could not be loaded."
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchProjects();
  }, []);

  return (
    <section
      className="projects"
      id="work"
    >
      <div className="projects__container">
        <div className="projects__header">
          <p className="projects__eyebrow">
            01 / Selected Work
          </p>

          <h2 className="projects__title">
            Projects built
            <span>with purpose.</span>
          </h2>
        </div>

        {isLoading && (
          <p>Loading projects...</p>
        )}

        {error && (
          <p>{error}</p>
        )}

        {!isLoading && !error && (
          <div className="projects__list">
            {projects.map((project) => {
              const coverImage =
                project.images?.[0];

              return (
                <article
                  className="project"
                  key={project._id}
                >
                  {coverImage && (
                    <div className="project__visual">
                      <img
                        src={coverImage.url}
                        alt={`${project.title} project`}
                        className="project__image"
                        loading="lazy"
                        decoding="async"
                      />
                    </div>
                  )}

                  <div className="project__content">
                    <div className="project__heading">
                      <h3>
                        {project.title}
                      </h3>

                      <span>
                        {project.number}
                      </span>
                    </div>

                    <p className="project__description">
                      {project.description}
                    </p>

                    <ul className="project__technologies">
                      {project.technologies?.map(
                        (technology) => (
                          <li key={technology}>
                            {technology}
                          </li>
                        )
                      )}
                    </ul>

                    <Link
                      to={`/projects/${project.slug}`}
                      className="project__link"
                    >
                      View case study
                      <span
                        aria-hidden="true"
                      >
                        ↗
                      </span>
                    </Link>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}

export default Projects;