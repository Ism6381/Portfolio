import "./_header.scss";
import Logo from "../logo/Logo";

function Header() {
  return (
    <header className="header">
      <div className="header__inner">

        <a
          href="/"
          className="header__logo"
          aria-label="Ismail Ibrosh - Home"
        >
          <Logo />
        </a>

        <nav className="header__nav">
          <a href="#work">Work</a>
          <a href="#about">About</a>
          <a href="#skills">Skills</a>
          <a href="#contact">Contact</a>
        </nav>

      </div>
    </header>
  );
}

export default Header;