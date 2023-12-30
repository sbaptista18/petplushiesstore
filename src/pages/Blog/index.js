import styled from "styled-components";
import { Row, Spin, Collapse, Col, Pagination } from "antd";
import { LoadingOutlined } from "@ant-design/icons";
import { useState, useEffect } from "react";
import _ from "lodash";

import { PageHeader, TilePosts, Breadcrumbs } from "components";
import { SEOTags } from "fragments";
import { useLoading } from "reducers";

import DummyImg from "assets/images/batcat-1.jpg";

const { Panel } = Collapse;

const Blog = () => {
  const [posts, setPosts] = useState([]);
  const [categoryFilter, setCategoryFilter] = useState("all");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [noResults, setNoResults] = useState(false);
  const [message, setMessage] = useState("");
  const [categories, setCategories] = useState([]);
  const { setLoadingPage } = useLoading();

  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 12;

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
              category: item.categories,
              post_modified: item.post_modified,
              excerpt: item.post_excerpt,
            };
          });
          setPosts(mappedPosts);
        } else {
          setNoResults(true);
        }
        setLoading(false);
        setLoadingPage(false);
      } else {
        setError(true);
        setLoading(false);
        setLoadingPage(false);
        setMessage(data.message);
      }
    } catch (error) {
      setError(true);
      setLoading(false);
      setLoadingPage(false);
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
    setLoadingPage(true);
  }, []);

  const filterByCategory = (array) => {
    if (categoryFilter.toLowerCase() === "all") {
      return array;
    }

    return array.filter((post) => {
      const postCategories = post.category
        ? [post.category]
        : (post.categories || []).map((category) =>
            category.name.toLowerCase()
          );

      return postCategories.includes(categoryFilter.toLowerCase());
    });
  };

  const handleCategoryChange = (value) => {
    setCategoryFilter(value);

    let result;
    if (sortOption === "id_DESC") {
      result = filterByCategory(posts).sort(sortProductsById);
    } else if (sortOption === "price_ASC") {
      result = filterByCategory(posts).sort(sortByPriceLowToHigh);
    } else {
      result = filterByCategory(posts).sort(sortByPriceHighToLow);
    }

    if (result.length === 0) {
      setNoResults(true);
    } else {
      const mappedPosts = result.map((item) => ({
        id: item.ID,
        name: item.post_title,
        picture: item.post_image_url,
        url: item.post_name,
        category: item.categories,
        post_modified: item.post_modified,
        excerpt: item.post_excerpt,
      }));

      setPosts(mappedPosts);
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
        description="No nosso Blog pode espreitar as últimas novidades do mundo animal, bem como encontrar o seu melhor amigo para sempre no nosso Cantinho das Adopções!"
        name="PetPlushies"
        type="website"
        image={DummyImg}
      />
      <PageHeader title="Blog" img={DummyImg} alt="Blog - Pet Plushies" />
      <Container>
        <ContentLocked>
          <Breadcrumbs page="/" item="Blog" />
          <StyledRow>
            <Col span={6}>
              <Span>Filtrar por:</Span>
              <Collapse defaultActiveKey={["1"]} accordion>
                <Panel header="Categoria" key="1">
                  <ul>
                    <CategoryListItem
                      onClick={() => handleCategoryChange("all")}
                    >
                      Todas as categorias
                    </CategoryListItem>
                    {categories?.map((c) => {
                      if (c.count !== 0) {
                        return (
                          <CategoryListSubItem
                            key={c.id}
                            onClick={() => handleCategoryChange(c.slug)}
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
            <PostListContainer span={16}>
              {loading && !error && (
                <Spinner
                  indicator={<LoadingOutlined style={{ fontSize: 50 }} spin />}
                />
              )}
              {error && !loading && !noResults && <>{message}</>}
              {!error && !loading && noResults && <>{message}</>}
              {!error && !loading && !noResults && (
                <>
                  {chunkArray(posts, pageSize).map((postGrpup, index) => (
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
                          category={p.category[0]}
                          excerpt={p.excerpt}
                          size="large"
                        />
                      ))}
                    </PostRow>
                  ))}
                </>
              )}
              {posts.length > 0 && (
                <Pagination
                  total={posts.length}
                  showTotal={(total, range) =>
                    `${range[0]}-${range[1]} de ${total} artigos`
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
`;

const PostListContainer = styled(Col)`
  display: flex;
  align-items: flex-start;
  flex-wrap: wrap;
  justify-content: space-between;
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
