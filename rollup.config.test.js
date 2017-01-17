import config from './rollup.config.js'

config.treeshake = false
config.targets = [{
 dest: 'dist/viewprt.test.js',
 format: 'cjs'
}]

export default config
