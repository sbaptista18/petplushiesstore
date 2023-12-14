import styled from "styled-components";
import PropTypes from "prop-types";
import { useState, useEffect } from "react";
import { Row, Col, Collapse, Slider, Select, Spin, Pagination } from "antd";
import { LoadingOutlined } from "@ant-design/icons";
import axios from "axios";
import _ from "lodash"; // Import lodash for utility functions

import { Breadcrumbs, TileNoInput } from "components";

const { Panel } = Collapse;

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

  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 12;

  // New state for caching
  const [cachedProducts, setCachedProducts] = useState(null);

  const flagText = (stock) => {
    if (stock == null) return "";
    if (stock > 0) {
      if (stock === 1) return "Apenas 1 em stock!";
      if (stock <= 5) return "Últimas unidades em stock!";
      return "";
    } else return "Esgotado";
  };

  const filterByCategory = (array) => {
    if (categoryFilter.toLowerCase() === "all") {
      return array;
    }

    return array.filter((product) => {
      const productCategories = product.category
        ? [product.category]
        : (product.categories || []).map((category) =>
            category.name.toLowerCase()
          );

      return productCategories.includes(categoryFilter.toLowerCase());
    });
  };

  const sortProductsById = (a, b) => b.id - a.id;

  const sortByPriceLowToHigh = (a, b) =>
    parseFloat(a.price) - parseFloat(b.price);

  const sortByPriceHighToLow = (a, b) =>
    parseFloat(b.price) - parseFloat(a.price);

  const fetchData = async () => {
    try {
      if (cachedProducts) {
        setProducts(cachedProducts);
        setLoading(false);
        return;
      }

      const options = {
        method: "GET",
        url: "http://localhost:8000/products",
      };

      const response = await axios.request(options);
      const originalData = response.data;

      const result = filterByCategory(originalData).sort(sortProductsById);

      if (result.length === 0) {
        setNoResults(true);
      } else {
        const mappedProducts = result.map((item) => ({
          id: item.id,
          name: item.name,
          price: _.toNumber(item.price),
          stock: item.stock_quantity,
          picture: item.images[0].src,
          url: item.slug,
          category: item.categories[0].slug,
        }));

        setProducts(mappedProducts);
        setCachedProducts(mappedProducts);
      }
    } catch (error) {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const cachedProducts = localStorage.getItem("cachedProducts");
    if (cachedProducts) {
      const parsedData = JSON.parse(cachedProducts);
      setCachedProducts(parsedData);
      setProducts(parsedData);
      setLoading(false);
      setError(false);
    } else {
      fetchData();
    }
  }, []);

  useEffect(() => {
    if (!loading && !error) {
      const cachedProducts = localStorage.getItem("cachedProducts");
      if (!cachedProducts) {
        setCachedProducts(products);
        localStorage.setItem("cachedProducts", JSON.stringify(products));
      }
    }
  }, [loading, error, products]);

  useEffect(() => {
    const fetchCategories = async () => {
      const options = {
        method: "GET",
        url: "http://localhost:8000/products/categories",
      };

      try {
        const response = await axios.request(options);
        const mappedCategories = response.data.map((item) => ({
          id: item.id,
          name: item.name,
          slug: item.slug,
          count: item.count,
        }));

        setCategories(mappedCategories);
      } catch (error) {
        setError(true);
      }
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchPriceRange = async () => {
      const options = {
        method: "GET",
        url: "http://localhost:8000/products",
      };

      try {
        const response = await axios.request(options);
        let minPrice = Number.MAX_VALUE;
        let maxPrice = 0;

        response.data.forEach((product) => {
          let price = parseFloat(product.price);
          minPrice = Math.min(minPrice, price);
          maxPrice = Math.max(maxPrice, price);
        });

        setMinPrice(minPrice);
        setMaxPrice(maxPrice);
      } catch (error) {
        setError(true);
      }
    };

    fetchPriceRange();
  }, []);

  useEffect(() => {
    // Check if the data is already in the cache
    if (cachedProducts) {
      let filteredProducts;
      if (sortOption === "id_DESC") {
        filteredProducts =
          filterByCategory(cachedProducts).sort(sortProductsById);
      } else if (sortOption === "price_ASC") {
        filteredProducts =
          filterByCategory(cachedProducts).sort(sortByPriceLowToHigh);
      } else {
        filteredProducts =
          filterByCategory(cachedProducts).sort(sortByPriceHighToLow);
      }

      // Your existing logic for handling results
      if (filteredProducts.length === 0) {
        setNoResults(true);
      } else {
        const mappedProducts = filteredProducts.map((item) => ({
          id: item.id,
          name: item.name,
          price: _.toNumber(item.price),
          stock: item.stock,
          picture: item.picture,
          url: item.url,
          category: item.category,
        }));

        // Update the local state
        setProducts(mappedProducts);
      }
    }
  }, [categoryFilter, cachedProducts]);

  const handleSortChange = (value) => {
    setSortOption(value);
    let result;
    if (value === "id_DESC") {
      result = filterByCategory(cachedProducts).sort(sortProductsById);
    } else if (value === "price_ASC") {
      result = filterByCategory(cachedProducts).sort(sortByPriceLowToHigh);
    } else {
      result = filterByCategory(cachedProducts).sort(sortByPriceHighToLow);
    }

    if (result.length === 0) {
      setNoResults(true);
    } else {
      const mappedProducts = result.map((item) => ({
        id: item.id,
        name: item.name,
        price: item.price,
        stock: item.stock,
        picture: item.picture,
        url: item.url,
      }));

      setProducts(mappedProducts);
    }
  };

  const handleCategoryChange = (value) => {
    setCategoryFilter(value);

    let result;
    if (sortOption === "id_DESC") {
      result = filterByCategory(cachedProducts).sort(sortProductsById);
    } else if (sortOption === "price_ASC") {
      result = filterByCategory(cachedProducts).sort(sortByPriceLowToHigh);
    } else {
      result = filterByCategory(cachedProducts).sort(sortByPriceHighToLow);
    }

    if (result.length === 0) {
      setNoResults(true);
    } else {
      const mappedProducts = result.map((item) => ({
        id: item.id,
        name: item.name,
        price: item.price,
        stock: item.stock,
        picture: item.picture,
        url: item.url,
        category: item.category,
      }));

      setProducts(mappedProducts);
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
              <>Erro ao carregar a lista de produtos.</>
            )}
            {!error && !loading && noResults && (
              <>Não há resultados para o filtro seleccionado.</>
            )}
            {!error && !loading && !noResults && (
              <>
                {chunkArray(products, pageSize).map((productGroup, index) => (
                  <ProductRow
                    key={index}
                    style={{
                      display: currentPage === index + 1 ? "flex" : "none",
                    }}
                  >
                    {productGroup.map((p) => (
                      <TileNoInput
                        key={p.id}
                        id={p.id}
                        name={p.name}
                        price={p.price}
                        picture={p.picture}
                        stock={p.stock}
                        flag={flagText(p.stock)}
                        url={p.url}
                      />
                    ))}
                  </ProductRow>
                ))}
              </>
            )}
            {products.length > 0 && (
              <Pagination
                total={products.length}
                showTotal={(total, range) =>
                  `${range[0]}-${range[1]} de ${total} produtos`
                }
                defaultPageSize={pageSize}
                defaultCurrent={currentPage}
                onChange={handleOnChangePagination}
              />
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
