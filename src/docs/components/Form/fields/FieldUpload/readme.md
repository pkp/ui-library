
Use this component when you want the user to upload a file. If you want them to upload an image, use the [FieldUploadImage](#/component/Form/fields/FieldUploadImage) component instead.

### Valid Upload URL

You _must_ pass a `url` with the `options` prop. In most cases, the URL should correspond to your application's [`/temporaryFiles` API endpoint](https://docs.pkp.sfu.ca/dev/api/ojs/dev).

If you do not use the `/temporaryFiles` endpoint, your custom URL should respond to `OPTIONS` and `POST` requests that [Dropzone.js](https://www.dropzonejs.com) makes to upload the file. The response should match that documented in the [`/temporaryFiles` API endpoint](https://docs.pkp.sfu.ca/dev/api/ojs/dev).
