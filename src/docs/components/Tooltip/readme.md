## Props

| Key | Description |
| --- | --- |
| `tooltip` | The message to display in the popup. |
| `label` | A label for the button that screenreaders will use to understand it. This should refer to the thing it is describing. A tooltip for the submission subtitle field might say "Tooltip for subtitle". |

## Events

This component does not emit any events.

## Usage

Use this component to add short tips that appear above a button.

Use the tooltip when you want to provide short advice on how to complete a task. If the advice can not be fit in 25-30 words, consider using a [HelpButton](#/component/HelpButton) instead.

Do _not_ use the tooltip for information that the user requires to complete a task. Most users will not interact with the tooltip, so you should not rely on them reading the information.
