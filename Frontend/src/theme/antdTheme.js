import { theme } from "antd";

export const luxuryTheme = {
  token: {
    colorPrimary: "#000000",
    colorLink: "#000000",
    colorLinkHover: "#333333",
    colorBgBase: "#ffffff",
    colorTextBase: "#111111",
    colorBorder: "#e5e5e5",
    borderRadius: 6,
    fontFamily:
      '"Plus Jakarta Sans", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    controlHeight: 42,
  },
  components: {
    Button: {
      colorPrimary: "#000000",
      colorPrimaryHover: "#222222",
      colorPrimaryActive: "#000000",
      borderRadius: 4,
      controlHeight: 44,
      fontWeight: 600,
    },
    Card: {
      borderRadiusLG: 8,
      boxShadowSecondary: "0 4px 20px rgba(0,0,0,0.06)",
    },
    Drawer: {
      colorBgContainer: "#ffffff",
    },
    Modal: {
      colorBgContainer: "#ffffff",
      borderRadiusLG: 10,
    },
    Badge: {
      colorPrimary: "#000000",
    },
    Tabs: {
      itemColor: "#666666",
      itemSelectedColor: "#000000",
      inkBarColor: "#000000",
    },
    Input: {
      activeBorderColor: "#000000",
      hoverBorderColor: "#666666",
    },
    Select: {
      colorPrimary: "#000000",
      colorPrimaryHover: "#333333",
    },
  },
};

export const adminDarkTheme = {
  algorithm: theme.darkAlgorithm,
  token: {
    colorPrimary: "#ffffff",
    colorBgBase: "#000000",
    colorBgContainer: "#121212",
    colorBgElevated: "#1c1c1c",
    colorTextBase: "#ffffff",
    colorTextDescription: "#a3a3a3",
    colorBorder: "#262626",
    colorBorderSecondary: "#1f1f1f",
    borderRadius: 8,
    fontFamily:
      '"Plus Jakarta Sans", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  },
  components: {
    Card: {
      colorBgContainer: "#121212",
      colorBorderSecondary: "#262626",
    },
    Table: {
      colorBgContainer: "#121212",
      headerBg: "#1c1c1c",
      headerColor: "#ffffff",
      rowHoverBg: "#1f1f1f",
      borderColor: "#262626",
    },
    Modal: {
      colorBgContainer: "#121212",
      colorBgElevated: "#1c1c1c",
    },
    Select: {
      colorBgContainer: "#1c1c1c",
      colorBgElevated: "#262626",
      colorPrimary: "#ffffff",
    },
    Input: {
      colorBgContainer: "#1c1c1c",
      activeBorderColor: "#ffffff",
      hoverBorderColor: "#737373",
    },
    Button: {
      colorPrimary: "#ffffff",
      colorTextLightSolid: "#000000",
      fontWeight: 700,
    },
    Tag: {
      colorBgContainer: "#1c1c1c",
    },
  },
};
