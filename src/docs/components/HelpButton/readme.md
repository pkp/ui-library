## Props

| Key | Description |
| --- | --- |
| `topic` | Which topic to open in the help panel. This will correspond with one of the `.md` files used in the help panel. Do not include the `.md` extension. |
| `section` | Open the help panel to a particular section of the topic. This must match one of the named anchors in the topic page, such as `<a name="workflow-library"></a>`. |
| `label` | A localized label for screen readers. In English this should be "Help". |

## Events

This component does not emit any events.

## Usage

Use this component to display an icon that will open the help panel when clicked.

## Recommendations

Use the help panel when **instructions** for completing actions require further information, such as a description of when one choice should be made over another. This will commonly occur with form fields or other controls where limited space is available.

Use the help panel when you want to provide **recommendations** or **guidance** to the user. This is appropriate for non-required information, such as how to choose a good reviewer, or general usage guidance, such as what steps should be taken on a given workflow stage.

Do _not_ use the help panel for **critical information** that the user needs to complete a required task. The majority of users will not open the help panel, so you should not rely on them reading the information to complete a task.
