import React from "react";
import { Link } from "gatsby";
import Logo from "../logo";
import styles from "./nav.module.scss";

const Nav = props => {
  return (
    <div
      className={styles.container}
      style={{
        "--background": props.theme === "dark" && "var(--gray)",
        "--text": props.theme === "dark" && "#fff"
      }}
    >
      <Link to="/">
        <Logo className={styles.logo} />
      </Link>
      <nav className={styles.links}>
        <Link to="/about" className={styles.link}>
          About
        </Link>
        <Link to="/nominate" className={styles.link}>
          Nominate
        </Link>
      </nav>
    </div>
  );
};

export default Nav;
