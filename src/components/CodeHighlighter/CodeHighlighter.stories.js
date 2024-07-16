import CodeHighlighter from './CodeHighlighter.vue';

export default {
	title: 'Components/CodeHighlighter',
	component: CodeHighlighter,
	render: (args) => ({
		components: {CodeHighlighter},
		setup() {
			return {args};
		},
		template: '<CodeHighlighter :code=args.code :language=args.language />',
	}),
};

const sampleXML = `<?xml version="1.0" encoding="UTF-8"?>
<article>
<title>Open Access in Research</title>
<author>
    <name>Jane Doe</name>
    <affiliation>University of Knowledge</affiliation>
</author>
<journal>
    <name>Journal of Open Science</name>
    <year>2023</year>
</journal>
<doi>10.1234/jos.2023.001</doi>
<license type="CC-BY">https://creativecommons.org/licenses/by/4.0/</license>
<abstract>
    This paper explores the significance of open access in scientific research.
</abstract>
</article>`;

export const XML = {
	args: {
		code: sampleXML,
		language: 'xml',
	},
};
