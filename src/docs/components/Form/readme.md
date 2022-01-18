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
| `notify` | When an error is encountered during form submission. |


## Usage

Use this component to display a form.

## Pass props

Typically you will generate all the required props from one of the `FormComponent` classes on the server side. These props can then be passed to the form.

```html
<pkp-form
	v-bind="formData"
	@set="set"
/>
```

## Multi-page Forms

Use a multi-page form when you want to guide the user through a multi-step process that ends in a single action. Reviewer assignment is an example of a multi-step process:

1. Select a reviewer
2. Select a review type and enter a deadline
3. Prepare the notification email

We want to divide the action into smaller steps so that we don't overwhelm the user, but we shouldn't take any action until all steps are complete.

Do _not_ use a multi-page form for all related forms, such as those on the settings page. A user may wish to only edit one setting and that change can be saved immediately without depending on further action in related forms.

If you want to indicate that forms are related, without requiring them to be submitted together, use [tabs](#/component/Tab).

## Form Submission and Error Handling

A `Form` expects to receive a URL to which it can submit a `PUT` or `POST` request to the application's API. Forms can handle the following responses from the API automatically:

- A `200` response when successful with a JSON object describing the entity that was added or edited.
- A `403` or `404` response when the server refuses the submission with a JSON object describing the error.
- A `400` response when a validation error occurs with one of the fields. In this case, a JSON object will be returned with each invalid field as a key and an array of errors for that field.

See the [API Documentation](https://docs.pkp.sfu.ca/dev/api) for the specification of errors.

## Groups and Group Descriptions

Fields can be organized into groups and given a group title and description. This should be done when fields benefit from the breakdown and when sufficient horizontal space is available.

If a form does not occupy the full workspace (~992px) because it is embedded in a tab or modal, avoid group titles and descriptions to ensure adequate space remains for the form fields.

## Conditional Display

Fields can be shown or hidden based on the value of another field. The `showWhen` prop is used to control conditional display. This prop is documented in the [FieldBase](#/component/Form/fields/FieldBase) example.
