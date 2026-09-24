import "./_hero.scss";
import profile320 from "../../assets/images/profile-320.webp";
import profile480 from "../../assets/images/profile-480.webp";
import profile800 from "../../assets/images/profile-800.webp";

function Hero() {
  return (
    <section className="hero">
      <div className="hero__content">

        <p className="hero__eyebrow">Web Developer</p>

        <div className="hero__main">
          <div className="hero__text">
            <h1 className="hero__title">
              WEB
              <span>DEVELOPER.</span>
            </h1>

            <p className="hero__name">
              Hi, I'm <strong>Ismail Ibrosh</strong>
            </p>
          </div>

          <div className="hero__image-wrapper">
            <img
              src={profile800}
              srcSet={`
                ${profile320} 320w,
                ${profile480} 480w,
                ${profile800} 800w
              `}
              sizes="
                (max-width: 480px) 320px,
                (max-width: 768px) 480px,
                800px
              "
              alt="Portrait of Ismail Ibrosh"
              className="hero__image"
              width="800"
              height="1000"
              fetchPriority="high"
              decoding="async"
            />
          </div>
        </div>

        <div className="hero__bottom">
          <p className="hero__description">
            I build modern web experiences with clean code,
            thoughtful design and attention to performance.
          </p>

          <a href="#work" className="hero__cta">
            Explore my work
            <span>↘</span>
          </a>
        </div>

      </div>
    </section>
  );
}

export default Hero;