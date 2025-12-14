export const APP_NAME = "Daily Journal";

export const ROUTES = {
  HOME: "/",
  LOGIN: "/login",
  REGISTER: "/register",
  DASHBOARD: "/dashboard",
  CALENDAR: "/calendar",
  ARCHIVE: "/archive",
  ANALYTICS: "/analytics",
  PROFILE: "/profile",
  NEW_ENTRY: "/entries/new",
  EDIT_ENTRY: (id: string) => `/entries/${id}`,
} as const;

export const DEBOUNCE_DELAY = 300;
export const AUTO_SAVE_INTERVAL = 5000;
export const MAX_TITLE_LENGTH = 180;
export const MAX_TAGS = 12;
export const MIN_TAG_LENGTH = 1;
export const MAX_TAG_LENGTH = 32;
