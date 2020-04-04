import React from "react";
import Link from "gatsby-link";
import Nav from "../components/nav";
import styles from "./about.module.scss";
import _ from "lodash";
import { Helmet } from "react-helmet";
import Layout from "../components/layout";
import { graphql } from "gatsby";
import Button from "../components/button";
import "reset-css";

const encode = data => {
  return Object.keys(data)
    .map(key => encodeURIComponent(key) + "=" + encodeURIComponent(data[key]))
    .join("&");
};

class App extends React.Component {
  constructor(props) {
    super(props);
    this.designerArray = props.data.allTwitterProfile.edges;
    this.state = {
      name: "",
      reason: "",
      formSubmitted: false,
      nameValidationMessage: null
    };
  }

  searchForName = name => {
    const formattedName = name.replace("@", "").trim();
    const found = _.find(this.designerArray, function(o) {
      return (
        o.node.profile.screen_name.toLowerCase() === formattedName.toLowerCase()
      );
    });
    return found ? true : false;
  };

  validateName = () => {
    const name = this.state.name.replace("@", "");
    if (this.searchForName(name)) {
      this.setState({
        nameValidationMessage: `🎉  Good news, ${name} is already in the directory.`
      });
      return true;
    } else {
      this.setState({
        nameValidationMessage: null
      });
      return false;
    }
  };

  handleSubmit = e => {
    const validation = this.validateName();

    if (validation) {
    } else {
      fetch("/", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: encode({ "form-name": "nominations", ...this.state })
      })
        .then(() => this.setState({ formSubmitted: true }))
        .catch(error => console.log(error));
    }
    e.preventDefault();
  };

  handleChange = e => this.setState({ [e.target.name]: e.target.value });

  render() {
    const { name, reason } = this.state;

    return (
      <Layout>
        <Helmet title="Nominate | Feathrd" />
        <Nav theme={"light"} />
        <div className={styles.container}>
          <h1 className={styles.h1}>Nominate</h1>

          <p className={styles.p}>
            If you are or know a student who wants to get into tech and have worked on a bunch of projects,
            please fill out the form with their Twitter handle and a few words
            about why you're nominating them.
          </p>
          {!this.state.formSubmitted && (
            <form
              onSubmit={this.handleSubmit}
              data-netlify="true"
              name="nominations"
            >
              <input type="hidden" name="form-name" value="nominations" />
              <label htmlFor="name" className={styles.label}>
                What's their Twitter handle?
              </label>
              <input
                id="name"
                className={styles.input}
                type="text"
                name="name"
                value={name}
                required
                onChange={this.handleChange}
                onBlur={this.validateName}
              />
              {this.state.nameValidationMessage && (
                <p className={styles.validationMessage}>
                  {this.state.nameValidationMessage}
                </p>
              )}
              <label htmlFor="reason" className={styles.label}>
                Why are you nominating them?
              </label>
              <input
                id="reason"
                className={styles.input}
                type="text"
                name="reason"
                value={reason}
                required
                onChange={this.handleChange}
                disabled={!!this.state.nameValidationMessage}
              />

              <Button
                type="submit"
                disabled={!!this.state.nameValidationMessage}
                arrow
                fullWidth={false}
              >
                Submit
              </Button>
            </form>
          )}
          {this.state.formSubmitted && (
            <div>
              <p className={styles.formSubmit}>
                <span role="img" aria-label="Confetti emoji">
                  🎉
                </span>{" "}
                Thanks for nominating!
              </p>
            </div>
          )}
          <div className={styles.backContainer}>
            <Link to="/" className={styles.backLink}>
              Back to directory
            </Link>
          </div>
        </div>
      </Layout>
    );
  }
}

export default App;

export const pageQuery = graphql`
  query Nominate {
    allTwitterProfile {
      edges {
        node {
          profile {
            screen_name
          }
        }
      }
    }
  }
`;
