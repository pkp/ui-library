
## Props

| Key | Description |
| --- | --- |
| `description` | An optional description of this `ListPanel`.  |
| `emptyLabel` | An optional message to show when no items exist. Default: `No items found.` |
| `expanded` | An array of item ids that are currently in expanded view. |
| `headingLevel` | The HTML tag to use for the title. Default: `h2` |
| `isSidebarVisible` | Whether or not the sidebar is visible.  |
| `items` | Array containing items in the list. |
| `title` | The title to display for this `ListPanel`. |

## Events

This component does not emit any events.

## Usage

Use this component to display anything from simple lists to complex management panels.

A `ListPanel` will often interact with the REST API to get, search, filter and paginate items in the list. Use the [Fetch](#/pages/fetch) mixin to provide these features.
