import {deepMerge} from './mockHelpers';

const CommonDefaults = {
	id: 1,
	groupId: 60,
	name: 'file.png',
	type: 'Image',
	size: '77 KB',
	dateUploaded: 'January 15, 2026',
};

function getMediaFile(overrides = {}) {
	const mediaFile = deepMerge({...CommonDefaults}, overrides);
	return mediaFile;
}

export const MediaFilesDataMock = [
	getMediaFile({
		id: 1,
		groupId: 60,
		name: 'Figure1_graph_trendline.png',
		type: 'Image',
		size: '77 KB',
		dateUploaded: 'January 15, 2026',
	}),
	getMediaFile({
		id: 2,
		groupId: 60,
		name: 'Figure1_graph_trendline_highres.tiff',
		type: 'High-resolution image',
		size: '4 GB',
		dateUploaded: 'January 15, 2026',
	}),
	getMediaFile({
		id: 3,
		groupId: 61,
		name: 'Interview_transcript_clip.mp4',
		type: 'Multimedia',
		size: '345 KB',
		dateUploaded: 'January 15, 2026',
	}),
	getMediaFile({
		id: 4,
		groupId: 62,
		name: 'Workflow_diagram_study_design.svg',
		type: 'Image',
		size: '77 KB',
		dateUploaded: 'January 15, 2026',
	}),
	getMediaFile({
		id: 5,
		groupId: 62,
		name: 'Workflow_diagram_study_design_hd.svg',
		type: 'High-resolution image',
		size: '5 GB',
		dateUploaded: 'January 15, 2026',
	}),
	getMediaFile({
		id: 6,
		groupId: 63,
		name: 'sample_map_regionA.jpg',
		type: 'Image',
		size: '77 KB',
		dateUploaded: 'January 15, 2026',
	}),
	getMediaFile({
		id: 7,
		groupId: 64,
		name: 'microscopy_cell_stain.jpg',
		type: 'Image',
		size: '77 KB',
		dateUploaded: 'January 15, 2026',
	}),
	getMediaFile({
		id: 8,
		groupId: 65,
		name: 'time_lapse_growth_experiment.mov',
		type: 'Multimedia',
		size: '568 KB',
		dateUploaded: 'January 15, 2026',
	}),
	getMediaFile({
		id: 9,
		groupId: 66,
		name: 'Heatmap_species_distribution.png',
		type: 'Image',
		size: '77 KB',
		dateUploaded: 'January 15, 2026',
	}),
	getMediaFile({
		id: 10,
		groupId: 66,
		name: 'Heatmap_species_distribution_highres.svg',
		type: 'High-resolution image',
		size: '4.2 GB',
		dateUploaded: 'January 15, 2026',
	}),
	getMediaFile({
		id: 11,
		groupId: 67,
		name: 'microscopy_cell_stain_highquality.tiff',
		type: 'High-resolution image',
		size: '3.8 GB',
		dateUploaded: 'January 15, 2026',
	}),
];
