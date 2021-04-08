## Props

| Key | Description |
| --- | --- |
| `...` | Supports some props in [FieldBase](#/component/Form/fields/FieldBase). |
| `value` | The current value for this field. |
| `optIntoAddLabel` | The label for the button to add new item. |
| `size` | One of `small`, `normal` or `large`. Default: `normal`. |
| `prefix` | An optional prefix to show before the user's input. For example, a prefix of `http://publisher.com/` is used for the journal `path` field. |

## Events

See [FieldBase](#/component/Form/fields/FieldBase).

## Usage

Use this component for entering a single line of text.

The `size` of the input area will signal to the user how much information they should enter into the field. Choose a size that is sufficient to display the expected input.

When using a `prefix`, be careful not to use a long prefix. There may not be enough room for the user to enter their information. If a prefix runs too long, it will be truncated so that the user can enter their information.
