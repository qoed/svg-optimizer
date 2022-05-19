import { SVG, cleanupSVG, runSVGO, parseColors } from '@iconify/tools';
/**@type {import('@sveltejs/kit').RequestHandler} */
export const post = async ({ request }) => {
	console.log('called post endpoint');

	const { data } = await request.json();
	const optimized = [];
	// console.log(request);
	for (var f of data) {
		const svg = new SVG(f.content);
		await cleanupSVG(svg);
		await runSVGO(svg);
		await parseColors(svg, {
			defaultColor: 'currentColor',
			callback: (attr, colorStr, color) => {
				console.log(attr, colorStr, color);
				if (color) {
					if (color.type === 'none') {
						return colorStr;
					}
					// color === null, so color cannot be parsed
					// Return colorStr to keep old value
					if (color.type === 'rgb') {
						return 'currentColor';
					}
				}

				return colorStr;
			}
		});
		optimized.push({ name: f.name, content: svg.toMinifiedString() });
	}

	console.log(data);
	console.log(optimized);

	return {
		status: 201,
		body: {
			optimized,
			preOptimized: data
		}
	};
};
