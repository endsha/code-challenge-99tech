# Currency Swap Form - React + TypeScript + Vite

This project is a currency swap form application built with React, TypeScript, and Vite. It allows users to swap assets from one currency to another with an intuitive and visually attractive interface.

## Task Description

Create a currency swap form based on the template provided in the folder. A user would use this form to swap assets from one currency to another.

_You may use any third party plugin, library, and/or framework for this problem._

### Requirements

1. You may add input validation/error messages to make the form interactive.
2. Your submission will be rated on its usage intuitiveness and visual attractiveness.
3. Show us your frontend development and design skills, feel free to totally disregard the provided files for this problem.
4. You may use this [repo](https://github.com/Switcheo/token-icons/tree/main/tokens) for token images, e.g. [SVG image](https://raw.githubusercontent.com/Switcheo/token-icons/main/tokens/SWTH.svg).
5. You may use this [URL](https://interview.switcheo.com/prices.json) for token price information and to compute exchange rates (not every token has a price, those that do not can be omitted).

### Bonus Features

✨ **Bonus**: extra points if you use [Vite](https://vite.dev/) for this task!

### Implementation Notes

💡 **Hint**: feel free to simulate or mock interactions with a backend service, e.g. implement a loading indicator with a timeout delay for the submit button is good enough.

## Getting Started

### Prerequisites

- Node.js (version 18 or higher)
- Yarn package manager

### Check and Install Yarn 4.x (if using Yarn)

1. Check your current Yarn version:

   ```bash
   yarn --version
   ```

2. If you don't have Yarn or need to upgrade to 4.x, install Corepack first (requires npm):

   ```bash
   npm install -g corepack
   ```

3. Enable Corepack:

   ```bash
   corepack enable
   ```

4. Set Yarn to the latest stable version (4.x):

   ```bash
   yarn set version stable
   ```

5. Verify the installation:
   ```bash
   yarn --version
   ```

### Installation

1. Navigate to the problem2 directory:

   ```bash
   cd src/problem2
   ```

2. Install dependencies:
   ```bash
   yarn install
   ```

### Running the Application

1. Start the development server:

   ```bash
   yarn dev
   ```

2. Open your browser and navigate to `http://localhost:5173` (or the port shown in your terminal)

### Building for Production

To create a production build:

```bash
yarn build
```

### Additional Scripts

- `yarn lint` - Run ESLint to check code quality
- `yarn preview` - Preview the production build locally
