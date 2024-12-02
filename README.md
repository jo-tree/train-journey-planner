# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type aware lint rules:

- Configure the top-level `parserOptions` property like this:

```js
export default tseslint.config({
  languageOptions: {
    // other options...
    parserOptions: {
      project: ["./tsconfig.node.json", "./tsconfig.app.json"],
      tsconfigRootDir: import.meta.dirname,
    },
  },
});
```

- Replace `tseslint.configs.recommended` to `tseslint.configs.recommendedTypeChecked` or `tseslint.configs.strictTypeChecked`
- Optionally add `...tseslint.configs.stylisticTypeChecked`
- Install [eslint-plugin-react](https://github.com/jsx-eslint/eslint-plugin-react) and update the config:

```js
// eslint.config.js
import react from "eslint-plugin-react";

export default tseslint.config({
  // Set the react version
  settings: { react: { version: "18.3" } },
  plugins: {
    // Add the react plugin
    react,
  },
  rules: {
    // other rules...
    // Enable its recommended rules
    ...react.configs.recommended.rules,
    ...react.configs["jsx-runtime"].rules,
  },
});
```

# The Challenge

## What:

Create a train trip scheduling "app".

## Tech:

Freedom of choice.

Given a train stop network, allow the user to schedule trips between X and Y, and show:

1. It is possible
2. Each available route with all the stops i.e. X-A-C-Y, X-B-Y, X-D-E-Y
3. Place time/distance on each node connection and determine time/distance for each available route so the user can pick the shortest/fastest or show them in order.

Produce a basic web application (written in your choice of tech) and a set of unit tests that allow the following:
NOTE: Don't worry about adding any fancy graphics or animations but make sure everything is coded in a tidy and consistent manner and works across the following browsers - IE (latest version), Firefox (latest version), Chrome (latest version). All pages should appear the same in each of these browsers.

NZ Railways operates a number of rail services around New Zealand. Because of historical reasons the tracks are “one-way”. Where rail services are offered in both directions, they are done over separate tracks and are not necessarily the same cost/distance to travel.

Develop a simple solution which will help provide our customers with information about the trips we can offer. In particular we have demand from our customers to calculate the distance along a specific route and the shortest route between two towns. Basic Requirements

We require the following functionality to be implemented as part of the solution in priority order:

## Calculate Distance:

Allow the user to enter a number of stops and then print the distance involved in traversing the route. If the route cannot be traversed because it is invalid then print out an error message.
Test data: A-B-C, A-E-B-C-D, A-D, A-D-C, A-E-D

## Journey Planner:

Allow the user to enter a start and end station and optionally a maximum or exact number of “stops” along the way. The screen should calculate and print out the number of possibilities that exist.
Test data: C to C with a maximum of 3 stops

## What is the shortest route?:

Allow the user to enter a start and end station (which could be the same station) and then print out the length and details of the shortest route (in terms of distance to travel).
Test data: B to B, A to C

## Data:

Our rail network is represented as an undirected graph where a node represents a station and an edge represents a route between two stations. The weighting of the edge represents the distance between the two towns. A given route will never appear more than once, and for a given route, the starting and ending town will not be the same town. The towns are codenamed using the letters of the alphabet from A to E. A route between two towns (A to B) with a distance of 5 is represented as AB5.
For the test data you should use the set:
AB5, BC4, CD8, DC8, DE6, AD5, CE2, EB3, AE7
