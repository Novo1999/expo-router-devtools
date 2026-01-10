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
import { ExpoRouterDevTools } from '@novodip/expo-router-devtools';

export default function App() {
  return (
    <>
      <ExpoRouterDevTools />
    </>
  );
}
```
