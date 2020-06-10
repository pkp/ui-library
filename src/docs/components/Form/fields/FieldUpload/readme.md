## Props

| Key | Description |
| --- | --- |
| `...` | Supports all props in [FieldBase](#/component/Form/fields/FieldBase). |
| `value` | The current value for this field. |
| `options` | Pass [options](https://www.dropzonejs.com/#configuration-options) to Dropzone.js. |

## Events

See [FieldBase](#/component/Form/fields/FieldBase).

## Usage

Use this component when you want the user to upload a file. If you want them to upload an image, use the [FieldUploadImage](#/component/Form/fields/FieldUploadImage) component instead.

### Valid Upload URL

You _must_ pass a `url` with the `options` prop. In most cases, the URL should correspond to your application's [API endpoint for temporary files](https://docs.pkp.sfu.ca/dev/api).

If you do not use this endpoint, your endpoint should respond to `OPTIONS` and `POST` requests that [Dropzone.js](https://www.dropzonejs.com) makes to upload the file. The response should match that documented in the [API endpoint for temporary files](https://docs.pkp.sfu.ca/dev/api).