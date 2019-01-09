import Orderer from '@/components/Orderer/Orderer.vue';
import ViewOrderer from './ViewOrderer.vue';
import IsDraggable from './IsDraggable.vue';
import IsDraggableRaw from '!!raw-loader!./IsDraggable.vue';

export default {
	viewComponent: ViewOrderer,
	baseComponent: Orderer,
	propDescription: {
		itemId: 'A unique ID for the item that this control applies to.',
		itemTitle: 'The title of the item that this control applies to, so that accessible labels can be provided for the control.',
		isDraggable: 'Should drag-and-drop icons be shown? Default: true.',
	},
	examples: {
		'is-draggable': {
			label: 'with Drag-and-Drop',
			component: IsDraggable,
			componentRaw: IsDraggableRaw,
		},
	},
};
