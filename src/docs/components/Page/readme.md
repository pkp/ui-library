## Props

This is a root component. Pass data to the component using state (see below).

## Data

| Key | Description |
| --- | --- |
| `breadcrumbs` | An array of objects defining a breadcrumb to display above main page content. |
| `components` | A key/value object with component data to manage. See [Managing Components](#/component/Page#managing-components) |
| `menu` | An array items for the main navigation menu |
| `notifications` | An array of toast-style notifications to display. Default: `[]`. See [Notify](/utilities/Notify) |
| `notificationInterval` | Used internally to clear notifications. Do not set this manually. |
| `tasksUrl` | The URL to retrieve the tasks grid. |
| `unreadTasksCount` | The current number of unread tasks. |

## Events

This is a root component. It does not emit any events but may fire events on the global [event bus](/#/pages/event-bus).

## Usage

This component is a root component which is used to render a page of the editorial backend. It manages the layout architecture, including the main navigation menu, tasks and user navigation dropdown.

Nothing is needed to load the `Page` component. It is initialized automatically for every page in the editorial backend. Learn more about the [application's frontend](https://docs.pkp.sfu.ca/dev/documentation/en/frontend).

## State

The developer documentation includes guidance on [how to initialize state](https://docs.pkp.sfu.ca/dev/documentation/en/frontend-ui-library#state) in a `Page` component.

## Page Components

Several page components have been created to manage state for different pages of the application. They include:

- `AdminPage` is used on administration pages.
- `ImportExportPage` is used to support the select all functionality for the export tools.
- `SettingsPage` is used on settings pages.
- `StatsEditorialPage` is used on the editorial stats page. See [preview](#/component/StatsPage).
- `StatsPublicationsPage` is used on the publication stats page. See [preview](#/component/StatsPage/publication-stats).
- `WorkflowPage` is used on the submission workflow page. See [preview](#/component/WorkflowPage).

