import fieldBase from '../FieldBase/config';
import fieldHtml from '../../helpers/field-html-lorem';

export let props = {
	...fieldBase.props,
	...fieldHtml,
	helpTopic: '',
	tooltip: ''
};

export const propDocs = [
	{
		key: '...',
		description:
			'Supports all props in [FieldBase](#/component/Form/fields/FieldBase).'
	}
];

export const emitDocs = [];

export default {
	props,
	propDocs,
	emitDocs
};
