import {ref, onMounted, onUnmounted} from 'vue';

/**
 * Composable for handling drag-and-drop events for file uploaders.
 *
 * Provides:
 * - isDragging: reactive boolean indicating if user is dragging files over the page
 * - drop: event handler to prevent default browser behavior and reset drag state
 * - resetDragState: manually reset drag state (useful for custom drop handlers)
 *
 * Automatically sets up document-level event listeners on mount and cleans up on unmount.
 *
 * @returns {Object} Drag and drop state and handlers
 */
export function useDropzoneDragDrop() {
	const dragEventCounter = ref(0);
	const isDragging = ref(false);

	/**
	 * Event handler when the user drags over an element
	 *
	 * The dragenter and dragleave events are fired on every element as the user
	 * drags across the screen. The counter tracks the enter/leave events across
	 * all elements. When the counter reaches 0 again, the user has dragged away
	 * from the viewport or dropped the files into a drop area.
	 *
	 * @see https://stackoverflow.com/questions/3144881/how-do-i-detect-a-html5-drag-event-entering-and-leaving-the-window-like-gmail-d#comment7748043_3144881
	 * @param {DragEvent} event
	 */
	function dragenter(event) {
		dragEventCounter.value++;
		isDragging.value = event.dataTransfer.types.includes('Files');
	}

	/**
	 * Event handler when the user drags away from an element
	 * @param {DragEvent} event
	 */
	function dragleave(event) {
		dragEventCounter.value--;
		isDragging.value = dragEventCounter.value > 0;
	}

	/**
	 * Event handler when the user "drops" in a drag-and-drop action
	 *
	 * Callback for `drop` and `dragover` events. Both events are needed to catch
	 * drops that happen outside the drop target and prevent the browser from redirecting.
	 *
	 * @see https://stackoverflow.com/questions/6756583/prevent-browser-from-loading-a-drag-and-dropped-file#comment51502784_6756680
	 * @param {DragEvent} event
	 */
	function drop(event) {
		event.preventDefault();
		if (event.type === 'drop') {
			resetDragState();
		}
	}

	/**
	 * Manually reset drag state (useful for custom drop handlers)
	 */
	function resetDragState() {
		isDragging.value = false;
		dragEventCounter.value = 0;
	}

	/**
	 * Set up drag and drop event listeners on the document
	 */
	function setupDragListeners() {
		document.addEventListener('dragenter', dragenter, true);
		document.addEventListener('dragleave', dragleave, true);
		document.addEventListener('dragover', drop, true);
		document.addEventListener('drop', drop);
	}

	/**
	 * Clean up drag and drop event listeners
	 */
	function cleanupDragListeners() {
		document.removeEventListener('dragenter', dragenter, true);
		document.removeEventListener('dragleave', dragleave, true);
		document.removeEventListener('dragover', drop, true);
		document.removeEventListener('drop', drop);
	}

	onMounted(() => {
		setupDragListeners();
	});

	onUnmounted(() => {
		cleanupDragListeners();
	});

	return {
		isDragging,
		drop,
		resetDragState,
	};
}
