import { Collapse } from "antd";
import styled from "styled-components";

const { Panel } = Collapse;

const items = [
  {
    key: "1",
    label: "PRODUCT INFO",
    children: (
      <p>
        I'm a product detail. I'm a great place to add more information about
        your product such as sizing, material, care and cleaning instructions.
        This is also a great space to write what makes this product special and
        how your customers can benefit from this item. Buyers like to know what
        they’re getting before they purchase, so give them as much information
        as possible so they can buy with confidence and certainty.
      </p>
    ),
  },
  {
    key: "2",
    label: "RETURN & REFUND POLICY",
    children: (
      <p>
        I’m a Return and Refund policy. I’m a great place to let your customers
        know what to do in case they are dissatisfied with their purchase.
        Having a straightforward refund or exchange policy is a great way to
        build trust and reassure your customers that they can buy with
        confidence.
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
        information about your shipping policy is a great way to build trust and
        reassure your customers that they can buy from you with confidence.
      </p>
    ),
  },
];

export default () => (
  <Accordion defaultActiveKey={["1"]} accordion>
    {items.map((item, index) => (
      <Panel header={item.label} key={item.key}>
        {item.children}
      </Panel>
    ))}
  </Accordion>
);

const Accordion = styled(Collapse)`
  margin-top: 30px;
`;
