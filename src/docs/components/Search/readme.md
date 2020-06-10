## Props

| Key | Description |
| --- | --- |
| `searchLabel` | An optional label for the search field. Default: `Search` |
| `searchPhrase` | The current search phrase. |

## Events

| Key | Description |
| --- | --- |
| `search-phrase-changed` | This event will be emitted when the search phrase changes. The event is debounced so that it will only be emitted when the user stops typing for 250ms. |

## Usage

Use the `Search` component whenever the user will search for what they want.

If you ever need search functionality but can not use this component, care should be taken to ensure that you reproduce the same UX as this component. That includes focus styles, keyboard interaction, the clear search phrase button, and the same debounce time interval when initializing the search.