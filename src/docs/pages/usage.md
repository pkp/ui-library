# Usage Guide

This UI Library uses [Vue.js](https://vuejs.org/), a JavaScript library for building interactive applications. If you're not familiar with Vue.js, read its [usage guide](https://vuejs.org/v2/guide/) before continuing.

## Working with OJS and OMP

OJS and OMP load this library as a submodule under `/lib/ui-library/`. In `/js/load.js`, each application loads the components it needs from the UI Library.

When you are using OJS or OMP from a distributed release package, you will only have a pre-compiled `/js/build.js` file. You will not have the full component library under `/lib/ui-library/`.

If you want to make changes to the components, you will need to use the development repository for [OJS](https://github.com/pkp/ojs) or [OMP](https://github.com/pkp/omp). Follow the steps described there to setup and install the application.

## Compiling for OJS and OMP

To compile the `/js/build.js` file while you are working on the library, run the following command from OJS or OMP's root directory.

```bash
npm run serve
```

When you are done, run the following command to compile an optimized `/js/build.js` for production.

```bash
npm run build
```

## Global Vue Instance

You may want to modify the global Vue object. This may be necessary if you:

- Add custom components
- Use third-party plugins
- Add global mixins

You can access the global Vue object at `pkp.Vue`.

If a Vue plugin tells you it should be registered with `Vue.use(...)`, you can use `pkp.Vue.use(...)`.

*Your intervention will likely happen before Apps are instantiated and mounted, but after the global event bus is instantiated.*
