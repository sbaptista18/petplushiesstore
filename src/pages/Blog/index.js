import styled from "styled-components";
import { Row, Spin, Collapse, Col, Pagination } from "antd";
import { LoadingOutlined } from "@ant-design/icons";
import { useState, useEffect } from "react";
import _ from "lodash";
import { useMediaQuery } from "react-responsive";

import { PageHeader, TilePosts, Breadcrumbs } from "components";
import { SEOTags } from "fragments";
import { useTranslation } from "react-i18next";

import DummyImg from "assets/images/batcat-1.jpg";

const { Panel } = Collapse;

const Blog = () => {
  const [posts, setPosts] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [noResults, setNoResults] = useState(false);
  const [message, setMessage] = useState("");
  const [categories, setCategories] = useState([]);

  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 12;
  const { t } = useTranslation();

  const isMobile = useMediaQuery({ maxWidth: 768 });

  const fetchBlogPosts = async () => {
    try {
      const response = await fetch(
        "https://backoffice.petplushies.pt/wp-json/wc/v3/get_blog_posts"
      );
      const data = await response.json();

      if (data.success) {
        if (data.data.length > 0) {
          const mappedPosts = data.data.map((item) => {
            return {
              id: item.ID,
              name: item.post_title,
              picture: item.post_image_url,
              url: item.post_name,
              category: item.categories[0],
              post_modified: item.post_modified,
              excerpt: item.post_excerpt,
            };
          });
          setPosts(mappedPosts);
          setFilteredPosts(mappedPosts);
        } else {
          setNoResults(true);
        }
        setLoading(false);
      } else {
        setError(true);
        setLoading(false);
        setMessage(data.message);
      }
    } catch (error) {
      setError(true);
      setLoading(false);
      setMessage(data.message);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await fetch(
        `https://backoffice.petplushies.pt/wp-json/wc/v3/get_blog_categories`
      );
      const data = await response.json();

      if (data.categories === 0) {
        setNoResults(true);
      } else {
        const mappedCategories = data.categories.map((item) => ({
          id: item.id,
          name: item.name,
          slug: item.slug,
          count: item.count,
        }));
        setCategories(mappedCategories);

        fetchBlogPosts();
      }
    } catch (error) {
      setError(true);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const filterByCategory = (array, value) => {
    if (value === "All") {
      return array;
    }

    return array.filter((post) => {
      const postCategories = post.category;

      return postCategories.includes(value);
    });
  };

  const handleCategoryChange = (value) => {
    const filterResult = filterByCategory(posts, value);

    if (filterResult.length === 0) {
      setNoResults(true);
    } else {
      const mappedPosts = filterResult.map((item) => {
        return {
          id: item.id,
          name: item.name,
          picture: item.picture,
          url: item.url,
          category: item.category,
          post_modified: item.post_modified,
          excerpt: item.excerpt,
        };
      });

      setFilteredPosts(mappedPosts);
    }
  };

  const handleOnChangePagination = (page) => {
    setCurrentPage(page);
  };

  const chunkArray = (array, size) => {
    return Array.from({ length: Math.ceil(array.length / size) }, (_, index) =>
      array.slice(index * size, (index + 1) * size)
    );
  };

  return (
    <>
      <SEOTags
        title="Blog - Pet Plushies"
        description={t("blogSEODesc")}
        name="PetPlushies"
        type="website"
        image={DummyImg}
      />
      <PageHeader title="Blog" img={DummyImg} alt="Blog - Pet Plushies" />
      <Container>
        <ContentLocked>
          <Breadcrumbs page="/" item="Blog" />
          <StyledRow>
            <Col span={isMobile ? 24 : 6}>
              <Span>{t("filtrarPor")}:</Span>
              <Collapse defaultActiveKey={["1"]} accordion>
                <Panel header={t("categoria")} key="1">
                  <ul>
                    <CategoryListItem
                      onClick={() => handleCategoryChange("All")}
                    >
                      {t("todasCategorias")}
                    </CategoryListItem>
                    {categories?.map((c) => {
                      if (c.count !== 0) {
                        return (
                          <CategoryListSubItem
                            key={c.id}
                            onClick={() => handleCategoryChange(c.name)}
                          >
                            {c.name}
                          </CategoryListSubItem>
                        );
                      }
                    })}
                  </ul>
                </Panel>
              </Collapse>
            </Col>
            <PostListContainer span={isMobile ? 24 : 16}>
              {loading && !error && (
                <Spinner
                  indicator={<LoadingOutlined style={{ fontSize: 50 }} spin />}
                />
              )}
              {error && !loading && !noResults && <>{message}</>}
              {!error && !loading && noResults && <>{message}</>}
              {!error && !loading && !noResults && (
                <>
                  {chunkArray(filteredPosts, pageSize).map(
                    (postGrpup, index) => (
                      <PostRow
                        key={index}
                        style={{
                          display: currentPage === index + 1 ? "flex" : "none",
                        }}
                      >
                        {postGrpup.map((p) => (
                          <TilePosts
                            key={p.id}
                            id={p.id}
                            name={p.name}
                            picture={p.picture}
                            url={p.url}
                            category={p.category}
                            excerpt={p.excerpt}
                            size="large"
                          />
                        ))}
                      </PostRow>
                    )
                  )}
                </>
              )}
              {posts.length > 0 && (
                <Pagination
                  total={posts.length}
                  showTotal={(total, range) =>
                    `${range[0]}-${range[1]} ${t("de")} ${total} ${t(
                      "artigos"
                    )}`
                  }
                  defaultPageSize={pageSize}
                  defaultCurrent={currentPage}
                  onChange={handleOnChangePagination}
                  style={{ lineHeight: "3" }}
                />
              )}
            </PostListContainer>
          </StyledRow>
        </ContentLocked>
      </Container>
    </>
  );
};

const PostRow = styled(Row)`
  flex-wrap: wrap;
  width: 100%;
  justify-content: space-between;
`;

const CategoryListItem = styled.li`
  cursor: pointer;
  color: blue;
  list-style: none;
`;

const CategoryListSubItem = styled(CategoryListItem)`
  color: var(--light-blue);
  margin-left: 20px;
`;

const Span = styled.span`
  display: block;
  margin-bottom: 15px;
`;

const StyledRow = styled(Row)`
  justify-content: space-between;

  @media screen and (max-width: 768px) {
    flex-direction: column;
  }
`;

const PostListContainer = styled(Col)`
  display: flex;
  align-items: flex-start;
  flex-wrap: wrap;
  justify-content: space-between;

  @media screen and (max-width: 768px) {
    margin-bottom: 20px;
  }
`;

const Spinner = styled(Spin)`
  background-color: var(--white);
  width: 100%;
  height: 500px;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Container = styled.div`
  width: 100%;
  background-color: var(--white);
`;

const Content = styled(Row)`
  padding: 0 25px;
  width: 100%;
  flex-direction: column;
`;

const ContentLocked = styled(Content)`
  max-width: 1440px;
  margin: auto;
  min-height: 500px;
`;

export default {
  path: "/blog",
  exact: true,
  component: Blog,
};
