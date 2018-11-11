import React from "react";

export function Tab({ label, active, onClick }) {
  const className = active ? "Tab active" : "Tab";
  return (
    <a className={className} onClick={onClick} title={label}>
      {label}
    </a>
  );
}

export function TabPanel({ active, children }) {
  if (active) {
    return <div className="TabPanel">{children}</div>;
  }

  return null;
}

export function Tabs({ tabs, panels }) {
  const [activeTabId, setActiveTabId] = React.useState(0);

  return (
    <div className="Tabs">
      <div className="TabBar">
        {tabs.map((tab, ix) => {
          return <Tab key={ix} active={ix === activeTabId} label={tab.label} onClick={() => setActiveTabId(ix)} />;
        })}
      </div>
      {panels.map((p, ix) => {
        return (
          <TabPanel key={ix} active={activeTabId === ix}>
            {p}
          </TabPanel>
        );
      })}
    </div>
  );
}
