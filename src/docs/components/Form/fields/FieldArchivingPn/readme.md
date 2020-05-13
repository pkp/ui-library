## Props

| Key | Description |
| --- | --- |
| `...` | Supports all props in [FieldBase](#/component/Form/fields/FieldBase). |
| `value` | The current value for this field. |
| `terms` | An HTML string with a `<button>` that can be used to open the preservation plugin's settings modal. **Note: the modal will not open in this demonstration.** |
| `enablePluginUrl` | A URL to send a request to the plugin grid handler to enable this plugin. |
| `disablePluginUrl` | A URL to send a request to the plugin grid handler to disable this plugin. |
| `settingsUrl` | A URL to send a request to the plugin grid handler to display the settings for this plugin. **Note: the modal will not open in this demonstration.** |

## Events

See [FieldBase](#/component/Form/fields/FieldBase).

## Usage

This component is a special field for the [PKP Preservation Network](https://pkp.sfu.ca/pkp-pn/) settings. It displays a button to open the plugin settings in a modal when the PKP PN plugin is enabled.

The modal will _not_ open in the demonstration above.
