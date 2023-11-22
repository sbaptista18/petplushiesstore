import styled from "styled-components";
import { Row, Col } from "antd";
import { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { useCart } from "../../../reducers/CartContext";
import xmlbuilder from "xmlbuilder";

import {
  Accordion,
  AddToCart,
  Breadcrumbs,
  ImageCarousel,
  ShareSocials,
} from "components";

const flagText = (stock) => {
  let text;
  if (stock > 0) {
    if (stock == 1) text = "last in stock!";
    else if (stock <= 5 && stock != 1) text = "last units in stock!";
  } else text = "out of stock";

  return text;
};

function objectToXml(obj) {
  const root = xmlbuilder.create(obj);
  return root.end({ pretty: true });
}

const Product = () => {
  const [sessionKey, setSessionKey] = useState(null);
  const [product, setProduct] = useState([]);
  const { productUrl } = useParams();

  const { cartId, setCartId } = useCart();

  useEffect(() => {
    // Do something with cartId
    console.log("Cart ID:", cartId);
  }, [cartId]);

  // useEffect(() => {
  //   const fetchProduct = async () => {
  //     try {
  //       const response = await axios.get(
  //         `https://prestashop.petplushies.pt/api/products?ws_key=VM5DI26GFZN3EZIE4UVUNIVE2UMUGMEA&display=full&filter[link_rewrite]=[${productUrl}]&output_format=JSON`
  //       );

  //       const mappedProduct = response.data.products[0];

  //       const arrayImages = [];

  //       mappedProduct.associations.images.map((image) => {
  //         return arrayImages.push(
  //           `https://prestashop.petplushies.pt/${image.id}-large_default/${mappedProduct.link_rewrite[0].value}.jpg`
  //         );
  //       });
  //       const stock = await fetchStock(
  //         mappedProduct.associations.stock_availables.map((stock) => stock.id)
  //       );

  //       const productData = {
  //         key: mappedProduct.id,
  //         name: mappedProduct.name[0].value,
  //         price: _.toNumber(mappedProduct.price),
  //         picture: `https://prestashop.petplushies.pt/${mappedProduct.associations.images[0].id}-large_default/${mappedProduct.link_rewrite[0].value}.jpg`,
  //         slideshow: arrayImages,
  //         stock: stock[0],
  //         flag: flagText(mappedProduct.associations.stock_availables[0].id),
  //         url: mappedProduct.link_rewrite[0].value,
  //         main_img_id: mappedProduct.associations.images[0].id,
  //         desc: mappedProduct.description[0].value,
  //         desc_short: mappedProduct.description_short[0].value,
  //         sku: mappedProduct.reference,
  //       };

  //       setProduct(productData);
  //     } catch (error) {
  //       console.log(error);
  //     }
  //   };

  //   fetchProduct();
  // }, [productUrl]);

  // const fetchStock = async (stockIds) => {
  //   try {
  //     const stockResponses = await Promise.all(
  //       stockIds.map(async (stockId) => {
  //         const response = await axios.get(
  //           `https://prestashop.petplushies.pt/api/stock_availables/${stockId}?ws_key=VM5DI26GFZN3EZIE4UVUNIVE2UMUGMEA&output_format=JSON`
  //         );
  //         return response.data.stock_available.quantity;
  //       })
  //     );

  //     // Assuming stockIds is an array of stock IDs corresponding to each image
  //     // If there is only one stock ID, you can directly return stockResponses[0]

  //     return stockResponses;
  //   } catch (error) {
  //     console.error("Error fetching stock:", error);
  //     // You might want to return a default value or handle the error differently
  //     return 0; // Default value for stock
  //   }
  // };

  // const addToCart = async (product) => {
  //   if (cartId || cartId === 0) {
  //     console.log("there is already a cart with this ID");

  //     try {
  //       const response = await axios.get(
  //         `https://prestashop.petplushies.pt/api/carts/${cartId}?ws_key=VM5DI26GFZN3EZIE4UVUNIVE2UMUGMEA&output_format=JSON`
  //       );
  //       if (response.status === 200) {
  //         const productsInCart = response.data.cart.associations.cart_rows;

  //         // Check if the product is already in the cart
  //         const existingProductIndex = productsInCart.findIndex(
  //           (p) => product.key === p.id_product
  //         );

  //         if (existingProductIndex !== -1) {
  //           // Update quantity for the existing product
  //           console.log("there is already a product with this ID");
  //           productsInCart[existingProductIndex].quantity = 2;
  //         } else {
  //           // Add a new product to the cart
  //           const newProduct = {
  //             id_product: product.key,
  //             id_address_delivery: 3,
  //             quantity: 2,
  //           };
  //           productsInCart.push(newProduct);
  //         }

  //         const obj = {
  //           prestashop: {
  //             cart: {
  //               id: cartId,
  //               id_currency: 1,
  //               id_lang: 1,
  //               associations: response.data.cart.associations,
  //             },
  //           },
  //         };

  //         const xmlString = objectToXml(obj);

  //         const response_insert = await fetch(
  //           `https://prestashop.petplushies.pt/api/carts/${cartId}?ws_key=VM5DI26GFZN3EZIE4UVUNIVE2UMUGMEA&output_format=XML`,
  //           {
  //             method: "PATCH",
  //             headers: {
  //               "Content-Type": "application/xml",
  //             },
  //             body: xmlString,
  //           }
  //         );

  //         const data = await response_insert.json();
  //         console.log("Product added to cart:", data);
  //       }
  //     } catch (error) {
  //       console.error("Error adding to cart:", error);
  //     }
  //   } else {
  //     try {
  //       const xmlPayloadCart = `<prestashop>
  //                               <cart>
  //                                 <id_product>${product.key}</id_product>
  //                                 <quantity>1</quantity>
  //                                 <id_currency>1</id_currency>
  //                                 <id_lang>1</id_lang>
  //                                 <secure_key>${sessionKey}</secure_key>
  //                                 <associations>
  //                                   <cart_rows>
  //                                     <cart_row>
  //                                       <id_product>${product.key}</id_product>
  //                                       <id_product_attribute/>
  //                                       <id_address_delivery>3</id_address_delivery>
  //                                       <quantity>1</quantity>
  //                                     </cart_row>
  //                                   </cart_rows>
  //                                 </associations>
  //                               </cart>
  //                           </prestashop>`;

  //       const response = await fetch(
  //         `https://prestashop.petplushies.pt/api/carts?ws_key=VM5DI26GFZN3EZIE4UVUNIVE2UMUGMEA&output_format=XML`,
  //         {
  //           method: "POST",
  //           headers: {
  //             "Content-Type": "application/xml",
  //           },
  //           body: xmlPayloadCart,
  //         }
  //       );

  //       const data = await response.json();
  //       console.log("Product added to cart:", data);
  //     } catch (error) {
  //       console.error("Error adding to cart:", error);
  //     }
  //   }
  // };

  useEffect(() => {
    // Retrieve the session key from local storage
    const storedSessionData = localStorage.getItem("sessionData");

    if (storedSessionData) {
      const { key } = JSON.parse(storedSessionData);
      setSessionKey(key);
    } else {
      // Handle the case where the session key is not found in local storage
      // For example, generate a new session key and store it in local storage
      // const newSessionKey = generateSessionKey();
      // setSessionKey(newSessionKey);
      // setSessionInLocalStorage(newSessionKey);
    }
  }, []);

  return (
    <Container>
      <ContentLocked>
        {product != undefined && (
          <>
            <StyledH1>{product.name}</StyledH1>
            <Breadcrumbs page="/produtos" item={product.name} />
            <StyledRow>
              <Col span={11}>
                <ImageCarousel
                  pictures={[product.slideshow]}
                  settings={{
                    dots: true,
                    infinite: true,
                    speed: 500,
                    //add thumbnails after
                    slidesToShow: 1,
                    slidesToScroll: 1,
                  }}
                />
                <ProductDesc
                  dangerouslySetInnerHTML={{ __html: product.desc_short }}
                />
              </Col>
              <Col span={11}>
                <AddToCart
                  onClick={() => addToCart(product)}
                  sku={product.sku}
                  price={product.price + "€"}
                />
                <Accordion desc={product.desc} />
                <ShareSocials
                  item={{
                    key: product.key,
                    name: product.name,
                    url: `${product.main_img_id}-large_default/${product.url}.jpg`,
                    picture: product.picture,
                    desc: product.desc_short,
                  }}
                  page="produtos"
                />
              </Col>
            </StyledRow>
          </>
        )}
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

const ProductDesc = styled.div`
  margin-top: 50px;
`;

export default {
  path: "/produtos/:productUrl",
  exact: true,
  component: Product,
};
