
Use this component to display a form. The parent component should respond to the following events:

```html
<pkp-form
	v-bind="formData"
	@set-fields="setFormFields"
	@set-errors="setFormErrors"
	@set-visible-locales="setFormVisibleLocales"
/>
```

In the example above, `formData` will typically be an object compiled from one of the `FormComponent` classes on the server-side.

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

See the [API Documentation](https://docs.pkp.sfu.ca/dev/api/ojs/dev) for the specification of errors.

## Groups and Group Descriptions

Fields can be organized into groups and given a group title and description. This should be done when fields benefit from the breakdown and when sufficient horizontal space is available.

If a form does not occupy the full workspace (~992px) because it is embedded in a tab or modal, avoid group titles and descriptions to ensure adequate space remains for the form fields.

## Conditional Display

Fields can be shown or hidden based on the value of another field. The `showWhen` prop is used to control conditional display. This prop is documented in the [FieldBase](#/component/Form/fields/FieldBase) example.
