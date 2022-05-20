/**@type {(node: Node) => any} */
export function fileinput(node) {
	const fileInput = document.getElementById('svg');

	const handleClick = () => {
		if (fileInput) {
			fileInput.click();
		}
	};

	node.addEventListener('click', handleClick);

	return {
		destroy() {
			node.removeEventListener('click', handleClick);
		}
	};
}

/**@type {(file: {name: string; content: any}, options: {type: "image" | "json"}) => any} */
export function createDownload(file, options) {
	const type = { type: options.type === 'image' ? 'image/svg+xml' : 'application/json' };
	const downloadFile = new File([file.content], file.name, type);
	const reader = new FileReader();
	reader.readAsDataURL(downloadFile);
	reader.addEventListener(
		'load',
		function () {
			if (typeof reader.result === 'string') {
				const a = document.createElement('a');
				a.href = reader.result;
				a.download = file.name;
				document.body.appendChild(a);
				a.click();
				document.body.removeChild(a);
			}
		},
		false
	);
}

/**@type {(node: HTMLImageElement, image: {name: string; content: string}) => any} */
export function setImage(node, image) {
	const objectUrl = URL.createObjectURL(
		new File([image.content], image.name, { type: 'image/svg+xml' })
	);
	node.src = objectUrl;
	node.alt = image.name;
	node.onload = function () {
		URL.revokeObjectURL(objectUrl);
	};
}

/**@type {(node: HTMLElement, data: {name: string; content: string}) => any} */
export function drop(node) {
	/**@type {(e: DragEvent) => void} */
	function stop(e) {
		// e.stopPropagation();
		e.preventDefault();
	}
	/**@type {(e: DragEvent) => void} */
	function handleDrop(e) {
		stop(e);
		node.style.borderStyle = 'solid';
		node.classList.remove('bg-primary-transparent-dark');

		const dt = e.dataTransfer;
		if (dt) {
			node.dispatchEvent(new CustomEvent('files', { detail: { files: dt.files } }));
		}
	}

	/**@type {(e: DragEvent) => void} */
	function handleDragOver(e) {
		stop(e);
		node.style.borderStyle = 'dashed';
		node.classList.add('bg-primary-transparent-dark');
	}

	/**@type {(e: DragEvent) => void} */
	function handleDragEnd(e) {
		stop(e);
		node.style.borderStyle = 'solid';
		node.classList.remove('bg-primary-transparent-dark');
	}

	node.addEventListener('dragenter', stop, false);
	node.addEventListener('dragleave', handleDragEnd, false);
	node.addEventListener('dragover', handleDragOver, false);
	node.addEventListener('dragend', handleDragEnd, false);
	node.addEventListener('drop', handleDrop);
}
