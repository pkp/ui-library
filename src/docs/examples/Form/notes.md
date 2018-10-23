
Use this component to display a form.

## <a name="usage"></a> Usage Guide

The parent component should respond to the following events:

```
<pkp-form
	v-bind="formData"
	@set-fields="setFormFields"
	@set-errors="setFormErrors"
	@set-visible-locales="setFormVisibleLocales"
/>
```

In the example above, `formData` will typically be an object compiled from one of the `FormComponent` classes on the server-side.

## <a name="pages"></a> Multi-page Forms

Use a multi-page form when you want to guide the user through a multi-step process that ends in a single action. Reviewer assignment is an example of a multi-step process:

1. Select a reviewer
2. Select a review type and enter a deadline
3. Prepare the notification email

We want to divide the action into smaller steps so that we don't overwhelm the user, but we shouldn't take any action until all steps are complete.

This is distinguished from multiple, related forms, such as those on the settings page. A user may wish to only edit one setting and that change can be saved immediately without depending on further action in related forms.

In such cases, you should _not_ use a multi-page form. If you want to indicate that forms are related, use tabs.

## <a name="api"></a> Form Submission and Error Handling

Forms should be passed a URL to which they can submit a `PUT` or `POST` request to the application's API. They expect to receive common responses from the API, which will be one of the following:

- A `200` response when successful with a JSON object describing the entity that was added or edited.
- A `403` or `404` response when the server refuses the submission with a JSON object describing the error.
- A `400` response when a validation error occurs with one of the fields. In this case, a JSON object will be returned with each invalid field as a key and an array of errors for that field.

See the [API Documentation](https://docs.pkp.sfu.ca/dev/api/ojs/dev) for the specification of errors.

## <a name="groups"></a> Groups and Group Descriptions

Fields can be organized into groups and given a group title and description. This should be done when fields benefit from the breakdown and when sufficient horizontal space is available.

If a form does not occupy the full workspace (~992px) because it is embedded in a tab or modal, avoid group titles and descriptions to ensure adequate space remains for the form fields.
