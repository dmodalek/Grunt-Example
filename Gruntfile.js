'use strict';

module.exports = function (grunt) {

	// Dynamically load npm tasks, instead of adding each plugin manually

	require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);

	grunt.initConfig({

		pkg: grunt.file.readJSON('package.json'),

		// Banner to be prepended before generated files

		banner: '\n/*\n * Generated with Grunt on <%= grunt.template.today("dd.mm.yyyy") %> at <%= grunt.template.today("H:MM:ss") %>\n */\n',

		///////////////////////////////////////////////////////////

		/*
		 * Create a .less file including @imports for all .less files
		 * https://github.com/MarcDiethelm/grunt-less-imports
		 */

		less_imports: {
			all: {
				src: 'css/*.less',
				dest: 'built/less-imports.less'
			}
		},

		/*
		 * Compile Less to CSS
		 * https://github.com/gruntjs/grunt-contrib-less
		 */

		less: {
			options: {
				sourceMap: true,
				sourceMapFilename: 'built/styles.css.map',
				sourceMapRootpath: '../',
				sourceMapBasepath: ''
			}, all: {
				src: 'built/less-imports.less',
				dest: 'built/styles.css'
			}
		},

		/*
		 * Add vendor prefixes to CSS3 selectors
		 * https://github.com/nDmitry/grunt-autoprefixer
		 */

		autoprefixer: {
			options: {
				cascade: true
			},
			all: {
				src: 'built/styles.css',
				dest: 'built/styles.css'
			}
		},

		/*
		 * Minify CSS
		 * https://github.com/gruntjs/grunt-contrib-cssmin
		 */

		cssmin: {
			min: {
				options: {
					banner: '<%= banner %>'
				},
				files: {
					'built/styles.min.css': 'built/styles.css'
				}
			}
		},

		/*
		 * Validate Javascript files
		 * https://github.com/gruntjs/grunt-contrib-jshint
		 */

		jshint: {
			options: {
				curly: true,
				eqeqeq: true,
				eqnull: true,
				browser: true,
				globals: {
					jQuery: false
				}
			},
			files: 'js/*.js'
		},

		/*
		 * Concatinate and minify Javascript files
		 * https://github.com/gruntjs/grunt-contrib-uglify
		 */

		uglify: {

			dev: {
				options: {
					banner: '<%= banner %>',
					beautify: true,
					sourceMap: true,
					sourceMapName: 'built/scripts.js.map'
				},

				files: {
					'built/scripts.js': ['js/*.js']
				}
			},

			min: {
				options: {
					banner: '<%= banner %>',
					sourceMap: 'built/scripts.js.map',
					sourceMapRoot: '../',
					sourceMappingURL: 'scripts.min.js.map'
				},

				files: {
					'built/scripts.min.js': ['js/*.js']
				}
			}
		},

		/*
		 * Delete unused files
		 * https://github.com/gruntjs/grunt-contrib-clean
		 */

		clean: {
			src: ['built/less-imports.less']
		},

		///////////////////////////////////////////////////////////

		/*
		 * Watch Folders and run build process on changes
		 * https://github.com/gruntjs/grunt-contrib-watch
		 */

		watch: {
			scripts: {
				files: ['Gruntfile.js', 'js/*.js'],
				tasks: ['scripts']
			},
			styles: {
				files: ['Gruntfile.js', 'css/*.less'],
				tasks: ['styles']
			},
			livereload: {
				options: {
					livereload: 35729
				},
				files: [
					'Gruntfile.js',
					'css/*.less',
					'js/*.js',
					'*.html',
				]
			}
		}
	});


	///////////////////////////////////////////////////////////

	// Default - Dev Task

	grunt.registerTask('default', [
		'styles',
		'scripts',
		'watch'
	]);

	// Minify assets

	grunt.registerTask('min', [
		'uglify:min',
		'cssmin'
	]);

	// Sub Tasks

	grunt.registerTask('styles', [
		'less_imports',
		'less',
		'autoprefixer',
		'clean'
	]);

	grunt.registerTask('scripts', [
		'jshint',
		'uglify:dev'
	]);

};
