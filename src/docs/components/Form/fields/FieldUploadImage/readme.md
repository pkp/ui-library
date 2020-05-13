## Props

| Key | Description |
| --- | --- |
| `...` | Supports all props in [FieldBase](#/component/Form/fields/FieldBase). |
| `value` | The current value for this field. |
| `options` | Pass [options](https://www.dropzonejs.com/#configuration-options) to Dropzone.js. |
| `baseUrl` | The `baseUrl` is prepended to the filename to display previews. For example, the `baseURL` for the logo of a journal with an ID of `2` would be `http://yoursite.com/public/journals/2/`. |

## Events

See [FieldBase](#/component/Form/fields/FieldBase).

## Usage

Use this component when you want the user to upload an image. If you want to allow them to upload any file, use the [FieldUpload](#/component/Form/fields/FieldUpload) component instead.

See the [FieldUpload](#/component/Form/fields/FieldUpload) component for guidance on passing an upload URL.
