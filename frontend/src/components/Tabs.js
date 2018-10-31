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

export class Tabs extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      activeTabId: 0
    };
  }

  onTabClick = tabId => {
    this.setState({ activeTabId: tabId });
  };

  render() {
    const { tabs, panels } = this.props;
    const { activeTabId } = this.state;

    return (
      <div className="Tabs">
        <div className="TabBar">
          {tabs.map((tab, ix) => {
            return <Tab key={ix} active={ix === activeTabId} label={tab.label} onClick={() => this.onTabClick(ix)} />;
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
}
