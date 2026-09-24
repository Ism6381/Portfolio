import "./_about.scss";

function About() {
  return (
    <section className="about" id="about">
      <div className="about__container">
        <p className="about__eyebrow">
          02 / About
        </p>

        <div className="about__content">
          <h2 className="about__title">
            Clear thinking.
            <span>Clean execution.</span>
          </h2>

          <div className="about__text">
            <p className="about__intro">
              I'm <strong>Ismail Ibrosh</strong>, a Web Developer focused on
              building modern, responsive and maintainable web experiences.
            </p>

            <p>
              I work primarily with JavaScript, React and modern web
              technologies, with a strong focus on clean implementation,
              performance and user experience.
            </p>

            <p>
              I developed my skills through the OpenClassrooms Web Developer
              training path, where I worked on projects involving frontend
              development, API integration, routing, performance optimization,
              accessibility and SEO.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default About;