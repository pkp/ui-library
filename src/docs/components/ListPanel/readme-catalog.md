
## Props

| Key | Description |
| --- | --- |
| `addEntryForm` | The [Form](#/component/Form) to add an entry to the catalog. |
| `catalogSortBy` | One of the `ORDER_BY_*` constants. Default: `ORDERBY_DATE_PUBLISHED` |
| `catalogSortDir` | One of the `SORT_DIRECTION_*` constants. Default: `SORT_DIRECTION_ASC` |
| `contextId` | The id of the press. |
| `filters` | The [Filter](#/component/Filter)s to change the list view. |
| `id` | A unique id for this component. |
| `items` | An array of publishable submissions. |
| `itemsMax` | A count of all publishable submissions in the press. |
| `title` | The title of the list panel. |

## Events

| Key | Description |
| --- | --- |
| `set` | Emitted when a prop should be changed. Payload: `(id, newProps)` |

## Mixins

| Name | Description |
| --- | --- |
| `ajaxError` | Display unexpected errors in a [Dialog](#/mixins/dialog). |
| [fetch](#/mixins/fetch) | Get catalog entries from the REST API. |

## Usage

Use this component to manage the book catalog in OMP.