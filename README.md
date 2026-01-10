# Expo Router DevTools

A lightweight development utility for inspecting and debugging routes in **Expo Router** applications.
Designed to be embedded directly into React Native apps without affecting production builds.

## Demo

[![Expo Router DevTools Demo](https://raw.githubusercontent.com/Novo1999/expo-router-devtools/main/assets/demo-thumbnail.png)](
https://github.com/Novo1999/expo-router-devtools#demo
)

▶ **Watch full 34-second demo video**

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
import { ExpoRouterDevTools } from '@novodip/expo-router-devtools'
import { Stack } from 'expo-router'
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context'

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <SafeAreaView style={{ flex: 1 }} edges={['top']}>
        <ExpoRouterDevTools />
        <Stack>
          <Stack.Screen name="index" options={{ title: 'Home' }} />
          <Stack.Screen name="profile" options={{ title: 'Profile' }} />
          <Stack.Screen name="posts/index" options={{ title: 'Posts' }} />
          <Stack.Screen name="posts/[id]" options={{ title: 'Post Details' }} />
        </Stack>
      </SafeAreaView>
    </SafeAreaProvider>
  )
}

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
| `replaceRoute` | `boolean` | `false` | Whether to replace of push the route |

### Example

```tsx
<ExpoRouterDevTools
  position="bottom"
  theme="dark"
  maxHistory={20}
  onRouteChange={(route) => console.log(route)}
/>
```

