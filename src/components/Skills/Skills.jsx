import "./_skills.scss";

const skillGroups = [
  {
    number: "01",
    title: "Frontend",
    skills: [
      "HTML5",
      "CSS3",
      "SCSS",
      "JavaScript",
      "React",
      "React Router",
      "Responsive Design",
    ],
  },
  {
    number: "02",
    title: "Backend",
    skills: [
      "Node.js",
      "Express",
      "REST API",
      "MongoDB",
      "Mongoose",
      "JWT Authentication",
    ],
  },
  {
    number: "03",
    title: "Tools",
    skills: [
      "Git",
      "GitHub",
      "Vite",
      "Chrome DevTools",
      "Lighthouse",
      "Cloudinary",
    ],
  },
];

function Skills() {
  return (
    <section
      className="skills"
      id="skills"
    >
      <div className="skills__container">
        <header className="skills__header">
          <p className="skills__eyebrow">
            03 / Skills & Technologies
          </p>

          <h2 className="skills__title">
            Tools I use
            <span>to build.</span>
          </h2>
        </header>

        <div className="skills__grid">
          {skillGroups.map((group) => (
            <article
              className="skills__group"
              key={group.title}
            >
              <div className="skills__group-header">
                <span>{group.number}</span>

                <h3>{group.title}</h3>
              </div>

              <ul className="skills__list">
                {group.skills.map((skill) => (
                  <li key={skill}>
                    <span>{skill}</span>

                    <span
                      className="skills__arrow"
                      aria-hidden="true"
                    >
                      ↗
                    </span>
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Skills;