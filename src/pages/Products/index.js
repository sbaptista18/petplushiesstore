import styled from "styled-components";
import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { Row, Col, Collapse, Slider } from "antd";

import { Breadcrumbs, TileNoInput } from "components";

import { ToKebabCase } from "fragments";

const { Panel } = Collapse;

const flagText = (stock) => {
  let text;
  if (stock > 0) {
    if (stock == 1) text = "last in stock!";
    else if (stock <= 5 && stock != 1) text = "last units in stock!";
  } else text = "out of stock";

  return text;
};

const Products = () => {
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(0);

  const isFetchingRef = useRef(false);

  useEffect(() => {
    const fetchProducts = async () => {
      if (!isFetchingRef.current) {
        isFetchingRef.current = true;

        try {
          const response = await axios.get(
            `https://prestashop.petplushies.pt/api/products?ws_key=VM5DI26GFZN3EZIE4UVUNIVE2UMUGMEA&display=full&output_format=JSON`
          );

          const mappedProducts = response.data.products.map((item) => {
            return {
              key: item.id,
              name: item.name[0].value,
              price: _.toNumber(item.price),
              picture: `https://prestashop.petplushies.pt/${item.associations.images[0].id}-large_default/${item.link_rewrite[0].value}.jpg`, // You may need to set the actual picture value
              stock: item.associations.stock_availables[0].id,
              flag: flagText(item.associations.stock_availables[0].id),
              url: item.link_rewrite[0].value,
            };
          });

          setProducts(mappedProducts);
        } catch (error) {
          console.log(error);
        }

        isFetchingRef.current = false;
      }
    };

    !isFetchingRef.current && fetchProducts();
  }, []);

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
          <Col span={16}>
            <ProductRow>
              {products?.map((p) => {
                return (
                  <TileNoInput
                    key={p.key}
                    name={p.name}
                    price={p.price}
                    picture={p.picture}
                    stock={p.stock}
                    flag={p.flag}
                    url={p.url}
                  />
                );
              })}
            </ProductRow>
          </Col>
        </StyledRow>
      </ContentLocked>
    </Container>
  );
};

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
