function getRandomTitle(str) {
	let title = str
		.split(' ')
		.sort((a, b) => (Math.random() > 0.5 ? -1 : 1))
		.join(' ');
	const trimLength = Math.floor(Math.random() * 20);
	title = title.charAt(0).toUpperCase() + title.slice(1);
	return title.substr(0, title.length - trimLength);
}

const baseTitle =
	'tortor ultrices dolor diam dignissim ante nulla et morbi imperdiet';
const sectionIds = [1, 2, 3];
const baseStat = {
	total: 0,
	views: 0,
	downloads: 0,
	object: {
		id: 1,
		fullTitle: {
			en: getRandomTitle(baseTitle),
		},
		sectionId: 1,
		authorString: 'Carlo Corino',
		urlPublished: '/example/1',
	},
};

let stats = [];
for (let i = 1; i < 61; i++) {
	let stat = {
		...baseStat,
		object: {
			...baseStat.object,
			id: i,
			fullTitle: {
				en: getRandomTitle(baseTitle),
			},
			sectionId: sectionIds[Math.floor(Math.random() * sectionIds.length)],
		},
		views: Math.floor(Math.random() * 10000) + 1,
		downloads: Math.floor(Math.random() * 1000) + 1,
	};

	stat.total = stat.views + stat.downloads;

	stats.push(stat);
}

// use fixed stats to stabilize visual comparisons
stats = [
	{
		total: 8564,
		views: 7945,
		downloads: 619,
		object: {
			id: 1,
			fullTitle: {
				en: 'Nulla et ultrices tortor imperdiet ante diam dignissim',
			},
			sectionId: 3,
			authorString: 'Carlo Corino',
			urlPublished: '/example/1',
		},
	},
	{
		total: 1170,
		views: 560,
		downloads: 610,
		object: {
			id: 2,
			fullTitle: {
				en: 'Ante dignissim imperdiet diam dolor ultrices et null',
			},
			sectionId: 1,
			authorString: 'Carlo Corino',
			urlPublished: '/example/1',
		},
	},
	{
		total: 9607,
		views: 9392,
		downloads: 215,
		object: {
			id: 3,
			fullTitle: {
				en: 'Nulla imperdiet ultrices et dignissim tortor morbi d',
			},
			sectionId: 3,
			authorString: 'Carlo Corino',
			urlPublished: '/example/1',
		},
	},
	{
		total: 3453,
		views: 2732,
		downloads: 721,
		object: {
			id: 4,
			fullTitle: {
				en: 'Et morbi nulla dignissim tortor ante diam dolor u',
			},
			sectionId: 1,
			authorString: 'Carlo Corino',
			urlPublished: '/example/1',
		},
	},
	{
		total: 2541,
		views: 1782,
		downloads: 759,
		object: {
			id: 5,
			fullTitle: {
				en: 'Nulla dignissim tortor ante et ultrices morbi dolor diam ',
			},
			sectionId: 1,
			authorString: 'Carlo Corino',
			urlPublished: '/example/1',
		},
	},
	{
		total: 5116,
		views: 4512,
		downloads: 604,
		object: {
			id: 6,
			fullTitle: {
				en: 'Ultrices nulla tortor morbi ante dignissim dolo',
			},
			sectionId: 2,
			authorString: 'Carlo Corino',
			urlPublished: '/example/1',
		},
	},
	{
		total: 7468,
		views: 6697,
		downloads: 771,
		object: {
			id: 7,
			fullTitle: {
				en: 'Nulla ante dignissim diam imperdiet morbi dolor ultrices tortor e',
			},
			sectionId: 2,
			authorString: 'Carlo Corino',
			urlPublished: '/example/1',
		},
	},
	{
		total: 3678,
		views: 3450,
		downloads: 228,
		object: {
			id: 8,
			fullTitle: {
				en: 'Morbi ante tortor imperdiet ultrices nulla dignissim dolor et dia',
			},
			sectionId: 1,
			authorString: 'Carlo Corino',
			urlPublished: '/example/1',
		},
	},
	{
		total: 1421,
		views: 937,
		downloads: 484,
		object: {
			id: 9,
			fullTitle: {
				en: 'Nulla tortor ultrices diam imperdiet et dignissim morbi dolor ',
			},
			sectionId: 2,
			authorString: 'Carlo Corino',
			urlPublished: '/example/1',
		},
	},
	{
		total: 7490,
		views: 6772,
		downloads: 718,
		object: {
			id: 10,
			fullTitle: {
				en: 'Diam dolor imperdiet dignissim morbi et tortor ultrices nulla ante',
			},
			sectionId: 1,
			authorString: 'Carlo Corino',
			urlPublished: '/example/1',
		},
	},
	{
		total: 2440,
		views: 1904,
		downloads: 536,
		object: {
			id: 11,
			fullTitle: {
				en: 'Tortor nulla diam imperdiet dolor ante et ultrices mor',
			},
			sectionId: 3,
			authorString: 'Carlo Corino',
			urlPublished: '/example/1',
		},
	},
	{
		total: 3924,
		views: 3714,
		downloads: 210,
		object: {
			id: 12,
			fullTitle: {
				en: 'Dignissim diam ante morbi dolor ultrices nulla imperdiet et ',
			},
			sectionId: 1,
			authorString: 'Carlo Corino',
			urlPublished: '/example/1',
		},
	},
	{
		total: 2425,
		views: 2329,
		downloads: 96,
		object: {
			id: 13,
			fullTitle: {
				en: 'Nulla imperdiet et dolor ultrices diam dignissim tortor ant',
			},
			sectionId: 2,
			authorString: 'Carlo Corino',
			urlPublished: '/example/1',
		},
	},
	{
		total: 10104,
		views: 9617,
		downloads: 487,
		object: {
			id: 14,
			fullTitle: {
				en: 'Dignissim ante diam tortor imperdiet ultrices nulla',
			},
			sectionId: 1,
			authorString: 'Carlo Corino',
			urlPublished: '/example/1',
		},
	},
	{
		total: 1205,
		views: 1053,
		downloads: 152,
		object: {
			id: 15,
			fullTitle: {
				en: 'Diam dolor et nulla ultrices ante morbi imperdiet digni',
			},
			sectionId: 3,
			authorString: 'Carlo Corino',
			urlPublished: '/example/1',
		},
	},
	{
		total: 1389,
		views: 1345,
		downloads: 44,
		object: {
			id: 16,
			fullTitle: {
				en: 'Ante dolor et imperdiet diam dignissim tortor ultr',
			},
			sectionId: 1,
			authorString: 'Carlo Corino',
			urlPublished: '/example/1',
		},
	},
	{
		total: 5861,
		views: 5300,
		downloads: 561,
		object: {
			id: 17,
			fullTitle: {
				en: 'Nulla tortor dolor et dignissim diam ultrices ante morbi i',
			},
			sectionId: 1,
			authorString: 'Carlo Corino',
			urlPublished: '/example/1',
		},
	},
	{
		total: 2914,
		views: 2125,
		downloads: 789,
		object: {
			id: 18,
			fullTitle: {
				en: 'Diam nulla tortor ante dolor et ultrices morbi imperdiet dig',
			},
			sectionId: 2,
			authorString: 'Carlo Corino',
			urlPublished: '/example/1',
		},
	},
	{
		total: 5439,
		views: 4950,
		downloads: 489,
		object: {
			id: 19,
			fullTitle: {
				en: 'Tortor nulla ultrices dolor ante dignissim morbi diam imperdiet',
			},
			sectionId: 3,
			authorString: 'Carlo Corino',
			urlPublished: '/example/1',
		},
	},
	{
		total: 6822,
		views: 6723,
		downloads: 99,
		object: {
			id: 20,
			fullTitle: {
				en: 'Ultrices nulla et dolor ante dignissim morbi tortor imp',
			},
			sectionId: 1,
			authorString: 'Carlo Corino',
			urlPublished: '/example/1',
		},
	},
	{
		total: 2535,
		views: 2262,
		downloads: 273,
		object: {
			id: 21,
			fullTitle: {
				en: 'Tortor morbi nulla ante ultrices diam dolor et imperdiet',
			},
			sectionId: 2,
			authorString: 'Carlo Corino',
			urlPublished: '/example/1',
		},
	},
	{
		total: 3319,
		views: 2988,
		downloads: 331,
		object: {
			id: 22,
			fullTitle: {
				en: 'Diam ante dolor dignissim nulla morbi et imperdiet ultrices tort',
			},
			sectionId: 1,
			authorString: 'Carlo Corino',
			urlPublished: '/example/1',
		},
	},
	{
		total: 891,
		views: 475,
		downloads: 416,
		object: {
			id: 23,
			fullTitle: {
				en: 'Tortor et morbi ante diam ultrices dolor dignissim imperdiet ',
			},
			sectionId: 2,
			authorString: 'Carlo Corino',
			urlPublished: '/example/1',
		},
	},
	{
		total: 5976,
		views: 5882,
		downloads: 94,
		object: {
			id: 24,
			fullTitle: {
				en: 'Et nulla imperdiet ante tortor morbi diam ultrices digniss',
			},
			sectionId: 2,
			authorString: 'Carlo Corino',
			urlPublished: '/example/1',
		},
	},
	{
		total: 9086,
		views: 9076,
		downloads: 10,
		object: {
			id: 25,
			fullTitle: {
				en: 'Diam imperdiet ante nulla morbi tortor dignissim et ultrices d',
			},
			sectionId: 3,
			authorString: 'Carlo Corino',
			urlPublished: '/example/1',
		},
	},
	{
		total: 5547,
		views: 4979,
		downloads: 568,
		object: {
			id: 26,
			fullTitle: {
				en: 'Morbi ultrices dolor tortor dignissim ante et imperdiet d',
			},
			sectionId: 3,
			authorString: 'Carlo Corino',
			urlPublished: '/example/1',
		},
	},
	{
		total: 3019,
		views: 2223,
		downloads: 796,
		object: {
			id: 27,
			fullTitle: {
				en: 'Diam dolor ultrices tortor dignissim ante et nulla morbi imperdi',
			},
			sectionId: 2,
			authorString: 'Carlo Corino',
			urlPublished: '/example/1',
		},
	},
	{
		total: 3078,
		views: 2595,
		downloads: 483,
		object: {
			id: 28,
			fullTitle: {
				en: 'Ante nulla diam dolor morbi ultrices dignissim tortor et i',
			},
			sectionId: 3,
			authorString: 'Carlo Corino',
			urlPublished: '/example/1',
		},
	},
	{
		total: 7242,
		views: 6650,
		downloads: 592,
		object: {
			id: 29,
			fullTitle: {
				en: 'Nulla dignissim tortor ultrices et ante diam do',
			},
			sectionId: 3,
			authorString: 'Carlo Corino',
			urlPublished: '/example/1',
		},
	},
	{
		total: 10052,
		views: 9717,
		downloads: 335,
		object: {
			id: 30,
			fullTitle: {
				en: 'Tortor ultrices nulla ante dolor dignissim et morbi imperdiet d',
			},
			sectionId: 3,
			authorString: 'Carlo Corino',
			urlPublished: '/example/1',
		},
	},
	{
		total: 6362,
		views: 5870,
		downloads: 492,
		object: {
			id: 31,
			fullTitle: {
				en: 'Tortor ultrices morbi ante imperdiet et dolor n',
			},
			sectionId: 1,
			authorString: 'Carlo Corino',
			urlPublished: '/example/1',
		},
	},
	{
		total: 6481,
		views: 5833,
		downloads: 648,
		object: {
			id: 32,
			fullTitle: {
				en: 'Tortor ante morbi ultrices dolor diam et imperdiet nulla digni',
			},
			sectionId: 3,
			authorString: 'Carlo Corino',
			urlPublished: '/example/1',
		},
	},
	{
		total: 1250,
		views: 537,
		downloads: 713,
		object: {
			id: 33,
			fullTitle: {
				en: 'Ante imperdiet diam dignissim dolor et ultrices tortor nulla mo',
			},
			sectionId: 1,
			authorString: 'Carlo Corino',
			urlPublished: '/example/1',
		},
	},
	{
		total: 2149,
		views: 1463,
		downloads: 686,
		object: {
			id: 34,
			fullTitle: {
				en: 'Ante diam dolor nulla ultrices dignissim et tortor imperdiet morbi',
			},
			sectionId: 2,
			authorString: 'Carlo Corino',
			urlPublished: '/example/1',
		},
	},
	{
		total: 2067,
		views: 1855,
		downloads: 212,
		object: {
			id: 35,
			fullTitle: {
				en: 'Tortor imperdiet morbi ultrices dignissim diam ',
			},
			sectionId: 3,
			authorString: 'Carlo Corino',
			urlPublished: '/example/1',
		},
	},
	{
		total: 9446,
		views: 8582,
		downloads: 864,
		object: {
			id: 36,
			fullTitle: {
				en: 'Tortor ultrices dolor dignissim morbi diam nulla et',
			},
			sectionId: 1,
			authorString: 'Carlo Corino',
			urlPublished: '/example/1',
		},
	},
	{
		total: 4692,
		views: 4453,
		downloads: 239,
		object: {
			id: 37,
			fullTitle: {
				en: 'Diam tortor imperdiet ante et ultrices dignissim morbi ',
			},
			sectionId: 3,
			authorString: 'Carlo Corino',
			urlPublished: '/example/1',
		},
	},
	{
		total: 4901,
		views: 4775,
		downloads: 126,
		object: {
			id: 38,
			fullTitle: {
				en: 'Dolor ante nulla ultrices et diam tortor morbi dignissim imp',
			},
			sectionId: 1,
			authorString: 'Carlo Corino',
			urlPublished: '/example/1',
		},
	},
	{
		total: 4945,
		views: 4803,
		downloads: 142,
		object: {
			id: 39,
			fullTitle: {
				en: 'Nulla ultrices morbi et dignissim tortor imperdiet dolor ante ',
			},
			sectionId: 3,
			authorString: 'Carlo Corino',
			urlPublished: '/example/1',
		},
	},
	{
		total: 5948,
		views: 5088,
		downloads: 860,
		object: {
			id: 40,
			fullTitle: {
				en: 'Ultrices dolor morbi diam ante tortor imperdiet nulla et dignis',
			},
			sectionId: 2,
			authorString: 'Carlo Corino',
			urlPublished: '/example/1',
		},
	},
	{
		total: 5239,
		views: 4731,
		downloads: 508,
		object: {
			id: 41,
			fullTitle: {
				en: 'Dignissim nulla imperdiet dolor morbi ante diam ultr',
			},
			sectionId: 3,
			authorString: 'Carlo Corino',
			urlPublished: '/example/1',
		},
	},
	{
		total: 6611,
		views: 6304,
		downloads: 307,
		object: {
			id: 42,
			fullTitle: {
				en: 'Diam nulla dolor imperdiet tortor ante ultrices et morbi dignissi',
			},
			sectionId: 2,
			authorString: 'Carlo Corino',
			urlPublished: '/example/1',
		},
	},
	{
		total: 6626,
		views: 5827,
		downloads: 799,
		object: {
			id: 43,
			fullTitle: {
				en: 'Ante et dignissim imperdiet tortor morbi ultrices diam ',
			},
			sectionId: 1,
			authorString: 'Carlo Corino',
			urlPublished: '/example/1',
		},
	},
	{
		total: 8275,
		views: 7685,
		downloads: 590,
		object: {
			id: 44,
			fullTitle: {
				en: 'Dignissim et diam nulla dolor morbi ultrices imperdiet ante t',
			},
			sectionId: 3,
			authorString: 'Carlo Corino',
			urlPublished: '/example/1',
		},
	},
	{
		total: 6467,
		views: 5609,
		downloads: 858,
		object: {
			id: 45,
			fullTitle: {
				en: 'Tortor ultrices et nulla dignissim morbi imperdiet diam a',
			},
			sectionId: 1,
			authorString: 'Carlo Corino',
			urlPublished: '/example/1',
		},
	},
	{
		total: 680,
		views: 349,
		downloads: 331,
		object: {
			id: 46,
			fullTitle: {
				en: 'Dolor ante nulla dignissim morbi et diam imperdiet ',
			},
			sectionId: 3,
			authorString: 'Carlo Corino',
			urlPublished: '/example/1',
		},
	},
	{
		total: 10596,
		views: 9906,
		downloads: 690,
		object: {
			id: 47,
			fullTitle: {
				en: 'Nulla diam dolor ultrices tortor imperdiet et digniss',
			},
			sectionId: 1,
			authorString: 'Carlo Corino',
			urlPublished: '/example/1',
		},
	},
	{
		total: 4319,
		views: 4233,
		downloads: 86,
		object: {
			id: 48,
			fullTitle: {
				en: 'Et ultrices ante diam morbi tortor nulla digniss',
			},
			sectionId: 1,
			authorString: 'Carlo Corino',
			urlPublished: '/example/1',
		},
	},
	{
		total: 5177,
		views: 4344,
		downloads: 833,
		object: {
			id: 49,
			fullTitle: {
				en: 'Imperdiet dignissim morbi nulla diam dolor ultrices ante et',
			},
			sectionId: 3,
			authorString: 'Carlo Corino',
			urlPublished: '/example/1',
		},
	},
	{
		total: 3156,
		views: 2966,
		downloads: 190,
		object: {
			id: 50,
			fullTitle: {
				en: 'Ultrices ante morbi nulla dolor tortor diam imperdiet',
			},
			sectionId: 3,
			authorString: 'Carlo Corino',
			urlPublished: '/example/1',
		},
	},
	{
		total: 2808,
		views: 2117,
		downloads: 691,
		object: {
			id: 51,
			fullTitle: {
				en: 'Nulla tortor ante et ultrices imperdiet diam dolor dignis',
			},
			sectionId: 2,
			authorString: 'Carlo Corino',
			urlPublished: '/example/1',
		},
	},
	{
		total: 2327,
		views: 1581,
		downloads: 746,
		object: {
			id: 52,
			fullTitle: {
				en: 'Dolor et ultrices diam dignissim tortor nulla ante imperdiet morb',
			},
			sectionId: 1,
			authorString: 'Carlo Corino',
			urlPublished: '/example/1',
		},
	},
	{
		total: 711,
		views: 310,
		downloads: 401,
		object: {
			id: 53,
			fullTitle: {
				en: 'Nulla morbi ante tortor imperdiet et ultrices dignissim dolor ',
			},
			sectionId: 2,
			authorString: 'Carlo Corino',
			urlPublished: '/example/1',
		},
	},
	{
		total: 5100,
		views: 5015,
		downloads: 85,
		object: {
			id: 54,
			fullTitle: {
				en: 'Diam et ultrices ante morbi dignissim tortor dolor imperdiet ',
			},
			sectionId: 1,
			authorString: 'Carlo Corino',
			urlPublished: '/example/1',
		},
	},
	{
		total: 6647,
		views: 6104,
		downloads: 543,
		object: {
			id: 55,
			fullTitle: {
				en: 'Et diam tortor imperdiet morbi dolor dignissim ante nulla ultr',
			},
			sectionId: 1,
			authorString: 'Carlo Corino',
			urlPublished: '/example/1',
		},
	},
	{
		total: 9420,
		views: 9240,
		downloads: 180,
		object: {
			id: 56,
			fullTitle: {
				en: 'Tortor ultrices imperdiet dolor nulla dignissim morbi d',
			},
			sectionId: 3,
			authorString: 'Carlo Corino',
			urlPublished: '/example/1',
		},
	},
	{
		total: 3323,
		views: 2562,
		downloads: 761,
		object: {
			id: 57,
			fullTitle: {
				en: 'Et tortor nulla imperdiet morbi ultrices dolor diam dig',
			},
			sectionId: 3,
			authorString: 'Carlo Corino',
			urlPublished: '/example/1',
		},
	},
	{
		total: 1466,
		views: 569,
		downloads: 897,
		object: {
			id: 58,
			fullTitle: {
				en: 'Morbi dolor ultrices diam et imperdiet ante tortor dignissim',
			},
			sectionId: 1,
			authorString: 'Carlo Corino',
			urlPublished: '/example/1',
		},
	},
	{
		total: 3115,
		views: 2861,
		downloads: 254,
		object: {
			id: 59,
			fullTitle: {
				en: 'Tortor ultrices morbi imperdiet dolor diam nulla et ',
			},
			sectionId: 1,
			authorString: 'Carlo Corino',
			urlPublished: '/example/1',
		},
	},
	{
		total: 3050,
		views: 2500,
		downloads: 550,
		object: {
			id: 60,
			fullTitle: {
				en: 'Ante nulla et tortor morbi ultrices dolor diam imperdiet digniss',
			},
			sectionId: 1,
			authorString: 'Carlo Corino',
			urlPublished: '/example/1',
		},
	},
];
export default stats;
