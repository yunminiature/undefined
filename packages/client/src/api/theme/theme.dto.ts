export type ThemeName = 'light' | 'dark';

export type ThemeResponse = {
  name: ThemeName;
  palette?: Record<string, string>;
};

export type SetThemeRequest = {
  name: ThemeName;
};
