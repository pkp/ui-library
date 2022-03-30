## Props

| Key | Description |
| --- | --- |
| `...` | Supports all props in [FieldRichTextarea](#/component/Form/fields/FieldRichTextarea). |
| `preparedContent` | An optional object containing preset information. When preset information exists, a button will appear in the toolbar. See the [Prepared Content](#/component/Form/fields/FieldPreparedContent) example. |

## Events

See [FieldRichTextarea](#/component/Form/fields/FieldRichTextarea).

## Usage

Use this component to provide the user with a rich text editor with prepared content that they can insert through a modal UI.

The `preparedContent` prop allows you to pass content to the editor and give the user a point-and-click tool to add that content. This is intended to be used in cases where data can be rendered inside of an email template.

When an editor is assigning a reviewer, the reviewer's name and the due date can be passed to the editor so that the editor can inject this information directly into the email.
