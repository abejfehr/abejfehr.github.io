module.exports = function(grunt) {

  grunt.initConfig({

    pkg: grunt.file.readJSON('package.json'),
    jekyll: {
      prod: {
        options: {
          config: '_config.yml,_config.build.yml'
        }
      }
    }

  });

  grunt.loadNpmTasks('grunt-jekyll');

  grunt.registerTask('default', ['jekyll']);
};
