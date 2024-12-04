import React, { useEffect, useState, createContext } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useColorScheme } from "react-native";
import dark from "./dark";
import light from "./light";
// Contexto para gerenciar o tema globalmente
export const ThemeContext = createContext();

export const ThemeManager = ({ children }) => {
  const [theme, setTheme] = useState(light); // Tema inicial
  const [selectedTheme, setSelectedTheme] = useState("default"); // Padrão: Tema do dispositivo
  const systemTheme = useColorScheme(); // Detecta o tema do dispositivo

  const handleThemeChange = async (themeOption) => {
    try {
      setSelectedTheme(themeOption);

      if (themeOption === "default") {
        // Usa o tema do dispositivo
        if (systemTheme === "dark") {
          setTheme(dark);
        } else {
          setTheme(light);
        }
        await AsyncStorage.removeItem("theme");
      } else if (themeOption === "light") {
        // Define o tema claro
        setTheme(light);
        await AsyncStorage.setItem("theme", "light");
      } else if (themeOption === "dark") {
        // Define o tema escuro
        setTheme(dark);
        await AsyncStorage.setItem("theme", "dark");
      }
    } catch (error) {
      console.error("Erro ao alterar o tema:", error);
    }
  };

  useEffect(() => {
    const loadTheme = async () => {
      try {
        const storedTheme = await AsyncStorage.getItem("theme");
        if (storedTheme) {
          setSelectedTheme(storedTheme);
          setTheme(storedTheme === "dark" ? dark : light);
        } else {
          // Caso não tenha tema armazenado, use o tema do dispositivo
          setSelectedTheme("default");
          if (systemTheme === "dark") {
            setTheme(dark);
          } else {
            setTheme(light);
          }
        }
      } catch (error) {
        console.error("Erro ao carregar o tema inicial:", error);
      }
    };

    loadTheme();
  }, [systemTheme]);

  return (
    <ThemeContext.Provider value={{ theme, selectedTheme, handleThemeChange }}>
      {children}
    </ThemeContext.Provider>
  );
};
