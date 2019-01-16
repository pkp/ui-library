const baseStat = {
	total: 0,
	views: 0,
	downloads: 0,
	pdf: 0,
	html: 0,
	other: 0,
	object: {
		id: 1,
		fullTitle: {
			en_US: 'Tortor ultrices dolor diam dignissim ante nulla et morbi imperdiet',
		},
		authorString: 'Carlo Corino',
		urlPublished: '/example/1',
	},
};

let stats = [];
for (let i = 1; i < 31; i++) {
	let stat = {...baseStat};
	stat.views = Math.floor(Math.random() * 10000) + 1;
	stat.downloads = Math.floor(Math.random() * 1000) + 1;
	let sixth = Math.floor(stat.downloads / 6);
	stat.pdf = sixth * 3;
	stat.html = sixth * 2;
	stat.other = sixth * 1;
	stat.total = stat.views + stat.downloads;
	stats.push(stat);
}

export default stats;
