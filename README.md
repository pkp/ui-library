# PKP UI Library

A design pattern and component library for Public Knowledge Project's applications [Open Journal Systems](https://pkp.sfu.ca/ojs/) and [Open Monograph Press](https://pkp.sfu.ca/omp/).

## About

This library contains design patterns implemented or planned for the Public Knowledge Project's applications [Open Journal Systems](https://pkp.sfu.ca/ojs/) and [Open Monograph Press](https://pkp.sfu.ca/omp/).

This library can also be run locally to provide a style guide, component documentation, and a sandbox environment for component development and testing.

## Usage

This library is intended to be included and used within PKP's applications. If you would like to run the style guide and component documentation locally, follow these steps.

```bash
# install dependencies
npm install

# serve with hot reload at localhost:8080
npm run serve
```

Run the following command to build the library with a base path of `/dev/ui-library/<version>`, so it can be included in [PKP's documentation hub](https://github.com/pkp/pkp-docs).

```bash
PKP_DOCS_VERSION=<version> npm run build
```

## Issues

Please file any development issues or questions with the [pkp/pkp-lib](https://github.com/pkp/pkp-lib) repository.

## Thanks

<a href="https://www.chromatic.com/"><img src="https://user-images.githubusercontent.com/321738/84662277-e3db4f80-af1b-11ea-88f5-91d67a5e59f6.png" width="153" height="30" alt="Chromatic" /></a>

Thanks to [Chromatic](https://www.chromatic.com/) for providing the visual testing platform that helps us review UI changes and catch visual regressions.
