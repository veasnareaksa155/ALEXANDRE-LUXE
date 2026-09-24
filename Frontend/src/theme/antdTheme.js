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
    Notification: {
      colorBgElevated: "#ffffff",
      colorText: "#4b5563",
      colorTextHeading: "#111111",
      colorIcon: "#10b981",
      colorIconHover: "#111111",
      borderRadiusLG: 10,
    },
    Message: {
      colorBgElevated: "#ffffff",
      colorText: "#111111",
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
      colorPrimaryHover: "#222222",
      colorBgContainer: "#ffffff",
      colorBgElevated: "#ffffff",
      colorText: "#111111",
      colorTextPlaceholder: "#666666",
      optionSelectedBg: "#000000",
      optionSelectedColor: "#ffffff",
      optionActiveBg: "#f5f5f5",
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
      colorBgContainer: "#ffffff",
      headerBg: "#f4f4f5",
      headerColor: "#000000",
      rowHoverBg: "#f9fafb",
      borderColor: "#e5e5e5",
      colorText: "#000000",
      colorTextHeading: "#000000",
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
