// Note: Both "light" and "dark" happen to be valid theme identifiers for Bootstrap and Codemirror.
//
//       For Mermaid, "dark" is a valid theme identifier; and, with "light", Mermaid falls back to its default theme.
//       Reference: https://mermaid.js.org/config/theming.html#available-themes
//
export enum Theme {
  Dark = "dark",
  Light = "light",
}

export enum BrowserStorageKey {
  THEME = "theme",
  HAS_DISMISSED_WELCOME_MESSAGE = "has-dismissed-welcome-message",
}

export enum BrowserStorageValue {
  TRUE = "true",
  FALSE = "false",
}

export enum QueryParamKey {
  MAKEFILE_URL = "makefile_url",
}

export enum MermaidGraphDirection {
  LR = "LR",
  TB = "TB",
}

export enum MIMEType {
  SVG = "image/svg+xml",
}
