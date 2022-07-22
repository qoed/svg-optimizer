import path from 'path';
import { sveltekit } from '@sveltejs/kit/vite';
import {defineConfig} from 'vite'

export default defineConfig(() => {
  /** @type {import('vite').UserConfig} */
  const config = {
      plugins: [
        sveltekit()
      ],
			resolve: {
				alias: {
					'@': path.resolve('./src')
				}
			}
		}

  return config;
});

