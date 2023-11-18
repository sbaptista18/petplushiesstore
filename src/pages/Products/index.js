import styled from "styled-components";
import PropTypes from "prop-types";
import { useState, useEffect } from "react";
import axios from "axios";
import { Row, Col, Collapse, Slider, Select, Spin } from "antd";
import { LoadingOutlined } from "@ant-design/icons";

import { Breadcrumbs, TileNoInput } from "components";

import { ToKebabCase } from "fragments";

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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(0);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          `https://prestashop.petplushies.pt/api/products?ws_key=VM5DI26GFZN3EZIE4UVUNIVE2UMUGMEA&display=full&output_format=JSON&sort=${sortOption}`
        );

        const mappedProducts = await Promise.all(
          response.data.products.map(async (item) => {
            const stock = await fetchStock(
              item.associations.stock_availables[0].id
            );
            return {
              key: item.id,
              name: item.name[0].value,
              price: _.toNumber(item.price),
              stock: stock,
              picture: `https://prestashop.petplushies.pt/${item.associations.images[0].id}-large_default/${item.link_rewrite[0].value}.jpg`,
              url: item.link_rewrite[0].value,
            };
          })
        );

        setProducts(mappedProducts);
        setLoading(false);
      } catch (error) {
        setError(true);
      }
    };

    fetchProducts(); // Call the function directly
  }, [sortOption]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(
          `https://prestashop.petplushies.pt/api/categories?ws_key=VM5DI26GFZN3EZIE4UVUNIVE2UMUGMEA&display=[name]&output_format=JSON`
        );

        const mappedCategories = response.data.categories.map((item) => {
          return {
            name: item.name[1].value,
          };
        });

        setCategories(mappedCategories);
      } catch (error) {
        console.log(error);
      }
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchPriceRange = async () => {
      try {
        await axios
          .get(
            `https://prestashop.petplushies.pt/api/products?ws_key=VM5DI26GFZN3EZIE4UVUNIVE2UMUGMEA&display=full&output_format=JSON`
          )
          .then((response) => {
            // Initialize min and max prices
            let minPrice = Number.MAX_VALUE;
            let maxPrice = 0;

            // Iterate through products to find min and max prices
            response.data.products.forEach((product) => {
              let price = parseFloat(product.price);
              minPrice = Math.min(minPrice, price);
              maxPrice = Math.max(maxPrice, price);
            });

            // Output the min and max prices
            setMinPrice(minPrice);
            setMaxPrice(maxPrice);
          })
          .catch((error) =>
            console.error("Error fetching product data:", error)
          );
      } catch (error) {
        console.log(error);
      }
    };

    fetchPriceRange();
  }, []);

  const handleSortChange = (value) => {
    setSortOption(value);
  };

  const fetchStock = async (stockIds) => {
    try {
      const response = await axios.get(
        `https://prestashop.petplushies.pt/api/stock_availables/${stockIds}?ws_key=VM5DI26GFZN3EZIE4UVUNIVE2UMUGMEA&output_format=JSON`
      );

      const quantities = response.data.stock_available.quantity;
      return quantities;
    } catch (error) {
      console.error("Error fetching stock:", error);
    }
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
                  {categories?.map((c, index) => {
                    return (
                      <li key={index}>
                        <a href={`/categoria/${ToKebabCase(c.name)}`}>
                          {c.name}
                        </a>
                      </li>
                    );
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
            {error && !loading && <>Error fetching product list.</>}
            {!error && !loading && (
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
