import babel from 'rollup-plugin-babel'

export default {
  entry: 'src/index.js',
  targets: [{
    dest: 'dist/viewprt.js',
    format: 'umd',
    moduleName: 'Viewprt'
  }, {
    dest: 'dist/viewprt.es.js',
    format: 'es'
  }],
  plugins: [
    babel({
      presets: [ ['es2015', { modules: false, loose: true }] ]
    })
  ]
}
