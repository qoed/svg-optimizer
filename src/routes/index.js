import {
	SVG,
	cleanupSVG,
	runSVGO,
	parseColors,
	cleanupIconKeyword,
	blankIconSet,
	isEmptyColor
} from '@iconify/tools';
/**@type {import('@sveltejs/kit').RequestHandler} */
export const post = async ({ request }) => {
	/**@type {(files: any[], options: {prefix: string}) => Promise<import('@iconify/tools').IconSet>}*/
	async function createIconSet(files, options) {
		const iconSet = blankIconSet(options.prefix || '');

		for (var f of files) {
			let keyword = cleanupIconKeyword(f.name.replace('.svg', ''));
			console.log(keyword);
			const svg = new SVG(f.content);
			await cleanupSVG(svg);
			iconSet.fromSVG(keyword, svg);
		}

		return iconSet;
	}

	const { data, prefix } = await request.json();
	const optimized = [];
	const unpluginIconSet = { [prefix]: {} };
	const iconSet = await createIconSet(data, { prefix });

	await iconSet.forEach(async (name, type) => {
		if (type !== 'icon') {
			return;
		}

		const svg = iconSet.toSVG(name);
		if (!svg) {
			// Invalid icon
			iconSet.remove(name);
			return;
		}

		// Clean up and optimise icons
		try {
			await cleanupSVG(svg);
			await parseColors(svg, {
				defaultColor: 'currentColor',
				callback: (attr, colorStr, color) => {
					return !color || isEmptyColor(color) ? colorStr : 'currentColor';
				}
			});
			await runSVGO(svg);
		} catch (err) {
			// Invalid icon
			console.error(`Error parsing ${name}:`, err);
			iconSet.remove(name);
			return;
		}

		// Update icon
		iconSet.fromSVG(name, svg);
	});

	// Export as IconifyJSON
	const exported = iconSet.export();

	for (var f of data) {
		const svg = new SVG(f.content);
		await cleanupSVG(svg);

		if (!f.preserveColor) {
			await parseColors(svg, {
				defaultColor: 'currentColor',
				callback: (attr, colorStr, color) => {
					if (color) {
						if (color.type === 'none') {
							return colorStr;
						}

						if (color.type === 'rgb') {
							return 'currentColor';
						}
					}

					return colorStr;
				}
			});
		}
		await runSVGO(svg);
		const minifiedSvg = svg.toMinifiedString();

		unpluginIconSet[prefix] = {
			...unpluginIconSet[prefix],
			[cleanupIconKeyword(f.name.replace('.svg', ''))]: minifiedSvg
		};

		optimized.push({ name: f.name, content: minifiedSvg });
	}

	return {
		status: 201,
		body: {
			optimized,
			preOptimized: data,
			iconify: JSON.stringify(exported, null, '\t') + '\n',
			unpluginIconSet: JSON.stringify(unpluginIconSet, null, '\t') + '\n'
		}
	};
};
