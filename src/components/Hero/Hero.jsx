import "./_hero.scss";
import profileImage from "../../assets/images/ProfilePic.png";

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
              src={profileImage}
              alt="Ismail Ibrosh - Web Developer"
              className="hero__image"
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