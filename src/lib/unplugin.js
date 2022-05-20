export function createUnpluginIconSet(/**@type {string}*/ prefix) {
	return new UnpluginIconSet(prefix);
}

class UnpluginIconSet {
	/**@type {Record<string, any>} */
	#icons = {};
	/**
	 * @param {string} prefix
	 */
	constructor(prefix) {
		this.prefix = prefix;
	}
	/**
	 * @param {string} name
	 * @param {string} svg
	 */
	add(name, svg) {
		this.#icons[name.replace('.svg', '').replaceAll(' ', '-').replaceAll('_', '-')] = svg
			.replace(/width="\d+"/, '')
			.replace(/height="\d+"/, '')
			.replace('  >', '>');
	}
	/**
	 * @param {string} name
	 */
	remove(name) {
		delete this.#icons[name];
	}

	export() {
		return (
			JSON.stringify(
				{
					[this.prefix]: { ...this.#icons }
				},
				null,
				'\t'
			) + '\n'
		);
	}
}
