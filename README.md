# Shopco HTML Template

A modern, responsive e-commerce web application template built with HTML5, SCSS (using the BEM methodology), and modular Vanilla JavaScript.

## 🚀 Features

- **Responsive Design**: Mobile-first approach ensuring a seamless experience across all devices (Desktop, Tablet, Mobile).
- **SCSS Architecture**: Highly organized SCSS structure utilizing variables, mixins, and the BEM (Block Element Modifier) naming convention for maintainable styles.
- **Modular JavaScript**: Component-based JavaScript architecture handling UI states, dynamic rendering, and page-specific logic cleanly.
- **Dynamic Data**: Fetches mock data (Products, Reviews) from JSON files to simulate a real-world API integration.
- **Automated Workflow**: Uses Gulp to automatically compile and compress SCSS into CSS.

## 🛠️ Tech Stack

- **HTML5**: Semantic markup
- **CSS / SCSS**: Pre-compiled styling
- **JavaScript (ES6+)**: Vanilla JS for logic and DOM manipulation
- **Gulp**: Task runner for SCSS compilation
- **NPM**: Package management

## 📁 Project Structure

```text
├── assets/
│   ├── data/       # JSON mock data (products.json, reviews.json)
│   ├── fonts/      # Custom fonts
│   ├── icons/      # SVG and PNG icons
│   └── images/     # Product and UI images
├── css/            # Compiled output CSS directory
├── js/
│   ├── components/ # Reusable UI components (header, slider, filter)
│   ├── modules/    # Page-specific logic (api, cart-page, product-page)
│   └── main.js     # Main entry point for all JS
├── scss/
│   ├── abstracts/  # Variables, mixins, functions
│   ├── base/       # Resets, typography, helpers
│   ├── components/ # Reusable UI components (buttons, cards, forms)
│   ├── layout/     # Grid, header, footer, sections
│   ├── pages/      # Page-specific styles
│   └── main.scss   # Main importer file
├── index.html      # Homepage
├── category.html   # Product listing / category page
├── product.html    # Product detail page
├── cart.html       # Shopping cart page
├── gulpfile.js     # Gulp task configurations
└── package.json    # Project dependencies
```

## 💻 Getting Started

### Prerequisites
Make sure you have [Node.js](https://nodejs.org/) installed on your machine.

### Installation

1. Clone or download the repository.
2. Install the project dependencies:
   ```bash
   npm install
   ```

### Development

To compile the SCSS files and watch for changes, run the Gulp default task:

```bash
npx gulp
```
This command will continuously monitor the `scss/` folder and output compressed CSS to `css/main.css` whenever you save a change.

### Serving the Project
To view the project, you can use any local development server (like VS Code Live Server, or `npx serve`).

```bash
# Example using npx serve
npx serve .
```

## 📐 Architectural Guidelines

This project strictly adheres to specific coding conventions to ensure high quality and maintainability:

### BEM Naming Convention (CSS/SCSS)
- **Block**: Independent entity that is meaningful on its own (e.g., `.card`, `.button`).
- **Element**: Parts of a block that have no standalone meaning and are semantically tied to their block (e.g., `.card__title`).
- **Modifier**: Flags on blocks or elements used to change appearance or behavior (e.g., `.button--primary`, `.card__title--large`).
- **JS Hooks**: Classes strictly used for JavaScript targeting should be prefixed with `js-` (e.g., `.js-range-slider`) and never used for styling.

### Responsive Design Rules
- **Typography Base**: Uses a `62.5%` html font-size base so that `1rem = 10px` for easier mental math.
- **Fluid Layouts**: Uses percentages (`%`) for widths to allow fluid scaling across orientations and screen sizes.
- **Images**: Responsive by default (`max-width: 100%; height: auto;`).

## 📄 License
ISC License
