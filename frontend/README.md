# Frontend

This project uses Angular and [Angular CLI](https://github.com/angular/angular-cli) 22.2.3.

Use Node.js `^22.22.3`, `^24.15.0`, or `^26.0.0` and pnpm. Install dependencies with `pnpm install --frozen-lockfile`.

## UI and styling

Use **PrimeNG > SCSS > Tailwind** when building the interface:

- Use PrimeNG components and their theme for standard controls, cards, messages, and indicators.
- Use `<p-button>` for all buttons.
- Use component SCSS for layout, responsive behavior, and app-specific presentation.
- Use Tailwind only for small additions where PrimeNG and SCSS would be excessive.

Global SCSS lives in `src/styles.scss` and `src/styles/`. Tailwind has a separate CSS entry in `src/styles.css`; its utilities have lower cascade priority than PrimeNG and application styles. Shared colors reference the PrimeNG theme tokens.

## Development server

To start a local development server, run:

```bash
ng serve
```

Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.

## Code scaffolding

Angular CLI includes powerful code scaffolding tools. To generate a new component, run:

```bash
ng generate component component-name
```

For a complete list of available schematics (such as `components`, `directives`, or `pipes`), run:

```bash
ng generate --help
```

## Building

To build the project run:

```bash
ng build
```

This will compile your project and store the build artifacts in the `dist/` directory. By default, the production build optimizes your application for performance and speed.

## Running unit tests

To execute unit tests with the [Karma](https://karma-runner.github.io) test runner, use the following command:

```bash
ng test
```

## Running end-to-end tests

For end-to-end (e2e) testing, run:

```bash
ng e2e
```

Angular CLI does not come with an end-to-end testing framework by default. You can choose one that suits your needs.

## Additional Resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.
