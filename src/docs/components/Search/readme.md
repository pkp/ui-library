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
