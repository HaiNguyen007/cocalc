import * as React from "react";
import { Popover } from "antd";
import { Icon } from "./r_misc";
const { NavItem } = require("react-bootstrap");
import { AccountActions } from "./account";

interface Props {
  icon: React.ReactNode; // When clicked, show popover
  links: React.ReactNode; // Should change view to correct account settings tab when clicked
  label_class: string; // class name for AccountTabDropdown label
  show_label: boolean; // This tells button to show
  is_active: boolean; // if true set button background to ACTIVE_BG_COLOR
  user_label: string;
}

export const AccountTabDropdown: React.FC<Props> = ({
  icon,
  links,
  label_class,
  show_label,
  is_active,
  user_label
}) => {
  // If icon is a string then use the Icon component
  // Else (it is a node already) just render icon
  return (
    <Popover
      placement="bottom"
      title={"Signed in as " + user_label}
      trigger="click"
      content={links}
    >
      <NavItem
        style={{
          float: "left",
          position: "relative",
          height: "30px"
        }}
      >
        <div style={{ padding: "10px" }}>
          {icon}
          <span style={{ marginLeft: 5 }} className={label_class}>
            Account
          </span>
        </div>
      </NavItem>
    </Popover>
  );
};

interface LinksProps {
  actions: AccountActions;
}

function DropdownLink() {}

export const DefaultAccountDropDownLinks: React.FC<LinksProps> = ({
  account_actions, // Type AccountActions
  page_actions // PageActions (untyped for now)
}) => {
  return (
    <>
      <div className="cocalc-account-button-dropdown-links">
        <li>
          <a
            style={{
              width: "100%",
              padding: "4px 8px 4px 16px",
              display: "inline-block"
            }}
            className={"cocalc-account-button"}
            onClick={_ => {
              event.preventDefault();
              page_actions.set_active_tab("account"); // Set to account page
              account_actions.set_active_tab("account"); /// Set to the Subs and course packs tab
            }}
            href=""
          >
            Preferences
          </a>
        </li>
        <li>
          <a
            style={{
              width: "100%",
              padding: "4px 8px 4px 16px",
              display: "inline-block"
            }}
            className={"cocalc-account-button"}
            onClick={_ => {
              event.preventDefault();
              page_actions.set_active_tab("account"); // Set to account page
              account_actions.set_active_tab("billing"); /// Set to the Preferences tab
            }}
            href=""
          >
            Billing
          </a>
        </li>
        <li>
          <a
            style={{
              width: "100%",
              padding: "4px 8px 4px 16px",
              display: "inline-block"
            }}
            className={"cocalc-account-button"}
            onClick={_ => {
              event.preventDefault();
              page_actions.set_active_tab("account"); // Set to account page
              account_actions.set_active_tab("upgrades"); /// Set to the Preferences tab
            }}
            href=""
          >
            Upgrades
          </a>
        </li>
        <li>
          <a
            style={{
              width: "100%",
              padding: "4px 8px 4px 16px",
              display: "inline-block"
            }}
            className={"cocalc-account-button"}
            onClick={_ => {
              event.preventDefault();
              page_actions.set_active_tab("account"); // Set to account page
              account_actions.set_active_tab("support"); /// Set to the Preferences tab
            }}
            href=""
          >
            Support
          </a>
        </li>
        <li>
          <a
            style={{
              width: "100%",
              padding: "4px 8px 4px 16px",
              display: "inline-block"
            }}
            className={"cocalc-account-button"}
            onClick={_ => {
              account_actions.sign_out();
            }}
            href=""
          >
            Sign out
          </a>
        </li>
      </div>
    </>
  );
};