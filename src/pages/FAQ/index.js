import styled from "styled-components";
import { Row, Collapse } from "antd";

import { PageHeader } from "components";

import DummyImg from "assets/images/batcat-1.jpg";

const { Panel } = Collapse;

const items = [
  {
    key: "1",
    label: "Como posso pagar pelas encomendas?",
    children: `<p>Neste momento pode efectuar pagamentos com PayPal e Transferência Bancária.</p>`,
  },
  {
    key: "2",
    label: "Como são calculados os custos de envio?",
    children: `<p>
        Os custos de envio são calculados em função do peso da encomenda (peso aproximado dos seus itens com o embalamento de envio). O valor pago pode variar ao longo do ano, de acordo com os valores praticados pelos CTT.
      </p>`,
  },
  {
    key: "3",
    label: "Existe alguma campanha de portes grátis?",
    children: `<p>
        De momento temos uma campanha para usufruir de portes de envio grátis se fizer uma encomenda de valor superior a 50€.
      </p>`,
  },
  {
    key: "4",
    label: "Posso encomendar online e levantar a encomenda?",
    children: `<p>
        Fazemos apenas entregas em mão quando estamos presentes em feiras ou mercados de arte, presenças essas anunciadas no nosso Blog.
      </p>`,
  },
  {
    key: "5",
    label: "Para onde fazem envios?",
    children: `<p>
        Fazemos entregas para todas as regiões do país, incluindo ilhas, Europa (excepto alguns países), Estados Unidos da América e resto do mundo.
      </p>`,
  },
  {
    key: "6",
    label: "É possível efectuar uma reserva?",
    children: `<p>
        Não dispomos de serviço de reserva de artigos, mas teremos uma secção de Lista de Desejos no futuro para que possa guardar os seus favoritos para referência futura.
      </p>`,
  },
  {
    key: "7",
    label: "Quando irei receber a minha encomenda?",
    children: `<p>
        Caso confirme a sua encomenda num dia útil até às 14h e proceda ao seu pagamento a sua encomenda será enviada na segunda-feira a seguir, com prazo de entrega de 5 dias úteis (fins-de-semana e feriados não contam como dias úteis) desde que a encomenda é expedida da morada da Pet Plushies para entregas em Portugal Continental. Os prazos podem variar de acordo com a altura do ano, podendo dar-se o caso de as entregas chegarem a 10 dias úteis am alturas que antecedem o Natal, Dia dos Namorados, Dia do Pai, Dia da Mãe e Páscoa, no caso de Portugal Continental, e até 30 dias úteis para o resto do mundo.
      </p>`,
  },
];

const FAQ = () => {
  return (
    <>
      <PageHeader
        title="Perguntas Frequentes"
        img={DummyImg}
        alt="Perguntas Frequentes - Pet Plushies"
      />
      <Container>
        <ContentLocked>
          <Accordion defaultActiveKey={["1"]} accordion>
            {items.map((item) => (
              <Panel header={item.label} key={item.key}>
                <div dangerouslySetInnerHTML={{ __html: item.children }} />
              </Panel>
            ))}
          </Accordion>
        </ContentLocked>
      </Container>
    </>
  );
};

const Accordion = styled(Collapse)`
  margin-top: 30px;
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
  path: "/perguntas-frequentes",
  exact: true,
  component: FAQ,
};
