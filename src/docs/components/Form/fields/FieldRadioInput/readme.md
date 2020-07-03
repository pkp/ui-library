## Props

| Key | Description |
| --- | --- |
| `...` | Supports all props in [FieldBase](#/component/Form/fields/FieldBase). |
| `value` | The current value for this field. |
| `isInput` | Should be set to `true` for a custom field. |

## Events

See [FieldBase](#/component/Form/fields/FieldBase).

## Usage

Use this component for selecting one option from a list of known responses, while allowing the user to enter their own response.

This component extends [`FieldOptions`](#/component/Form/fields/FieldOptions), but it does not support checkboxes, ordering or usage as a confirmation field.

## Custom input

When creating a field for a custom input, instead of `value` prop, `isInput` should be passed with a boolean value `true`.
