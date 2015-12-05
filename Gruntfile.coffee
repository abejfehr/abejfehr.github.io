#global module:false

"use strict"

module.exports = (grunt) ->
  grunt.loadNpmTasks "grunt-bower-task"
  grunt.loadNpmTasks "grunt-contrib-connect"
  grunt.loadNpmTasks "grunt-contrib-copy"
  grunt.loadNpmTasks "grunt-contrib-watch"
  grunt.loadNpmTasks "grunt-exec"

  grunt.initConfig

    copy:
      jquery:
        files: [{
          expand: true
          cwd: "bower_components/jquery/dist/"
          src: "jquery.min.js"
          dest: "vendor/js/"
        }]
      github:
        files: [{
          expand: true
          cwd: "bower_components/jquery-github/assets/"
          src: ["base.css", "Entypo-webfont.svg", "Entypo-webfont.woff"]
          dest: "vendor/css/"
        },
        {
          expand: true
          cwd: "bower_components/jquery-github/dist/"
          src: "jquery.github.min.js"
          dest: "vendor/js/"
        }]
      fontawesome:
        files: [{
          expand: true
          cwd: "bower_components/components-font-awesome/fonts/"
          src: ["fontawesome-webfont.svg", "fontawesome-webfont.woff"]
          dest: "vendor/fonts/"
        },
        {
          expand: true
          cwd: "bower_components/components-font-awesome/css/"
          src: "font-awesome.min.css"
          dest: "vendor/css/"
        }]

    exec:
      jekyll:
        cmd: "jekyll build --trace"

    watch:
      options:
        livereload: true
      source:
        files: [
          "_drafts/**/*"
          "_includes/**/*"
          "_layouts/**/*"
          "_posts/**/*"
          "_sass/**/*"
          "assets/**/*"
          "css/**/*"
          "js/**/*"
          "_config.yml"
          "*.html"
          "*.md"
        ]
        tasks: [
          "exec:jekyll"
        ]

    connect:
      server:
        options:
          port: 4000
          base: '_site'
          livereload: true

  grunt.registerTask "build", [
    "copy"
    "exec:jekyll"
  ]

  grunt.registerTask "serve", [
    "build"
    "connect:server"
    "watch"
  ]

  grunt.registerTask "default", [
    "serve"
  ]