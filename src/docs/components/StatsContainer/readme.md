
The `StatsContainer` extends the [`Container`](/#/pages/container) app. Use this app to show a page of statistics with a chart and a table.

## Template

The `StatsContainer` app is a template-less component. You must write the template in Smarty on the server-side and it will be compiled at run time.

The examples here provide sample templates for two use-cases.

## Containers

The following containers extend the `StatsContainer`:

- `StatsPublicationContainer` provides the publication usage stats.
- `StatsEditorialContainer` provides stats on editorial activity.

Although they share the same base, they have a few different `data` properties and methods. See the source code to understand how they differ from the `StatsContainer`.

The example here provides a sample template, similar to the article statistics page.
