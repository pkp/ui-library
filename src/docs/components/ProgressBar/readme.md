## Props

| Key | Description |
| --- | --- |
| `max` | Value when progress is complete. Default: `100`. |
| `min` | Value when no progress has been made. Default: `0`. |
| `value` | The current value. Required. |

## Events

This component does not emit any events.

## Usage

Use the `ProgressBar` component to track the progress of file uploads or other tasks which are not completed in a single request.

Do not use a `ProgressBar` for long-running tasks when you will not be able to update the progress until the task is complete. Use the [Spinner](#/component/Spinner) instead.
