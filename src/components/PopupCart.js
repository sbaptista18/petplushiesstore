import { Row, Col } from "antd";
import styled from "styled-components";
import { CloseOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";
import { Button } from "components";
import { useTranslation } from "react-i18next";

const PopupCart = ({ handleOpenCart, isOpen, cartItems }) => {
  const { t } = useTranslation();
  return (
    <Container className={isOpen ? "open" : ""}>
      <CloseBtn onClick={handleOpenCart} />
      <Row>
        <Title>{t("meuCarrinho")}</Title>
      </Row>
      <Row>
        {cartItems.length != 0 ? (
          <Col span={24}>
            <HeaderRow>
              <Col span={14}>{t("produto")}</Col>
              <Col span={2}>{t("qtd")}.</Col>
              <Col span={4}>{t("preco")}</Col>
            </HeaderRow>
            {cartItems.map((i) => {
              return (
                <ProductRow key={i.product_id}>
                  <Col span={4}>
                    <StyledImg
                      src={i.main_image_url}
                      alt={`${i.name} - Pet Plushies`}
                    />
                  </Col>
                  <Col span={10}>
                    <Link to={`/loja/${i.slug}`}>{i.name}</Link>
                  </Col>
                  <Col span={2}>{i.product_qty}</Col>
                  <Col span={4}>{i.product_gross_revenue}&euro;</Col>
                </ProductRow>
              );
            })}
            <ButtonRow>
              <StyledLink to="/carrinho">
                <Button size="large" type="primary" text={t("verCarrinho")} />
              </StyledLink>
            </ButtonRow>
          </Col>
        ) : (
          t("carrinhoVazio")
        )}
      </Row>
    </Container>
  );
};

const Container = styled.div`
  position: absolute;
  background-color: var(--white);
  width: 500px;
  height: calc(100vh - var(--menu-height));
  right: 0;
  top: var(--menu-height);
  padding: 20px;
  box-shadow: 0px 5px 30px 0px rgba(0, 0, 0, 0.1);
  transform: translateX(200%);
  transition: 0.5s;

  &.open {
    transform: translateX(0%);
  }
`;

const CloseBtn = styled(CloseOutlined)`
  position: absolute;
  right: 20px;
  top: 20px;
`;

const Title = styled.div`
  font-size: 20px;
  font-weight: 600;
`;

const HeaderRow = styled(Row)`
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-weight: 600;
`;

const ProductRow = styled(HeaderRow)`
  margin-bottom: 20px;
  font-weight: 400;
`;

const ButtonRow = styled(Row)`
  justify-content: flex-end;
  margin-top: 30px;
`;

const StyledLink = styled(Link)`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;

  & button {
    width: 90%;
  }
`;

const StyledImg = styled.img`
  width: 100%;
  height: auto;
`;

export default PopupCart;
