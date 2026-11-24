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

# serve with hot reload at localhost:6006
npm run storybook
```

## Dependencies

This library's `package.json` is the single list of npm dependencies for OJS, OMP and OPS. The applications include it as an [npm workspace](https://docs.npmjs.com/cli/using-npm/workspaces) and declare no dependencies of their own. Running `npm install` in an application installs everything into a single `node_modules` in the application's root.

This library's `package-lock.json` is the source of truth for the installed versions. Each application's `package-lock.json` is generated from it.

### Updating dependencies

1. Add, update or remove the dependency in ui-library. From an application's `lib/ui-library` folder, run:

   ```bash
   # add or update
   npm install <package>@<version> --package-lock-only --workspaces=false

   # remove
   npm uninstall <package> --package-lock-only --workspaces=false
   ```

   These commands change only ui-library's `package.json` and `package-lock.json`. Both flags are needed:

   - Without `--workspaces=false`, npm would update the application's lockfile instead.
   - Without `--package-lock-only`, npm would create a separate `node_modules` in `lib/ui-library`.

   In a standalone ui-library checkout, a plain `npm install <package>@<version>` works.

2. Commit `package.json` and `package-lock.json` to ui-library and open a pull request.

3. In each application (OJS, OMP and OPS):

   1. Update the `lib/ui-library` submodule to the new commit.
   2. Regenerate the application's lockfile and install:

      ```bash
      # copy ui-library's package-lock.json and add the workspace entries
      npm run sync-lock
      npm install
      ```

   3. Commit the `lib/ui-library` submodule pointer and `package-lock.json` together.

Never run `npm install <package>` in an application's root folder. It would add the dependency to the application's `package.json` instead of ui-library's. To regenerate ui-library's `package-lock.json` from scratch, use npm 10.9 or newer. npm 10.8 (bundled with Node 20) crashes with `Cannot read properties of null (reading 'edgesOut')` on this dependency tree.

## Links

- [Latest storybook build](https://main--6555d3db80418bb1681b8b17.chromatic.com/)
- [Latest snapshots](https://www.chromatic.com/library?appId=6555d3db80418bb1681b8b17&branch=main) captured via Chromatic service for visual testing of our components and pages

## Issues

Please file any development issues or questions with the [pkp/pkp-lib](https://github.com/pkp/pkp-lib) repository.

## Thanks

<a href="https://www.chromatic.com/"><img src="https://user-images.githubusercontent.com/321738/84662277-e3db4f80-af1b-11ea-88f5-91d67a5e59f6.png" width="153" height="30" alt="Chromatic" /></a>

Thanks to [Chromatic](https://www.chromatic.com/) for providing the visual testing platform that helps us review UI changes and catch visual regressions.
