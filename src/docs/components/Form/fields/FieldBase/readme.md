## Props

| Key | Description |
| --- | --- |
| `name` | The key for this field. Used in the `name` attribute of `<input>`, `<textarea>`, `<select>` and other fields. The form will submit the value for this field under this name, so it must match an accepted value of the API endpoint. |
| `component` | Used internally to load the appropriate component. For example, to load the `FieldText` component this should be `field-text`. |
| `label` | The `<label>` for this field. May be used in a `<fieldset>` when appropriate. All form fields should have an accessible label. |
| `description` | Adds a description to the field. Can include HTML code. |
| `tooltip` | Adds a tooltip to the field. Can include HTML code. |
| `helpTopic` | Adds a button to the field which will open the in-app help panel to this topic. |
| `helpSection` | When the in-app help panel is opened to `helpTopic`, it will scroll to `helpSection` if included. |
| `groupId` | The ID of the group this field should appear in. |
| `formId` | The ID of the form this field should appear in. This is passed down from the `Form`. |
| `isRequired` | Whether or not a value for this field should be required. |
| `isMultilingual` | Whether or not this field should be presented for each supported language. |
| `localeKey` | If the field `isMultilingual`, this will be set to the locale key of this particular instance. This is passed down from the `Form`. |
| `primaryLocale` | The primary locale for this form. This is passed down from the `Form`. |
| `locales` | The locales supported by this form. This is passed down from the `Form`. |
| `showWhen` | The `name` of another field which should have a truthy value before this field is shown. You can also pass an array to require a specific value. For example, `['primaryLocale', 'en_US']` would hide this field unless the `primaryLocale` field had a value of `en_US`. |
| `value` | The current value. |
| `allErrors` | An object containing all errors in the form. This is passed down from the `Form`. |

## Events

| Key | Description |
| --- | --- |
| `change` | Emitted when the value of the field changes. Payload: `(name, property, value, [localeKey])`. The `localeKey` will be null for fields that are not multilingual. This event is fired every time the value changes, so you should [debounce](https://www.npmjs.com/package/debounce) event callbacks that contain resource-intensive code.

## Usage

This is a base component for all `Field*` components. The props described above are available for all `Field*` components.

This component should *not* be used directly. It is presented for demonstration purposes only. Use one of the other form field components.
