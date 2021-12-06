## Props

| Key | Description |
| --- | --- |
| `...` | Supports all props in [Fetch](#/pages/fetch). |
| `...` | Supports all props in [FieldBase](#/component/Form/fields/FieldBase). |
| `...` | Supports all props in [FieldBaseAutosuggest](#/component/Form/fields/FieldBaseAutosuggest). |
| `dataMapper` | An optional function which will receive each item from the API response and should map them to a `new Option(label, value)` or an object `{label: "label", value: "value"}` |

## Events

See [FieldBase](#/component/Form/fields/FieldBase).

## Usage

This is an implementation of [FieldBaseAutosuggest](#/component/Form/fields/FieldBaseAutosuggest) that might display a pagination if there are too many results and also has a function to map the response.

```html
<field-paged-autosuggest
	...
>
```
