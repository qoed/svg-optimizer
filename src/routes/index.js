import { createIconifySet } from '$lib/iconify';
import { createUnpluginIconSet } from '$lib/unplugin';
import {
	cleanupSVG,
	runSVGO,
	parseColors,
	isEmptyColor,
	cleanupIconKeyword,
	SVG
} from '@iconify/tools';

/**@type {import('@sveltejs/kit').RequestHandler} */
export const post = async ({ request }) => {
	const { data, prefix } = await request.json();
	/** @type {{ name: string; content: string; }[]}*/
	const optimizedSvg = [];

	const unpluginIconSet = createUnpluginIconSet(prefix);
	const iconifySet = createIconifySet(prefix);

	for (var file of data) {
		let name = cleanupIconKeyword(file.name.replace('.svg', ''));
		const svg = new SVG(file.content);

		// Clean up and optimise icons
		try {
			await cleanupSVG(svg);
			if (!file.preserveColor) {
				await parseColors(svg, {
					defaultColor: 'currentColor',
					callback: (attr, colorStr, color) => {
						return !color || isEmptyColor(color) ? colorStr : 'currentColor';
					}
				});
			}
			await runSVGO(svg);
		} catch (err) {
			// Invalid icon
			console.error(`Error parsing ${name}:`, err);
		}

		const minifiedSvg = svg.toMinifiedString();
		// Update icon
		iconifySet.fromSVG(name, svg);
		unpluginIconSet.add(name, minifiedSvg);
		optimizedSvg.push({ name: name, content: minifiedSvg });
	}

	// Export as IconifyJSON
	const iconifyJSON = iconifySet.export();

	return {
		status: 201,
		body: {
			optimizedSvg,
			svg: data,
			iconify: JSON.stringify(iconifyJSON, null, '\t') + '\n',
			unpluginIconSet: unpluginIconSet.export()
		}
	};
};
