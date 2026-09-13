import { Link, useParams } from "react-router-dom";

import projects from "../../data/projects";

import "./_project.scss";

function Project() {
  const { slug } = useParams();

  const project = projects.find(
    (project) => project.slug === slug
  );

  if (!project) {
    return (
      <main className="project-page">
        <div className="project-page__container">
          <h1>Project not found.</h1>

          <Link to="/">
            ← Back home
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="project-page">
      <div className="project-page__container">

        <Link
          to="/"
          className="project-page__back"
        >
          ← Back to portfolio
        </Link>

        <p className="project-page__number">
          {project.number} / Project
        </p>

        <h1 className="project-page__title">
          {project.title}
        </h1>

        <p className="project-page__description">
          {project.description}
        </p>

        <ul className="project-page__technologies">
          {project.technologies.map((technology) => (
            <li key={technology}>
              {technology}
            </li>
          ))}
        </ul>

      </div>
    </main>
  );
}

export default Project;