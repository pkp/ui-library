## Props

| Key | Description |
| --- | --- |
| `...` | Supports all props in [FieldBase](#/component/Form/fields/FieldBase). |
| `...` | Supports all props in [FieldOptions](#/component/Form/fields/FieldOptions). |
| `options` | A list of the options as described in [FieldOptions](#/component/Form/fields/FieldOptions), with additional support for an input field. See [Custom Input](#custom-input) |

## Events

See [FieldBase](#/component/Form/fields/FieldBase).

## Usage

Use this component for selecting one option from a list of known responses, while allowing the user to enter their own response.

This component extends [`FieldOptions`](#/component/Form/fields/FieldOptions), but it does not support checkboxes, ordering or usage as a confirmation field.

## Custom input

When creating an option with a custom input field, pass the `isInput` key instead of the `value` key.


```js
[
	{
		value: 1,
		label: "One"
	},
	{
		value: 2,
		label: "Two"
	},
	{
		isInput: true
	}
]
