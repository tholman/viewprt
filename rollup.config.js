import babel from 'rollup-plugin-babel'

export default {
  plugins: [ 
    babel({
      presets: ['es2015-rollup'],
      plugins: [ ['transform-es2015-classes', { loose: true }] ]
    })
  ]
}
