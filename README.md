# Expo Router DevTools

A lightweight development utility for inspecting and debugging routes in **Expo Router** applications.
Designed to be embedded directly into React Native apps without affecting production builds.

---

## Features

- View the current route in real time
- Inspect navigation state changes
- Minimal, non-intrusive UI
- Safe to include during development
- Built with TypeScript and Rollup

---

## Benefits
- Useful for complex projects that has a lot of routing
- Useful for projects with query params in many places
- Keeps track of params and query params and save it in the history
- Automatically hidden in production
- Save whatever routes you want and navigate to it
- Routes are automatically stored in expo secure store 
---

## Installation

```bash
npm install expo-router-devtools
```
or

```bash
yarn add expo-router-devtools

```

## Usage
```bash
export default function RootLayout() {
  const colorScheme = useColorScheme()

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <ExpoRouterDevTools />
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  )
}

```
