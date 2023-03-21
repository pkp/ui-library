## Props

| Key | Description |
| --- | --- |
| `action` | Where the form should be submitted. It should be a full URL (`http://...`) to the API endpoint where this form is handled. |
| `canSubmit` | A boolean indicating whether this form can be submitted. The save button will be disable if this is false. Default: `true`. |
| `errors` | Key/value object of messages. The key is the field `name` and the value is an array of errors. Errors are generated during form submission and handled automatically, so this prop can be omitted in most cicumstances. |
| `fields` | Array of form fields. This prop is typically configured on the server, using the `Form` and `Field` classes in the PHP application. |
| `groups` | Array of form groups. See "Groups and Group Descriptions" below. |
| `hiddenFields` | Key/value of hidden fields that should be submitted with the form. The key will be used as the field's `name` attribute. |
| `id` | Used by a parent component, such as `Container`, to identify events emitted from the form and update the form props when necessary. |
| `method` | The method to use when submitting the form. This should match the API endpoint that will handle the form. It can be `POST` (create) or `PUT` (edit). |
| `pages` | Array of form pages. See "Multi-page Forms" below. |
| `primaryLocale` | The primary locale for this form. This may be the primary locale of the journal/press, submission or site depending on the form. |
| `supportedFormLocales` | The locale(s) supported by this form. If a form has multilingual fields, it will display a separate input control for each of these locales. |
| `visibleLocales` | The locale(s) the form is currently being presented in. |

## Events

| Key | Description |
| --- | --- |
| `set` | When the form props need to be updated. The payload is an object with any keys that need to be modified. |
| `success` | When the form has been successfully submitted. The payload will include the server response from the successful form submission. This is usually the object that was added or edited. |

## Global Events

| Key | Description |
| --- | --- |
| `form-success` | When the form is successfully submitted. The payload will include the form ID and the server response from the successful form submission. This is usually the object that was added or edited. |
| `notify` | When an error is encountered during form submission. See [Notify](#/utilities/Notify). |


## Usage

Use this component to display a form. Typically you will generate all the required props from one of the `FormComponent` classes on the server side. These props can then be passed to the form.

```html
<pkp-form
	v-bind="formData"
	@set="set"
/>
```

Learn more about [server-side form components](https://docs.pkp.sfu.ca/dev/documentation/en/frontend-forms).

## Multi-page Forms

Multi-page forms have not proven to be useful. This feature may be removed in a future version. Use the [Steps](#/component/Steps) component for step-by-step workflows.

## Form Submission and Error Handling

The `action` prop of most `<Form>` components will be a URL to which it can submit a `PUT` or `POST` request to the application's REST API. Forms will handle the following responses from the API automatically.

- A `200` response when successful with a JSON object describing the entity that was added or edited.
- A `403` or `404` response when the server refuses the submission with a JSON object describing the error.
- A `400` response when a validation error occurs with a JSON object describing the validation errors. The `<Form>` component will map most REST API validation errors to the correct form field.

See the [API Documentation](https://docs.pkp.sfu.ca/dev/api) for the specification of errors.

## Groups and Group Descriptions

Fields can be organized into groups and given a group title and description. This should be done when fields benefit from the breakdown and when sufficient horizontal space is available.

If a form does not occupy the full workspace (~992px) because it is embedded in a tab or modal, avoid group titles and descriptions to ensure adequate space remains for the form fields.

## Conditional Display

Fields can be shown or hidden based on the value of another field. The `showWhen` prop is used to control conditional display. This prop is documented in the [FieldBase](#/component/Form/fields/FieldBase) example.
