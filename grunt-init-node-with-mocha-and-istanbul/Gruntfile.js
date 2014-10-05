"use strict";

module.exports = function(grunt) {

  grunt.initConfig({

    mochacli: {
      options: {
        require: [
          "should"
        ],

        reporter: "nyan",
        bail: true
      },

      all: [
        "test/**/*.js"
      ]
    },

    jshint: {
      options: grunt.file.readJSON(".jshintrc"),

      gruntfile: {
        src: "Gruntfile.js"
      },

      lib: {
        src: [
          "lib/**/*.js"
        ]
      },

      test: {
        options: {
          globals: {
            "describe": true,
            "it": true
          }
        },

        src: [
          "test/*.js"
        ]
      }
    },

    watch: {
      gruntfile: {
        files: "<%= jshint.gruntfile.src %>",
        tasks: [ "jshint:gruntfile" ]
      },

      lib: {
        files: "<%= jshint.lib.src %>",
        tasks: [ "jshint:lib", "test" ]
      },

      test: {
        files: "<%= jshint.test.src %>",
        tasks: [ "jshint:test", "test" ]
      }
    },

    // Configuration for grunt-istanbul.
    instrument: {
      files: "<%= jshint.lib.src %>",

      options: {
        basePath: "build/instrument/"
      }
    },

    reloadTasks: {
      rootPath: "build/instrument/lib"
    },

    storeCoverage : {
      options: {
        dir: "build/reports/"
      }
    },

    makeReport : {
      src : "build/reports/**/*.json",

      options : {
        type : [ "lcov" ],
        print : "detail",

        dir : "build/reports/"
      }
    }

  });

  grunt.loadNpmTasks("grunt-contrib-jshint");
  grunt.loadNpmTasks("grunt-contrib-watch");

  grunt.loadNpmTasks("grunt-mocha-cli");
  grunt.loadNpmTasks("grunt-istanbul");

  grunt.registerTask("test",        [ "mochacli" ]);
  grunt.registerTask("coverage",    [ "instrument", "reloadTasks", "test", "storeCoverage", "makeReport" ]);

  grunt.registerTask("default",     [ "jshint", "test", "coverage" ]);
};