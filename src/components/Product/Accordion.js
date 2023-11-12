import { Collapse } from "antd";
import styled from "styled-components";
import PropTypes from "prop-types";

const { Panel } = Collapse;

const Accordion = ({ desc }) => {
  const items = [
    {
      key: "1",
      label: "PRODUCT INFO",
      children: desc,
    },
    {
      key: "2",
      label: "RETURN & REFUND POLICY",
      children: (
        <p>
          I’m a Return and Refund policy. I’m a great place to let your
          customers know what to do in case they are dissatisfied with their
          purchase. Having a straightforward refund or exchange policy is a
          great way to build trust and reassure your customers that they can buy
          with confidence.
        </p>
      ),
    },
    {
      key: "3",
      label: "SHIPPING INFO",
      children: (
        <p>
          I'm a shipping policy. I'm a great place to add more information about
          your shipping methods, packaging and cost. Providing straightforward
          information about your shipping policy is a great way to build trust
          and reassure your customers that they can buy from you with
          confidence.
        </p>
      ),
    },
  ];
  return (
    <Container defaultActiveKey={["1"]} accordion>
      {items.map((item) => (
        <Panel header={item.label} key={item.key}>
          {item.children}
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
