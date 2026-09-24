import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

import { Swiper, SwiperSlide } from "swiper/react";
import {
  Autoplay,
  Navigation,
  Pagination,
} from "swiper/modules";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

import "./_project.scss";

const API_URL = import.meta.env.VITE_API_URL;

function Project() {
  const { slug } = useParams();

  const [project, setProject] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProject = async () => {
      try {
        setIsLoading(true);
        setError("");

        const response = await fetch(
          `${API_URL}/api/projects/${slug}`
        );

        if (response.status === 404) {
          setError("Project not found.");
          return;
        }

        if (!response.ok) {
          throw new Error(
            "Failed to load project"
          );
        }

        const data = await response.json();

        setProject(data);
      } catch (error) {
        console.error(
          "Error loading project:",
          error
        );

        setError(
          "Project could not be loaded."
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchProject();
  }, [slug]);

  if (isLoading) {
    return (
      <main className="project-page">
        <div className="project-page__container">
          <p>Loading project...</p>
        </div>
      </main>
    );
  }

  if (error || !project) {
    return (
      <main className="project-page">
        <div className="project-page__container">
          <h1>
            {error || "Project not found."}
          </h1>

          <Link to="/">
            ← Back home
          </Link>
        </div>
      </main>
    );
  }

  const images = project.images || [];
  const hasMultipleImages = images.length > 1;

  return (
    <main className="project-page">
      <div className="project-page__container">

        <Link
          to="/"
          className="project-page__back"
        >
          ← Back to portfolio
        </Link>

        <header className="project-page__hero">
          <p className="project-page__number">
            {project.number} / Case Study
          </p>

          <h1 className="project-page__title">
            {project.title}
          </h1>

          <p className="project-page__intro">
            {project.description}
          </p>

          <div className="project-page__actions">
            {project.github && (
              <a
                href={project.github}
                target="_blank"
                rel="noreferrer"
              >
                Source Code ↗
              </a>
            )}

            {project.liveUrl && (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noreferrer"
              >
                Live Project ↗
              </a>
            )}
          </div>
        </header>

        {images.length > 0 && (
          <section className="project-page__gallery">
            <div className="project-page__gallery-header">
              <p>Project Gallery</p>

              <span>
                {images.length}{" "}
                {images.length === 1
                  ? "image"
                  : "images"}
              </span>
            </div>

            {hasMultipleImages ? (
              <Swiper
                modules={[
                  Navigation,
                  Pagination,
                  Autoplay,
                ]}
                slidesPerView={1}
                loop
                navigation
                pagination={{
                  clickable: true,
                }}
                autoplay={{
                  delay: 4500,
                  disableOnInteraction: false,
                  pauseOnMouseEnter: true,
                }}
                speed={700}
                className="project-page__slider"
              >
                {images.map(
                  (image, index) => (
                    <SwiperSlide
                      key={image.publicId}
                    >
                      <div className="project-page__slide">
                        <img
                          src={image.url}
                          alt={`${project.title} screenshot ${index + 1}`}
                          loading={
                            index === 0
                              ? "eager"
                              : "lazy"
                          }
                        />
                      </div>
                    </SwiperSlide>
                  )
                )}
              </Swiper>
            ) : (
              <div className="project-page__single-image">
                <img
                  src={images[0].url}
                  alt={`${project.title} screenshot`}
                />
              </div>
            )}
          </section>
        )}

        <section className="project-page__section">
          <span className="project-page__label">
            01
          </span>

          <div>
            <p className="project-page__section-name">
              The Challenge
            </p>

            <h2>
              What needed to be solved.
            </h2>

            <p>
              {project.challenge}
            </p>
          </div>
        </section>

        <section className="project-page__section">
          <span className="project-page__label">
            02
          </span>

          <div>
            <p className="project-page__section-name">
              The Solution
            </p>

            <h2>
              How I approached it.
            </h2>

            <p>
              {project.solution}
            </p>
          </div>
        </section>

        <section className="project-page__section">
          <span className="project-page__label">
            03
          </span>

          <div>
            <p className="project-page__section-name">
              Skills Developed
            </p>

            <h2>
              What the project strengthened.
            </h2>

            <ul className="project-page__skills">
              {project.skills?.map((skill) => (
                <li key={skill}>
                  {skill}
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="project-page__technologies-section">
          <p>Technologies</p>

          <ul className="project-page__technologies">
            {project.technologies?.map(
              (technology) => (
                <li key={technology}>
                  {technology}
                </li>
              )
            )}
          </ul>
        </section>

      </div>
    </main>
  );
}

export default Project;