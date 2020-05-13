## Props

| Key | Description |
| --- | --- |
| `...` | Supports all props in [FieldBase](#/component/Form/fields/FieldBase). |
| `apiUrl` | A URL where suggestions can be retrieved. Suggestions are expected to be returned in a flat array. |
| `deselectLabel` | A text label for the button to remove a selection. This must be included to be compatible with assistive technology. |
| `getParams` | Any query params that should be applied when getting suggestions from the API. |
| `initialPosition` | Whether selected entries should appear `inline` or `below` the input field when this field is created. Default is `inline`. The position will change automatically when the width of selected values is too large for the input field. |
| `selected` | The currently selected options for this field. These should be objects with `value` and `label` keys. |
| `selectedLabel` | A text label that proceeds the selected values. This must be included to be compatible with assistive technology. |

## Events

See [FieldBase](#/component/Form/fields/FieldBase).

## Usage

This is a base component and should not be used directly. Instead, create a new component that extends `FieldBaseAutosuggest` to create an autosuggest field.

Every component that extends `FieldBaseAutosuggest` must provide a `setSuggestions` method which will convert the API response to a suggestion.

```js
import FieldBaseAutosuggest from './FieldBaseAutosuggest.vue';

export default {
	extends: FieldBaseAutosuggest,
	methods: {
		setSuggestions(newItems) {
			this.suggestions = newItems.map(item => {
				return {
					value: item.id,
					label: item.title
				};
			})
		}
	}
}
```

The `value` is submitted with the form.

## Implementations

The following autosuggest fields are available to be used.

- `FieldControlledVocab` can be used to enter metadata such as keywords and subjects.
- `FieldSelectSubmissions` can be used to find and select submissions.