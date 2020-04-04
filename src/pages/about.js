import React from "react";
import "reset-css";
import Link from "gatsby-link";
import { Helmet } from "react-helmet";
import { sortBy } from "lodash";
import classnames from "classnames";
import Nav from "../components/nav";
import styles from "./about.module.scss";
import Layout from "../components/layout";

const App = () => (
  <Layout>
    <Helmet title="About | Feathrd" />
    <Nav theme="light" />
    <div className={styles.container}>
      <h1 className={styles.h1}>About this project</h1>
      <p>
        <a href="https://feathrd.co" target="_blank">Feathrd</a> is a community of student makers from around the world.
        This directory showcases their projects, work, and skills and enables them to find
        like-minded students to collaborate with. We aim to help students land a role in tech
        and give them a platform to get discovered.
      </p>

      <h2 className={styles.emphasis}>Source code</h2>
      <p>
        This directory is based on <a href="https://womenwho.design" target="_blank">Women Who Design</a> that highlights
        accomplished women in the industry. If you're looking to start a similar effort, feel free to fork their project on{" "}
        <a href="https://github.com/julesforrest/womenwhodesign" target="_blank">GitHub</a>.
      </p>
      <div className={styles.backContainer}>
        <Link to="/" className={styles.backLink}>
          Back to directory
        </Link>
      </div>
    </div>
  </Layout>
);

export default App;
