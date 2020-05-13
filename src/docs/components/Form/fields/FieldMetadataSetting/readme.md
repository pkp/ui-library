## Props

| Key | Description |
| --- | --- |
| `...` | Supports all props in [FieldBase](#/component/Form/fields/FieldBase). |
| `value` | The current value for this field. |
| `disabledValue` | The value which matches a disabled state. Usually the `METADATA_DISABLE` constant. |
| `enabledOnlyValue` | The value which matches an enabled state, but not when it is requested or required during submission. Usually the `METADATA_ENABLE` constant. |
| `submissionOptions` | Options for when the metadata should be requested or required. Usually includes the `METADATA_ENABLE`, `METADATA_REQUEST` and `METADATA_REQUIRE` constants. |

## Events

See [FieldBase](#/component/Form/fields/FieldBase).

## Usage

This component is a special field for enabling and configuring metadata. It's use is not recommended for other purposes.
