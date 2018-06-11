module.exports = function (grunt) {

	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		contentDir: 'content/',
		jsSrc: [
			'<%= contentDir %>js/**/*.js',
			//excludes
			'!<%= contentDir %>js/_libs/**/*.js'
		],
		sassSrc: [
			'<%= contentDir %>scss/*.scss',
			//excludes
			'!<%= contentDir %>scss/*/*.scss',
			'!<%= contentDir %>scss/_*.scss'
		],

		sass: {
			dist: {
				options: {
					style: 'compressed'
				},
				expand: true,
				flatten: true,
				src: '<%= sassSrc %>',
				dest: '<%= contentDir %>css/',
				ext: '.css'
			}
		},

		jshint: {
			all: ['Gruntfile.js', '<%= jsSrc %>']
		},

		watch: {
			sass: {
				files: '<%= contentDir %>scss/**/*.scss',
				tasks: 'sass:dist'
			}

		}

	});

	grunt.loadNpmTasks('grunt-contrib-sass');
	grunt.loadNpmTasks('grunt-contrib-watch');

};