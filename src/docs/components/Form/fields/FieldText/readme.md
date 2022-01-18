## Props

| Key | Description |
| --- | --- |
| `...` | Supports all props in [FieldBase](#/component/Form/fields/FieldBase). |
| `value` | The current value for this field. |
| `inputType` |  The`type` attribute for the `<input>` field. See [available types](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#Form_%3Cinput%3E_types). Default: `text`. |
| `optIntoEdit` | Disables the field and adds a button that the user must click before they can edit it. Default: `false`. |
| `optIntoEditLabel` | The label for the button added by `optIntoEdit`. |
| `size` | One of `small`, `normal` or `large`. Default: `normal`. |
| `prefix` | An optional prefix to show before the user's input. For example, a prefix of `http://publisher.com/` is used for the journal `path` field. |
| `isLabelInline` | When `true`, the label for this field will be shown inline instead of above the input field. See usage guidance below. |

## Events

See [FieldBase](#/component/Form/fields/FieldBase).

## Usage

Use this component for entering a single line of text.

The `size` of the input area will signal to the user how much information they should enter into the field. Choose a size that is sufficient to display the expected input.

When using a `prefix`, be careful not to use a long prefix. There may not be enough room for the user to enter their information. If a prefix runs too long, it will be truncated so that the user can enter their information.

Do not use `isLabelInline` unless a designer has recommended this approach. Forms need to be designed carefully to support inline labels.
