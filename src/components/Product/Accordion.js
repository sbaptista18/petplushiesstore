import { Collapse } from "antd";

const { Panel } = Collapse;

const text = `
  A dog is a type of domesticated animal.
  Known for its loyalty and faithfulness,
  it can be found as a welcome guest in many households across the world.
`;

const items = [
  {
    key: "1",
    label: "This is panel header 1",
    children: <p>{text}</p>,
  },
  {
    key: "2",
    label: "This is panel header 2",
    children: <p>{text}</p>,
  },
  {
    key: "3",
    label: "This is panel header 3",
    children: <p>{text}</p>,
  },
];

export default () => (
  <Collapse defaultActiveKey={["1"]} accordion>
    {items.map((item, index) => (
      <Panel header={item.label} key={item.key}>
        {item.children}
      </Panel>
    ))}
  </Collapse>
);
