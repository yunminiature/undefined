import React, { FC, PropsWithChildren, useCallback, useEffect, useMemo, useState } from 'react';
import { useGetThemeQuery, useSetThemeMutation, type ThemeName } from '@/api/theme';
import { ThemeContext, ThemeContextValue } from './ThemeContext';

export const ThemeProvider: FC<PropsWithChildren> = ({ children }) => {
  const [theme, setThemeState] = useState<ThemeName>('light');

  const { data } = useGetThemeQuery();
  const [persistTheme] = useSetThemeMutation();

  const applyThemeClass = useCallback((name: ThemeName) => {
    if (typeof document === 'undefined') return;
    const root = document.documentElement;
    if (name === 'dark') root.classList.add('dark');
    else root.classList.remove('dark');
  }, []);

  useEffect(() => {
    const name = (data?.name === 'dark' ? 'dark' : 'light') as ThemeName;
    setThemeState(name);
    applyThemeClass(name);
  }, [data?.name, applyThemeClass]);

  const setTheme = useCallback(
    (name: ThemeName) => {
      setThemeState(name);
      applyThemeClass(name);
      persistTheme({ name });
    },
    [applyThemeClass, persistTheme]
  );

  const toggleTheme = useCallback(() => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  }, [theme, setTheme]);

  const value = useMemo<ThemeContextValue>(() => ({ theme, setTheme, toggleTheme }), [theme, setTheme, toggleTheme]);

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};
