import styled from "styled-components";
import PropTypes from "prop-types";
import { useState, useEffect } from "react";
import { Row, Col, Collapse, Slider, Select, Spin } from "antd";
import { LoadingOutlined } from "@ant-design/icons";
import axios from "axios";

import { Breadcrumbs, TileNoInput } from "components";

const { Panel } = Collapse;

const flagText = (stock) => {
  let text;
  if (stock > 0) {
    if (stock == 1) text = "last in stock!";
    else if (stock <= 5 && stock != 1) text = "last units in stock!";
    else text = "";
  } else text = "out of stock";

  return text;
};
const SortDropdown = ({ onSelect }) => {
  const handleSortChange = (value) => {
    onSelect(value);
  };
  return (
    <SortSelect
      defaultValue="Ordenar lista por..."
      onChange={handleSortChange}
      options={[
        {
          value: "id_DESC",
          label: "Recentes",
        },
        {
          value: "price_ASC",
          label: "Preco: Baixo -> Alto",
        },
        {
          value: "price_DESC",
          label: "Preco: Alto -> Baixo",
        },
      ]}
    ></SortSelect>
  );
};

SortDropdown.propTypes = {
  onSelect: PropTypes.func.isRequired,
};

const Products = () => {
  const [sortOption, setSortOption] = useState("id_DESC");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [noResults, setNoResults] = useState(false);

  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(0);

  const filterByCategory = (array) => {
    if (categoryFilter.toLowerCase() === "all") {
      return array;
    }

    return array.filter((product) => {
      return (
        product.categories &&
        Array.isArray(product.categories) &&
        product.categories.some((category) => {
          return category.name.toLowerCase() === categoryFilter.toLowerCase();
        })
      );
    });
  };

  const sortProductsById = (a, b) => b.id - a.id;

  const sortByPriceLowToHigh = (a, b) => {
    return parseFloat(a.price) - parseFloat(b.price);
  };

  const sortByPriceHighToLow = (a, b) => {
    return parseFloat(b.price) - parseFloat(a.price);
  };

  // FETCH PRODUCTS
  useEffect(() => {
    const options = {
      method: "GET",
      url: "http://localhost:8000/products",
    };
    axios
      .request(options)
      .then(function (response) {
        let originalData = response.data;
        let result;
        if (sortOption == "id_DESC") {
          result = filterByCategory(originalData).sort(sortProductsById);
        } else if (sortOption == "price_ASC")
          result = filterByCategory(originalData).sort(sortByPriceLowToHigh);
        else result = filterByCategory(originalData).sort(sortByPriceHighToLow);

        if (result.length == 0) {
          if (data.length == 0) {
            setNoResults(true);
            setLoading(false);
            setError(false);
          } else {
            const mappedProducts = data.map((item) => {
              return {
                key: item.id,
                name: item.name,
                price: _.toNumber(item.price),
                stock: item.stock_quantity,
                picture: item.images[0].src,
                url: item.slug,
              };
            });

            setProducts(mappedProducts);
            setLoading(false);
          }
        } else {
          const mappedProducts = result.map((item) => {
            return {
              key: item.id,
              name: item.name,
              price: _.toNumber(item.price),
              stock: item.stock_quantity,
              picture: item.images[0].src,
              url: item.slug,
            };
          });

          setProducts(mappedProducts);
          setLoading(false);
        }
      })
      .catch(function (error) {
        setError(true);
      });
  }, [categoryFilter, sortOption]);

  // FETCH CATEGORIES
  useEffect(() => {
    const fetchCategories = async () => {
      const options = {
        method: "GET",
        url: "http://localhost:8000/products/categories",
      };

      axios
        .request(options)
        .then(function (response) {
          const mappedCategories = response.data.map((item) => {
            return {
              key: item.id,
              name: item.name,
              slug: item.slug,
              count: item.count,
            };
          });

          setCategories(mappedCategories);
        })
        .catch(function (error) {
          setError(true);
        });
    };

    fetchCategories();
  }, []);

  // FETCH PRICE RANGE
  useEffect(() => {
    const fetchPriceRange = async () => {
      const options = {
        method: "GET",
        url: "http://localhost:8000/products",
      };

      axios
        .request(options)
        .then(function (response) {
          let minPrice = Number.MAX_VALUE;
          let maxPrice = 0;

          response.data.forEach((product) => {
            let price = parseFloat(product.price);
            minPrice = Math.min(minPrice, price);
            maxPrice = Math.max(maxPrice, price);
          });

          setMinPrice(minPrice);
          setMaxPrice(maxPrice);
        })
        .catch(function (error) {
          setError(true);
        });
    };

    fetchPriceRange();
  }, []);

  const handleSortChange = (value) => {
    setSortOption(value);
  };

  const handleCategoryChange = (value1) => {
    setCategoryFilter(value1);
    setCatHasProducts(true);
  };

  return (
    <Container>
      <ContentLocked>
        <StyledH1>Produtos</StyledH1>
        <Breadcrumbs page="/" item="Produtos" />
        <StyledRow>
          <Col span={6}>
            <Span>Filtrar por:</Span>
            <Collapse defaultActiveKey={["1"]} accordion>
              <Panel header="Categoria" key="1">
                <ul>
                  <CategoryListItem onClick={() => handleCategoryChange("all")}>
                    Todas as categorias
                  </CategoryListItem>
                  {categories?.map((c) => {
                    if (c.count != 0) {
                      return (
                        <CategoryListSubItem
                          key={c.key}
                          onClick={() => handleCategoryChange(c.slug)}
                        >
                          {c.name}
                        </CategoryListSubItem>
                      );
                    }
                  })}
                </ul>
              </Panel>
              <Panel header="Preco" key="2">
                <Slider
                  range
                  marks={{
                    [minPrice]: `${minPrice}€`,
                    [maxPrice]: `${maxPrice}€`,
                  }}
                  defaultValue={[minPrice, maxPrice]}
                  min={minPrice}
                  max={maxPrice}
                />
              </Panel>
            </Collapse>
          </Col>
          <ProductListContainer span={16}>
            <SortDropdown onSelect={handleSortChange} />
            {loading && !error && (
              <Spinner
                indicator={<LoadingOutlined style={{ fontSize: 50 }} spin />}
              />
            )}
            {error && !loading && !noResults && (
              <>Error fetching product list.</>
            )}
            {!error && !loading && noResults && (
              <>No results for the selected filter.</>
            )}
            {!error && !loading && !noResults && (
              <ProductRow>
                {products?.map((p) => {
                  return (
                    <TileNoInput
                      key={p.key}
                      name={p.name}
                      price={p.price}
                      picture={p.picture}
                      stock={p.stock}
                      flag={flagText(p.stock)}
                      url={p.url}
                    />
                  );
                })}
              </ProductRow>
            )}
          </ProductListContainer>
        </StyledRow>
      </ContentLocked>
    </Container>
  );
};

const CategoryListItem = styled.li`
  cursor: pointer;
  color: blue;
  list-style: none;
`;

const CategoryListSubItem = styled(CategoryListItem)`
  color: green;
  margin-left: 20px;
`;

const CategoryListSubSubItem = styled(CategoryListItem)`
  color: pink;
  margin-left: 40px;
`;

const Spinner = styled(Spin)`
  margin-left: 50%;
  margin-top: 10%;
`;

const ProductListContainer = styled(Col)`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
`;

const SortSelect = styled(Select)`
  min-width: 200px;
`;

const Container = styled.div`
  width: 100%;
`;

const Content = styled(Row)`
  padding: 0 25px;
  width: 100%;
  flex-direction: column;
`;

const ContentLocked = styled(Content)`
  max-width: 1440px;
  margin: auto;
`;

const StyledH1 = styled.h1`
  margin-top: 30px;
  font-size: 52px;
`;

const StyledRow = styled(Row)`
  justify-content: space-between;
`;

const ProductRow = styled(Row)`
  justify-content: space-between;
  flex-wrap: wrap;
`;

const Span = styled.span`
  display: block;
  margin-bottom: 15px;
`;

export default {
  path: "/produtos",
  exact: true,
  component: Products,
};
