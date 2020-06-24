## Props

| Key | Description |
| --- | --- |
| `...` | Supports all props in [FieldBase](#/component/Form/fields/FieldBase). |
| `...` | Supports all props in [FieldBaseAutosuggest](#/component/Form/fields/FieldBaseAutosuggest). |
| `apiUrl` | This inherited property from [FieldBaseAutosuggest](#/component/Form/fields/FieldBaseAutosuggest) should not be used. |
| `options` | An array of options to suggest. |

## Events

See [FieldBase](#/component/Form/fields/FieldBase).

## Usage

This is an implementation of [FieldBaseAutosuggest](#/component/Form/fields/FieldBaseAutosuggest) that does not require a request to an API endpoint. Instead, the list of options are passed in as a prop.

```html
<field-autosuggest-preset
	...
	:options="[
		{
			value: 1,
			label: "Articles"
		},
		{
			value: 2,
			label: "Reviews"
		},
	]">
```

Use this component when there is a limited number of possible suggestions and a simple match with the `label` and `value` are sufficient.