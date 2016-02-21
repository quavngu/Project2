module.exports = function ( grunt ) {
 grunt.loadNpmTasks('grunt-contrib-jshint');
grunt.loadNpmTasks('grunt-css');
grunt.loadNpmTasks('grunt-contrib-concat');
 var taskConfig = {
   jshint: {
     src: ['src/**/*.js'],
     gruntfile: ['Gruntfile.js'],
     options: {
      curly:  true,
      immed:  true,
      newcap: true,
      noarg:  true,
      sub:    true,
      boss:   true,
      eqnull: true,
      node:   true,
      undef:  true,
      globals: {
        _:       false,
        jQuery:  false,
        angular: false,
        moment:  false,
        console: false,
        $:       false,
        io:      false
      }
     }
   },
  concat: {
  js: {
    src: [
    'src/**/*.js',
    'src/*.js'
    ],
    dest: 'dest/concat.js'
    },
  css: {
    src: 'src/css/*.css',
    dest: 'dest/concat.css'
    }
},

cssmin: {
  js: {
    src: 'dest/concat.js',
    dest: 'dest/concat.min.js'
  },
  css:{
    src: 'dest/concat.css',
    dest: 'dest/concat.min.css'
  }
}
 };
 grunt.initConfig(taskConfig);
 grunt.registerTask('default', ['jshint', 'concat', 'cssmin']);
};