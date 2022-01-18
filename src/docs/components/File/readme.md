## Props

| Key | Description |
| --- | --- |
| `documentType` | Optional but recommended. Pass one of the `DOCUMENT_TYPE_` constants to show an icon that will match this document type. |
| `id` | Optional. Show an ID with this file. See usage guidance below. |
| `name` | Required. The file's name. |

## Events

This component does not emit any events.

## Usage

Use this component to display a file in a consistent format across all components.

Show the `id` when it may be useful. For example, show it to editors when promoting files, because they may track the file ids in a separate system. But the `id` is not needed when an author makes a new submission, because the file ids won't yet have been used to track files or discuss them.