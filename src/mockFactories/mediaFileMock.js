import {isObject} from './mockHelpers';

const CommonDefaults = {
	_href:
		'http://localhost:7002/index.php/publicknowledge/api/v1/submissions/1/mediaFiles/1',
	id: 1,
	variantGroupId: 60,
	fileId: 1,
	name: {
		en: 'file.png',
		fr_CA: '',
	},
	documentType: 'image',
	mimetype: 'image/png',
	variantType: 'web',
	fileSize: 78848,
	createdAt: '2026-01-15 10:30:00',
	updatedAt: '2026-01-15 10:30:00',
	uploaderUserId: 17,
	uploaderUserName: 'amwandenga',
	url: 'http://localhost:7002/index.php/publicknowledge/$$$call$$$/api/file/file-api/download-file?submissionFileId=1&submissionId=1&stageId=3',
};

function getMediaFile(overrides = {}) {
	let mediaFile = {...CommonDefaults};

	Object.keys(overrides).forEach((key) => {
		// detect multilingual field to simplify mocking
		if (
			!isObject(overrides[key]) &&
			isObject(mediaFile[key]) &&
			mediaFile[key].en !== undefined
		) {
			mediaFile[key] = {fr_CA: '', en: overrides[key]};
		} else {
			mediaFile[key] = overrides[key];
		}
	});

	return mediaFile;
}

export const MediaFilesDataMock = [
	getMediaFile({
		id: 1,
		variantGroupId: 60,
		fileId: 1,
		name: 'Figure1_graph_trendline.png',
		documentType: 'image',
		mimetype: 'image/png',
		variantType: 'web',
		fileSize: 78848,
		createdAt: '2026-01-15 10:30:00',
	}),
	getMediaFile({
		id: 2,
		variantGroupId: 60,
		fileId: 2,
		name: 'Figure1_graph_trendline_highres.tiff',
		documentType: 'image',
		mimetype: 'image/tiff',
		variantType: 'high_resolution',
		fileSize: 4294967296,
		createdAt: '2026-01-15 10:30:00',
	}),
	getMediaFile({
		id: 3,
		variantGroupId: 61,
		fileId: 3,
		name: 'Interview_transcript_clip.mp4',
		documentType: 'video',
		mimetype: 'video/mp4',
		variantType: 'multimedia',
		fileSize: 353280,
		createdAt: '2026-01-15 10:30:00',
	}),
	getMediaFile({
		id: 4,
		variantGroupId: 62,
		fileId: 4,
		name: 'Workflow_diagram_study_design.svg',
		documentType: 'image',
		mimetype: 'image/svg+xml',
		variantType: 'web',
		fileSize: 78848,
		createdAt: '2026-01-15 10:30:00',
	}),
	getMediaFile({
		id: 5,
		variantGroupId: 62,
		fileId: 5,
		name: 'Workflow_diagram_study_design_hd.svg',
		documentType: 'image',
		mimetype: 'image/svg+xml',
		variantType: 'high_resolution',
		fileSize: 5368709120,
		createdAt: '2026-01-15 10:30:00',
	}),
	getMediaFile({
		id: 6,
		variantGroupId: 63,
		fileId: 6,
		name: 'sample_map_regionA.jpg',
		documentType: 'image',
		mimetype: 'image/jpeg',
		variantType: 'web',
		fileSize: 78848,
		createdAt: '2026-01-15 10:30:00',
	}),
	getMediaFile({
		id: 7,
		variantGroupId: 64,
		fileId: 7,
		name: 'microscopy_cell_stain.jpg',
		documentType: 'image',
		mimetype: 'image/jpeg',
		variantType: 'web',
		fileSize: 78848,
		createdAt: '2026-01-15 10:30:00',
	}),
	getMediaFile({
		id: 8,
		variantGroupId: 65,
		fileId: 8,
		name: 'time_lapse_growth_experiment.mov',
		documentType: 'video',
		mimetype: 'video/quicktime',
		variantType: 'multimedia',
		fileSize: 581632,
		createdAt: '2026-01-15 10:30:00',
	}),
	getMediaFile({
		id: 9,
		variantGroupId: 66,
		fileId: 9,
		name: 'Heatmap_species_distribution.png',
		documentType: 'image',
		mimetype: 'image/png',
		variantType: 'web',
		fileSize: 78848,
		createdAt: '2026-01-15 10:30:00',
	}),
	getMediaFile({
		id: 10,
		variantGroupId: 66,
		fileId: 10,
		name: 'Heatmap_species_distribution_highres.svg',
		documentType: 'image',
		mimetype: 'image/svg+xml',
		variantType: 'high_resolution',
		fileSize: 4509715660,
		createdAt: '2026-01-15 10:30:00',
	}),
	getMediaFile({
		id: 11,
		variantGroupId: 67,
		fileId: 11,
		name: 'microscopy_cell_stain_highquality.tiff',
		documentType: 'image',
		mimetype: 'image/tiff',
		variantType: 'high_resolution',
		fileSize: 4080218931,
		createdAt: '2026-01-15 10:30:00',
	}),
];
