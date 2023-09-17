/*import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
})*/
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

import legacy from '@vitejs/plugin-legacy';

export default defineConfig({
	base:"./",
	plugins:[
		vue(),
		legacy({
			targets:["defaults","not IE 11"],
		})
	]
});
