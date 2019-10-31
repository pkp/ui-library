
Use this component to provide the user with a rich text input area that supports bold, italics, links and other HTML code.

This component uses the TinyMCE editor. You can pass `toolbar`, `plugins` and `init` props to customize the editor. See the [TinyMCE documentation](https://www.tiny.cloud/docs/configure/integration-and-setup/).

The `size` of the input area will signal to the user how much information they should enter into the field.

The default `size` is best for one to two large paragraphs. If you expect a user to enter more than that, consider using the large size when it fits appropriately within the the form where it appears.

## Image Uploads

The editor will support image uploads, which are placed in the user's directory in the `public` files directory. You must provide the URL to the public files API and add the plugin and toolbar button.

```js
{
	...
	uploadUrl: 'http://journal.com/api/v1/_uploadPublicFile',
	toolbar: 'bold italic | link | image',
	plugins: 'paste,link,image'
}
```

The image upload will _not_ work in this documented example. It requires a valid upload URL. Use the following to get the `uploadUrl` from within a PKP application:

```php
$dispatcher = Application::get()
	->getRequest()
	->getDispatcher();

$uploadUrl = $dispatcher->url(
	Application::get()->getRequest(),
	ROUTE_API,
	$context->getPath(),
	'_uploadPublicFile/'
);
```

Users must be logged in to upload files.

## Prepared Content

The `preparedContent` prop allows you to pass content to the editor and give the user a point-and-click tool to add that content. This is intended to be used in cases where data can be rendered inside of an email template.

When an editor is assigning a reviewer, the reviewer's name and the due date can be passed to the editor so that the editor can inject this information directly into the email.

In such cases, the `renderPreparedContent` prop should be set to `true`. This will render the reviewer's name and due date directly into the content as the editor is writing the email.

However, when editing email templates, we must preserve the placeholders. In such cases, the `renderPreparedContent` prop should be set to `false`. Instead of adding the reviewer's name, a placeholder will be inserted that says `[Reviewer Name]`.

The [Prepared Content](#/component/Form/fields/FieldRichTextarea/ExamplePreparedContent) example shows the placeholders that are used when `renderPreparedContent` is `false`.
