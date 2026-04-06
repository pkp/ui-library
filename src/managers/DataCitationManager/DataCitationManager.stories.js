import DataCitationManager from './DataCitationManager.vue';
import {getSubmissionMock} from '@/mockFactories/submissionMock';
import {getPublicationMock} from '@/mockFactories/publicationMock';

export default {
	title: 'Managers/DataCitationManager',
	component: DataCitationManager,
	render: (args) => ({
		components: {DataCitationManager},
		setup() {
			return {args};
		},
		template: `<DataCitationManager v-bind="args"/>`,
	}),
};

export const Base = {
	args: {
		submission: getSubmissionMock(),
		publication: getPublicationMock({
			dataCitations: [
				{
					id: 285,
					publicationId: 20,
					seq: 1,
					title:
						'Open science practices and transparency indicators in scholarly journals',
					identifierType: 'doi',
					identifier: 'https://doi.org/10.5281/zenodo.12345678',
					relationshipType: 'analyzed',
					repository: 'Zenodo',
					year: '2022',
					authors: [
						{
							givenName: 'Emily',
							familyName: 'Carter',
							orcid: 'https://orcid.org/0000-0002-1234-5678',
						},
						{
							givenName: 'Daniel',
							familyName: 'Thompson',
							orcid: 'https://orcid.org/0000-0003-2345-6789',
						},
					],
					url: null,
				},
				{
					id: 286,
					publicationId: 20,
					seq: 2,
					title:
						'Adoption of open science policies in publicly funded research organisations',
					identifierType: 'doi',
					identifier: 'https://doi.org/10.6084/m9.figshare.87654321',
					relationshipType: 'analyzed',
					repository: 'Figshare',
					year: '2023',
					authors: [
						{
							givenName: 'Laura',
							familyName: 'Mitchell',
							orcid: 'https://orcid.org/0000-0001-3456-7890',
						},
						{
							givenName: 'Andrew',
							familyName: 'Wilson',
							orcid: 'https://orcid.org/0000-0002-4567-8901',
						},
					],
					url: null,
				},
			],
		}),
		dataCitationEditForm: {
			id: 'data_citation',
			method: 'POST',
			action: 'emit',
			fields: [
				{
					name: 'title',
					component: 'field-text',
					label: 'Title',
					description: '',
					groupId: 'default',
					isRequired: true,
					isMultilingual: false,
					isInert: false,
					value: null,
					inputType: 'text',
					optIntoEdit: false,
					optIntoEditLabel: '',
					size: 'normal',
					prefix: '',
				},
				{
					name: 'identifierType',
					component: 'field-select',
					label: 'Identifier Type',
					groupId: 'default',
					isRequired: false,
					isMultilingual: false,
					description: '',
					value: null,
					inputType: 'text',
					optIntoEdit: false,
					optIntoEditLabel: '',
					options: [
						{
							value: 'DOI',
							label: 'DOI',
						},
						{
							value: 'Accession',
							label: 'Accession',
						},
						{
							value: 'PURL',
							label: 'PURL',
						},
						{
							value: 'ARK',
							label: 'ARK',
						},
						{
							value: 'URI',
							label: 'URI',
						},
						{
							value: 'ARXIV',
							label: 'ARXIV',
						},
						{
							value: 'ECLI',
							label: 'ECLI',
						},
						{
							value: 'Handle',
							label: 'Handle',
						},
						{
							value: 'ISSN',
							label: 'ISSN',
						},
						{
							value: 'ISBN',
							label: 'ISBN',
						},
						{
							value: 'PMID',
							label: 'PMID',
						},
						{
							value: 'PMCID',
							label: 'PMCID',
						},
						{
							value: 'UUID',
							label: 'UUID',
						},
					],
					size: 'normal',
					prefix: '',
				},
				{
					name: 'identifier',
					component: 'field-text',
					label: 'Identifier',
					description: '',
					groupId: 'default',
					isRequired: false,
					isMultilingual: false,
					isInert: false,
					value: null,
					inputType: 'text',
					optIntoEdit: false,
					optIntoEditLabel: '',
					size: 'normal',
					prefix: '',
				},
				{
					name: 'relationshipType',
					component: 'field-select',
					label: 'Relationship Type',
					groupId: 'default',
					isRequired: false,
					isMultilingual: false,
					description: '',
					value: null,
					inputType: 'text',
					optIntoEdit: false,
					optIntoEditLabel: '',
					options: [
						{
							value: 'supporting',
							label:
								'Supporting data without specifying whether they were generated or analyzed (supporting).',
						},
						{
							value: 'generated',
							label:
								'Supporting data that were generated for the study (generated).',
						},
						{
							value: 'non-analyzed',
							label:
								'Referenced data that were neither generated nor analyzed for the study (non-analyzed).',
						},
						{
							value: 'analyzed',
							label:
								'Supporting data that were analyzed but not generated for the study (analyzed).',
						},
					],
					size: 'normal',
					prefix: '',
				},
				{
					name: 'repository',
					component: 'field-text',
					label: 'Repository',
					description: '',
					groupId: 'default',
					isRequired: false,
					isMultilingual: false,
					isInert: false,
					value: null,
					inputType: 'text',
					optIntoEdit: false,
					optIntoEditLabel: '',
					size: 'normal',
					prefix: '',
				},
				{
					name: 'year',
					component: 'field-text',
					label: 'Year',
					description: '',
					groupId: 'default',
					isRequired: false,
					isMultilingual: false,
					isInert: false,
					value: null,
					inputType: 'text',
					optIntoEdit: false,
					optIntoEditLabel: '',
					size: 'normal',
					prefix: '',
				},
				{
					name: 'authors',
					component: 'field-authors',
					label: 'Creators',
					description: '',
					groupId: 'default',
					isRequired: false,
					isMultilingual: false,
					isInert: false,
					value: [],
					addButtonLabel: 'Add Creator',
				},
				{
					name: 'url',
					component: 'field-text',
					label: 'URL',
					description: '',
					groupId: 'default',
					isRequired: false,
					isMultilingual: false,
					isInert: false,
					value: null,
					inputType: 'text',
					optIntoEdit: false,
					optIntoEditLabel: '',
					size: 'normal',
					prefix: '',
				},
			],
			groups: [{id: 'default', pageId: 'default'}],
			hiddenFields: {},
			pages: [{id: 'default', submitButton: {label: 'Save'}}],
			primaryLocale: 'en',
			visibleLocales: ['en'],
			errors: {},
			showErrorFooter: true,
		},
	},
};
