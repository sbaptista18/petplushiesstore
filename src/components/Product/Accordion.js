import { Collapse } from "antd";
import styled from "styled-components";
import PropTypes from "prop-types";

const { Panel } = Collapse;

const Accordion = ({ desc }) => {
  const items = [
    {
      key: "1",
      label: "Informações sobre o produto",
      children: desc,
    },
    {
      key: "2",
      label: "Política de Retorno e Reembolso",
      children: `<p>
          Nós fazemos o possível para enviar o melhor trabalho que o artesanato pode oferecer, no entanto também acreditamos que o cliente merece a oportunidade de devolver o produto caso não esteja satisfeito. Nós pagamos os portes para o envio de volta! Pode consultar mais informações na página de Termos e Condições.
        </p>`,
    },
    {
      key: "3",
      label: "Informação de Envio",
      children: `<p>
          Os portes de envio serão calculados na página de Finalização de Compra. Pode consultar todas as informações e preços na página de Termos e Condições.
        </p>`,
    },
    {
      key: "4",
      label: "Nós ajudamos abrigos de animais",
      children: `<p>
          A PetPlushies dedica-se a ajudar os abrigos/associações de animais por esse país fora. Todos os meses um abrigo/associação diferente será escolhido para que a ajuda chegue a mais patudos!
          <br>
          <b>10% de todas as vendas serão doados ao abrigo/associação anunciados no nosso blog.</b>
        </p>`,
    },
  ];
  return (
    <Container defaultActiveKey={["1"]} accordion>
      {items.map((item) => (
        <Panel header={item.label} key={item.key}>
          <div dangerouslySetInnerHTML={{ __html: item.children }} />
        </Panel>
      ))}
    </Container>
  );
};

Accordion.propTypes = {
  desc: PropTypes.string,
};

const Container = styled(Collapse)`
  margin-top: 30px;
`;

export default Accordion;
