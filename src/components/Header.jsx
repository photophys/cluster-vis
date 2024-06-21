import React from "react"

import { Layout, Menu } from "antd"
const { Header: AntdHeader } = Layout

import Logo from "./Logo"

const Header = ({ setMode }) => (
  <AntdHeader
    style={{
      display: "flex",
      alignItems: "center",
    }}
  >
    <Logo />
    <Menu
      theme="dark"
      mode="horizontal"
      defaultSelectedKeys={["1"]}
      items={[
        { key: 1, label: "Groups", onClick: () => setMode(1) },
        { key: 2, label: "Uniques", onClick: () => setMode(2) },
      ]}
      style={{
        flex: 1,
        minWidth: 0,
      }}
    />
  </AntdHeader>
)

export default Header
