// Note: Both "light" and "dark" happen to be valid theme identifiers for Bootstrap, Codemirror, and Mermaid.
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
