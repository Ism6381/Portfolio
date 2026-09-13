import "./_projects.scss";
import projects from "../../data/projects";

function Projects() {
  return (
    <section className="projects" id="work">
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

        <div className="projects__list">
          {projects.map((project) => (
            <article
              className="project"
              key={project.id}
            >
              <div className="project__visual">
                <span className="project__placeholder">
                  PROJECT IMAGE
                </span>
              </div>

              <div className="project__content">
                <div className="project__heading">
                  <h3>{project.title}</h3>
                  <span>{project.number}</span>
                </div>

                <p className="project__description">
                  {project.description}
                </p>

                <ul className="project__technologies">
                  {project.technologies.map((technology) => (
                    <li key={technology}>
                      {technology}
                    </li>
                  ))}
                </ul>

                <a
                  href={`/projects/${project.slug}`}
                  className="project__link"
                >
                  View case study
                  <span>↗</span>
                </a>
              </div>
            </article>
          ))}
        </div>

      </div>
    </section>
  );
}

export default Projects;