import React, { useState, useEffect, useRef } from "react";
import "reset-css";
import { shuffle, sortBy } from "lodash";
import { graphql } from "gatsby";
import classnames from "classnames";
import { DialogOverlay, DialogContent } from "@reach/dialog";
import ClickableBox from "clickable-box";
import categories from "../categories";
import Profile from "../components/profile";
import Layout from "../components/layout";
import FilterItem from "../components/filter-item";
import Nav from "../components/nav";
import Loader from "../components/loader";
import paginate from "../paginate";
import "@reach/dialog/styles.css";
import styles from "./index.module.scss";
import CloseIcon from "../icons/close";
import FilterIcon from "../icons/filter";
import Button from "../components/button";

const capitalize = s => {
  if (typeof s !== "string") return "";
  return s.charAt(0).toUpperCase() + s.slice(1);
};

const App = ({ data }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [visibleDesigners, setVisibleDesigners] = useState([]);
  const [selectedFilters, setSelectedFilters] = useState([]);
  const [isFilterListVisible, setIsFilterListVisible] = useState(false);

  const [showDialog, setShowDialog] = React.useState(false);
  const open = () => setShowDialog(true);
  const close = () => setShowDialog(false);

  const [currentPage, setCurrentPage] = useState(1);

  const profileContainerRef = useRef();

  const filterCategoryTypes = [
    { name: "Expertise", id: "expertise" },
    { name: "Position", id: "position" },
    { name: "Location", id: "location" }
  ];

  useEffect(() => {
    const shuffledDesigners = shuffle(data.allTwitterProfile.edges);
    setVisibleDesigners(shuffledDesigners);
    setIsLoading(false);
  }, [data.allTwitterProfile.edges]);

  const numDesignersPerPage = 52;
  const numPagesToShowInPagination = 5;

  const filteredDesigners = visibleDesigners.filter(designer => {
    if (selectedFilters.length === 0) {
      return true;
    }

    return selectedFilters.some(filter => designer.node.profile.tags[filter]);
  });

  const pagination = paginate(
    filteredDesigners.length,
    currentPage,
    numDesignersPerPage,
    numPagesToShowInPagination
  );

  return (
    <Layout>
      <div className={styles.container}>
        <div className={styles.sidebar}>
          <Nav
            filter
            theme="dark"
            toggleFilterList={() => {
              setIsFilterListVisible(!isFilterListVisible);
            }}
            isLoading={isLoading}
          />

          <div
            className={classnames({
              [styles.filterContainer]: true,
              [styles.filterListVisible]: isFilterListVisible
            })}
          >
            {filterCategoryTypes.map(section => {
              const categoriesInSection = categories.filter(c => c[section.id]);
              const sortedCategoriesInSection = sortBy(
                categoriesInSection,
                category => category.title
              );
              return (
                <div key={section.id}>
                  <h3 className={styles.filterCategoryTitle}>{section.name}</h3>
                  {sortedCategoriesInSection.map(category => (
                    <FilterItem
                      key={category.id}
                      id={category.id}
                      type="row"
                      onChange={e => {
                        const categoryId = e.target.value;
                        const isChecked = e.target.checked;

                        const newSelectedFilters = [...selectedFilters];

                        if (isChecked) {
                          newSelectedFilters.push(categoryId);
                        } else {
                          const i = newSelectedFilters.indexOf(categoryId);
                          newSelectedFilters.splice(i, 1);
                        }

                        setSelectedFilters(newSelectedFilters);
                        setCurrentPage(1);
                      }}
                      isChecked={selectedFilters.includes(category.id)}
                      className={styles.filterItemInput}
                      title={category.title}
                      count={
                        data[`tagCount${capitalize(category.id)}`].totalCount
                      }
                    />
                  ))}
                </div>
              );
            })}
          </div>
        </div>
        <div
          className={classnames({
            [styles.main]: true,
            [styles.slide]: isFilterListVisible
          })}
          ref={profileContainerRef}
        >
          {isLoading ? (
            <Loader />
          ) : (
            <>
              {/* {selectedFilters.length > 0 && (
                <div className={styles.filterBanner}>
                  <h2 className={styles.filterHeadline}>→ </h2>
                  <div className={styles.filterPillContainer}>
                    {selectedFilters.map(filterId => (
                      <FilterFlag
                        title={categories.find(c => c.id === filterId).title}
                        key={filterId}
                        onCloseClick={() => {
                          const newSelectedFilters = [...selectedFilters];
                          const i = newSelectedFilters.indexOf(filterId);
                          newSelectedFilters.splice(i, 1);

                          setSelectedFilters(newSelectedFilters);
                          setCurrentPage(1);
                        }}
                      />
                    ))}
                  </div>
                  <button
                    onClick={() => {
                      setSelectedFilters([]);
                      setCurrentPage(1);
                    }}
                    className={styles.filterClear}
                    type="button"
                  >
                    Clear
                  </button>
                </div>
              )} */}
              <div
                className={classnames({
                  [styles.profiles]: true
                  // [styles.filterBannerBump]: selectedFilters.length > 0
                })}
              >
                {filteredDesigners.map(({ node: designer }, i) => {
                  if (i < pagination.startIndex || i > pagination.endIndex) {
                    return null;
                  }

                  return (
                    <Profile
                      image={designer.profile.profile_image_url_https}
                      sizes={
                        designer.localFile &&
                        designer.localFile.childImageSharp &&
                        designer.localFile.childImageSharp.sizes
                      }
                      name={designer.profile.name}
                      description={designer.profile.description}
                      location={designer.profile.location || "N/A"}
                      hex={`#${designer.profile.profile_link_color}`}
                      key={designer.profile.screen_name}
                      contrast={designer.profile.contrast}
                      displayUrl={
                        designer.profile.entities.url &&
                        designer.profile.entities.url.urls[0].display_url
                      }
                      expandedUrl={
                        designer.profile.entities.url &&
                        designer.profile.entities.url.urls[0].expanded_url
                      }
                      handle={designer.profile.screen_name}
                    />
                  );
                })}
              </div>

              <div className={styles.paginationContainer}>
                <button
                  onClick={() => {
                    setCurrentPage(currentPage - 1);
                    profileContainerRef.current.scrollTo(0, 0);
                  }}
                  disabled={pagination.currentPage === pagination.startPage}
                  type="button"
                  className={styles.paginationArrow}
                >
                  ←
                </button>
                <button
                  className={styles.pageNumberButton}
                  onClick={() => {
                    setCurrentPage(1);
                    profileContainerRef.current.scrollTo(0, 0);
                  }}
                  type="button"
                  disabled={pagination.currentPage === 1}
                >
                  1
                </button>
                {currentPage >= numPagesToShowInPagination && <>&hellip;</>}
                {pagination.pages.map(pageNumber => {
                  // Skip over these page numbers because they'll always appear
                  // in the pagination.
                  if (
                    pageNumber === 1 ||
                    pageNumber === pagination.totalPages
                  ) {
                    return null;
                  }

                  return (
                    <button
                      key={pageNumber}
                      className={styles.pageNumberButton}
                      onClick={() => {
                        setCurrentPage(pageNumber);
                        profileContainerRef.current.scrollTo(0, 0);
                      }}
                      disabled={pagination.currentPage === pageNumber}
                      type="button"
                    >
                      {pageNumber}
                    </button>
                  );
                })}
                {currentPage <=
                  pagination.totalPages - (numPagesToShowInPagination + 1) && (
                  <>&hellip;</>
                )}
                {pagination.totalPages !== 1 && (
                  <button
                    className={styles.pageNumberButton}
                    onClick={() => {
                      setCurrentPage(pagination.totalPages);
                      profileContainerRef.current.scrollTo(0, 0);
                    }}
                    type="button"
                    disabled={pagination.currentPage === pagination.totalPages}
                  >
                    {pagination.totalPages}
                  </button>
                )}
                <button
                  onClick={() => {
                    setCurrentPage(currentPage + 1);
                    profileContainerRef.current.scrollTo(0, 0);
                  }}
                  disabled={pagination.currentPage === pagination.endPage}
                  type="button"
                  className={styles.paginationArrow}
                >
                  →
                </button>
              </div>
              <div className={styles.filterButtonContainer}>
                <Button type="button" onClick={open} fullWidth={false}>
                  <FilterIcon /> Filter
                  {selectedFilters.length > 0 && (
                    <>
                      <span>·</span> <span>{selectedFilters.length}</span>
                    </>
                  )}
                </Button>
              </div>
            </>
          )}
          <div>
            <DialogOverlay isOpen={showDialog} onDismiss={close}>
              <DialogContent>
                <div className={styles.dialogHeader}>
                  <ClickableBox className={styles.closeButton} onClick={close}>
                    <span aria-hidden>
                      <CloseIcon />
                    </span>
                  </ClickableBox>
                  <h2>Filter</h2>
                  <button
                    onClick={() => {
                      setSelectedFilters([]);
                      setCurrentPage(1);
                    }}
                    className={styles.filterClear}
                    type="button"
                    style={{ marginRight: "16px" }}
                  >
                    Clear
                  </button>
                </div>
                <div className={styles.dialogBody}>
                  {filterCategoryTypes.map(section => {
                    const categoriesInSection = categories.filter(
                      c => c[section.id]
                    );
                    const sortedCategoriesInSection = sortBy(
                      categoriesInSection,
                      category => category.title
                    );

                    return (
                      <div key={section.id}>
                        <h3 className={styles.filterCategoryTitle}>
                          {section.name}
                        </h3>
                        {sortedCategoriesInSection.map(category => (
                          <FilterItem
                            key={category.id}
                            id={category.id}
                            type="pill"
                            onChange={e => {
                              const categoryId = e.target.value;
                              const isChecked = e.target.checked;

                              const newSelectedFilters = [...selectedFilters];

                              if (isChecked) {
                                newSelectedFilters.push(categoryId);
                              } else {
                                const i = newSelectedFilters.indexOf(
                                  categoryId
                                );
                                newSelectedFilters.splice(i, 1);
                              }

                              setSelectedFilters(newSelectedFilters);
                              setCurrentPage(1);
                            }}
                            isChecked={selectedFilters.includes(category.id)}
                            className={styles.filterItemInput}
                            title={category.title}
                          />
                        ))}
                      </div>
                    );
                  })}
                </div>
                <div className={styles.dialogFooter}>
                  <Button type="button" onClick={close}>
                    View {filteredDesigners.length} students
                  </Button>
                </div>
              </DialogContent>
            </DialogOverlay>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default App;

export const pageQuery = graphql`
  query Index {
    allTwitterProfile {
      edges {
        node {
          localFile {
            childImageSharp {
              sizes(grayscale: true, maxWidth: 200) {
                sizes
                aspectRatio
                src
                srcSet
              }
            }
          }
          profile {
            description
            name
            screen_name
            location
            profile_image_url_https
            profile_link_color
            tags {
              art
              austin
              author
              ba
              ceo
              content
              creative
              developer
              director
              engineer
              founder
              freelance
              graphic
              head
              illustrator
              la
              lead
              letter
              london
              manager
              nyc
              portland
              product
              research
              toronto
              typeface
              seattle
              speaker
              systems
              ux
              vancouver
              vp
              web
              writer
            }
            entities {
              url {
                urls {
                  expanded_url
                  display_url
                }
              }
            }
          }
        }
      }
    }

    tagCountArt: allTwitterProfile(
      filter: { profile: { tags: { art: { eq: true } } } }
    ) {
      totalCount
    }

    tagCountAuthor: allTwitterProfile(
      filter: { profile: { tags: { author: { eq: true } } } }
    ) {
      totalCount
    }

    tagCountCeo: allTwitterProfile(
      filter: { profile: { tags: { ceo: { eq: true } } } }
    ) {
      totalCount
    }

    tagCountContent: allTwitterProfile(
      filter: { profile: { tags: { content: { eq: true } } } }
    ) {
      totalCount
    }

    tagCountCreative: allTwitterProfile(
      filter: { profile: { tags: { creative: { eq: true } } } }
    ) {
      totalCount
    }

    tagCountDeveloper: allTwitterProfile(
      filter: { profile: { tags: { developer: { eq: true } } } }
    ) {
      totalCount
    }

    tagCountDirector: allTwitterProfile(
      filter: { profile: { tags: { director: { eq: true } } } }
    ) {
      totalCount
    }

    tagCountEngineer: allTwitterProfile(
      filter: { profile: { tags: { engineer: { eq: true } } } }
    ) {
      totalCount
    }

    tagCountFounder: allTwitterProfile(
      filter: { profile: { tags: { founder: { eq: true } } } }
    ) {
      totalCount
    }

    tagCountFreelance: allTwitterProfile(
      filter: { profile: { tags: { freelance: { eq: true } } } }
    ) {
      totalCount
    }

    tagCountGraphic: allTwitterProfile(
      filter: { profile: { tags: { graphic: { eq: true } } } }
    ) {
      totalCount
    }

    tagCountHead: allTwitterProfile(
      filter: { profile: { tags: { head: { eq: true } } } }
    ) {
      totalCount
    }

    tagCountIllustrator: allTwitterProfile(
      filter: { profile: { tags: { illustrator: { eq: true } } } }
    ) {
      totalCount
    }

    tagCountLead: allTwitterProfile(
      filter: { profile: { tags: { lead: { eq: true } } } }
    ) {
      totalCount
    }

    tagCountLetter: allTwitterProfile(
      filter: { profile: { tags: { letter: { eq: true } } } }
    ) {
      totalCount
    }

    tagCountManager: allTwitterProfile(
      filter: { profile: { tags: { manager: { eq: true } } } }
    ) {
      totalCount
    }

    tagCountProduct: allTwitterProfile(
      filter: { profile: { tags: { product: { eq: true } } } }
    ) {
      totalCount
    }

    tagCountResearch: allTwitterProfile(
      filter: { profile: { tags: { research: { eq: true } } } }
    ) {
      totalCount
    }

    tagCountSpeaker: allTwitterProfile(
      filter: { profile: { tags: { speaker: { eq: true } } } }
    ) {
      totalCount
    }

    tagCountSystems: allTwitterProfile(
      filter: { profile: { tags: { systems: { eq: true } } } }
    ) {
      totalCount
    }

    tagCountUx: allTwitterProfile(
      filter: { profile: { tags: { ux: { eq: true } } } }
    ) {
      totalCount
    }

    tagCountVp: allTwitterProfile(
      filter: { profile: { tags: { vp: { eq: true } } } }
    ) {
      totalCount
    }

    tagCountWeb: allTwitterProfile(
      filter: { profile: { tags: { web: { eq: true } } } }
    ) {
      totalCount
    }

    tagCountWriter: allTwitterProfile(
      filter: { profile: { tags: { writer: { eq: true } } } }
    ) {
      totalCount
    }
    tagCountBa: allTwitterProfile(
      filter: { profile: { tags: { ba: { eq: true } } } }
    ) {
      totalCount
    }
    tagCountLa: allTwitterProfile(
      filter: { profile: { tags: { la: { eq: true } } } }
    ) {
      totalCount
    }
    tagCountNyc: allTwitterProfile(
      filter: { profile: { tags: { nyc: { eq: true } } } }
    ) {
      totalCount
    }
    tagCountLondon: allTwitterProfile(
      filter: { profile: { tags: { london: { eq: true } } } }
    ) {
      totalCount
    }
    tagCountSeattle: allTwitterProfile(
      filter: { profile: { tags: { seattle: { eq: true } } } }
    ) {
      totalCount
    }
    tagCountAustin: allTwitterProfile(
      filter: { profile: { tags: { austin: { eq: true } } } }
    ) {
      totalCount
    }
    tagCountPortland: allTwitterProfile(
      filter: { profile: { tags: { portland: { eq: true } } } }
    ) {
      totalCount
    }
    tagCountToronto: allTwitterProfile(
      filter: { profile: { tags: { toronto: { eq: true } } } }
    ) {
      totalCount
    }
    tagCountTypeface: allTwitterProfile(
      filter: { profile: { tags: { typeface: { eq: true } } } }
    ) {
      totalCount
    }
    tagCountVancouver: allTwitterProfile(
      filter: { profile: { tags: { vancouver: { eq: true } } } }
    ) {
      totalCount
    }
  }
`;
