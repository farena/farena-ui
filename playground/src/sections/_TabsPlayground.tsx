import { useState } from "react";
import { FormIcon, Tabs, type Tab } from "@farena/farena-ui";
import { Example, Section } from "./_PlaygroundLayout";

const tabs: Tab[] = [
  { title: "Bookings", icon: "fa fa-home" },
  { title: "Properties", icon: "fa fa-gears" },
  "Landlords",
  "Rooms",
  "Beds",
];

export default function TabsPlayground() {
  const [lastChange, setLastChange] = useState<Tab | null>(null);
  const [dynamicTabs, setDynamicTabs] = useState(["Tab 1", "Tab 2"]);

  return (
    <Section title="Tabs" state={{ lastChange }}>
      <Example title="Basic (with header and icons)">
        <Tabs tabs={tabs} header={<h4>TABS HEADER</h4>} onChange={setLastChange}>
          <p className="m-0">Bookings pane</p>
          <p className="m-0">Properties pane</p>
          <p className="m-0">Landlords pane</p>
          <p className="m-0">Rooms pane</p>
          {/* No pane for Beds: shows the fallback */}
        </Tabs>
      </Example>
      <Example title="Underlined">
        <Tabs tabs={tabs.slice(0, 3)} underline>
          <p className="m-0">Bookings pane</p>
          <p className="m-0">Properties pane</p>
          <p className="m-0">Landlords pane</p>
        </Tabs>
      </Example>
      <Example title="Primary theme">
        <Tabs tabs={tabs.slice(0, 3)} theme="primary">
          <p className="m-0">Bookings pane</p>
          <p className="m-0">Properties pane</p>
          <p className="m-0">Landlords pane</p>
        </Tabs>
      </Example>
      <Example title="Add / remove tabs">
        <Tabs
          tabs={dynamicTabs}
          addTab={
            <button
              type="button"
              className="btn"
              aria-label="Add tab"
              onClick={() => setDynamicTabs([...dynamicTabs, `Tab ${Date.now() % 1000}`])}
            >
              <FormIcon icon="plus" />
            </button>
          }
          removeTab={(tab) => (
            <button
              type="button"
              className="fui-remove"
              aria-label={`Close ${String(tab)}`}
              onClick={(e) => {
                e.stopPropagation();
                setDynamicTabs(dynamicTabs.filter((t) => t !== tab));
              }}
            >
              <FormIcon icon="xmark" />
            </button>
          )}
        >
          {dynamicTabs.map((tab) => (
            <p key={tab} className="m-0">
              {tab} pane
            </p>
          ))}
        </Tabs>
      </Example>
    </Section>
  );
}
