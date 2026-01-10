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

```# Expo Router DevTools

A development tool for Expo Router that helps you navigate, save, and track routes.

## Installation

```bash
npm install expo-router-devtools
```
## API Reference

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `position` | `'top' \| 'bottom'` | `'top'` | Position of the DevTools panel |
| `theme` | `'light' \| 'dark'` | `'light'` | Color theme |
| `hideInProduction` | `boolean` | `true` | Hide in production builds |
| `storageKeyPrefix` | `string` | `'expo-router-devtools_'` | Prefix for SecureStore keys |
| `onRouteChange` | `(route: string) => void` | `undefined` | Callback when route changes |
| `enableHistory` | `boolean` | `true` | Enable route history tracking |
| `maxHistory` | `number` | `10` | Maximum history items |
| `maxNumOfLines` | `number` | `3` | Max lines for current route display |

### Example

```tsx
<ExpoRouterDevTools
  position="bottom"
  theme="dark"
  maxHistory={20}
  onRouteChange={(route) => console.log(route)}
/>
```
