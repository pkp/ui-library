## Props

| Key | Description |
| --- | --- |
| `apiUrl` | The URL to upload files to. |
| `filenameLocale` | An optional locale key use for the filename. See "Localized Filenames" below. Default: `''` |
| `files` | An array of uploaded files. |
| `id` | A unique id for the uploader. |
| `options` | Optional [Dropzone.js](https://docs.dropzone.dev/configuration/basics/configuration-options) configuration. |
| `queryParams` | Any query params that should be used in the file upload request. Default: `{}` |
| `uploadProgressLabel` | A localized string with the upload progress label, such as "Uploading {$percent}% complete". |

## Events

| Key | Description |
| --- | --- |
| `updated:files` | Emitted when the files have changed. Payload: `(files)` |

## Usage

The `<FileUploader>` component is a wrapper around [vue2-dropzone](https://www.npmjs.com/package/vue2-dropzone). Use this component to allow a user to upload a file. `<FileUploader>` is an "invisible" component. It handles the file uploading under-the-hood, but does not provide the UI that shows file progress or lists the uploaded files.

When using `<FileUploader>`, the drag-and-drop target area will expand to fill it's parent component. In the following example, the drag-and-drop target area will be a 300x300 pixels area.

```html
<div style="width: 300px; height: 300px;">
    <file-uploader
        ...
    />
</div>
```

Use [FileUploadProgress](#/component/FileUploadProgress) to show the progress of files being uploaded.

```html
<div>
    <file-upload-progress
        v-for="(file, i) in files"
        :key="i"
        cancelUploadLabel="Cancel Upload"
        :errors="file.errors"
        :name="file.name"
        :progress="file.progress"
        @cancel="remove(i)"
    />
    <file-uploader
        :files="files"
        ...
    />
</div>
```

Always provide a button to open the file browser for users who can't use the drag-and-drop area. Use a `ref` to access methods on `<FileUploader>`.

```html
<template>
    <div>
        Drag and drop files here or
        <button @click="openFileBrowser">
            upload a file
        </button>
        <file-uploader
            ref="exampleUploader"
            ...
        />
    </div>
</template>

<script>
export default {
    methods: {
        openFileBrowser() {
            this
                .$refs
                .exampleUploader
                .openFileBrowser();
        }
    }
}
</script>
```

## Localized Filenames

When `<FileUploader>` makes the `POST` request to upload a file, it will send a `name` param that matches the filename.

```json
{
    "name": "the-uploaded-filename.ext"
}
```

If the name needs to be sent as [localized data](#/pages/localization), set the `filenameLocale` prop.

```html
<file-uploader
    filenameLocale="en"
    ...
/>
```

The request body will change to this.


```json
{
    "name": {
        "en": "the-uploaded-filename.ext"
    }
}
```
