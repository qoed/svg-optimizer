import { SVG, cleanupSVG, runSVGO, parseColors } from '@iconify/tools';
/**@type {import('@sveltejs/kit').RequestHandler} */
export const post = async ({ request }) => {
	const { data } = await request.json();
	const optimized = [];

	for (var f of data) {
		const svg = new SVG(f.content);
		await cleanupSVG(svg);
		await runSVGO(svg);
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
		optimized.push({ name: f.name, content: svg.toMinifiedString() });
	}

	return {
		status: 201,
		body: {
			optimized,
			preOptimized: data
		}
	};
};
