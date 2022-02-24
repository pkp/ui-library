## Props

| Key | Description |
| --- | --- |
| `...` | Supports all props in [FieldBase](#/component/Form/fields/FieldBase). |
| `apiUrl` | A URL where suggestions can be retrieved. Suggestions are expected to be returned in a flat array. |
| `deselectLabel` | A text label for the button to remove a selection. This must be included to be compatible with assistive technology. |
| `isDisabled` | Whether the input field should be disabled. Default: `false` |
| `isLabelInline` | When `true`, the label for this field will be shown inline instead of above the input field. See usage guidance below. |
| `getParams` | Any query params that should be applied when getting suggestions from the API. |
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

## Inline Labels

Do not use `isLabelInline` unless a designer has recommended this approach. A form that uses inline labels should be designed specifically to support them.

## Implementations

The following autosuggest fields are available to be used.

- `FieldAutosuggestPreset` can be used to when the options can be preset instead of requiring a request to the REST API.
- `FieldControlledVocab` can be used to enter metadata such as keywords and subjects.
- `FieldSelectSubmissions` can be used to find and select submissions.