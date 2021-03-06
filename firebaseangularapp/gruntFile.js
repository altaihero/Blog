module.exports = function (grunt) {

  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-recess');
  grunt.loadNpmTasks('grunt-nodemon');

  // Default task.
  grunt.registerTask('default', ['jshint','build']);
  grunt.registerTask('build', ['clean','concat','copy:libassets', 'copy:css']);
  grunt.registerTask('int-build', ['default', 'copy:server', 'nodemon']);
  

  // Print a timestamp (useful for when watching)
  grunt.registerTask('timestamp', function() {
    grunt.log.subhead(Date());
  });

  var karmaConfig = function(configFile, customOptions) {
    var options = { configFile: configFile, keepalive: true };
    var travisOptions = process.env.TRAVIS && { browsers: ['Firefox'], reporters: 'dots' };
    return grunt.util._.extend(options, customOptions, travisOptions);
  };

  // Project configuration.
  grunt.initConfig({
    distdir: 'dist',
    pkg: grunt.file.readJSON('package.json'),
    banner:
    '/*! <%= pkg.title || pkg.name %> - v<%= pkg.version %> - <%= grunt.template.today("yyyy-mm-dd") %>\n' +
    '<%= pkg.homepage ? " * " + pkg.homepage + "\\n" : "" %>' +
    ' * Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author %>;\n' +
    ' * Licensed <%= _.pluck(pkg.licenses, "type").join(", ") %>\n */\n',
	serverFile: 'server.js',
    nodemon: {
      dev: {
        options: {
          file: '<%= serverFile %>',
          nodeArgs: ['--debug'],
          env: {
            PORT: '8888'
          },
          cwd: '<%= distdir %>'
        }
      }
    },
    src: {
      js: ['src/**/*.js'],
      html: ['src/index.html'],
      css: ['src/css/*.css']
    },
    clean: ['<%= distdir %>/*'],
    copy: {
      libassets: {
        files: [{dest : '<%= distdir %>/lib/css/', src : 'vendor/bootstrap/css/*.*', expand : true, flatten : true},
				{dest : '<%= distdir %>/lib/fonts/', src : 'vendor/bootstrap/fonts/*.*', expand : true, flatten : true},
				{dest : '<%= distdir %>/img/', src : 'src/css/img/**/*.*', expand : true, flatten : true}]
      },
      css: {
        files: [{dest : '<%= distdir %>/', src : '<%= src.css %>', expand : true, flatten : true}]
      },
      server: {
        files: [{dest : '<%= distdir %>/', src : 'server.js', expand : true, flatten : true}]
      }
    },
    concat:{
      dist:{
        options: {
          banner: "<%= banner %>"
        },
        src:['<%= src.js %>'],
        dest:'<%= distdir %>/<%= pkg.name %>.js'
      },
      index: {
        src: ['src/index.html'],
        dest: '<%= distdir %>/index.html',
        options: {
          process: true
        }
      },
      angular: {
        src:['vendor/angular/angular.min.js'],
        dest: '<%= distdir %>/lib/angular.js'
      },
      angularroute: {
        src:['vendor/angular/angular-route.min.js'],
        dest: '<%= distdir %>/lib/angular-route.js'
      },
      angularfire: {
        src:['vendor/angularfire/angularfire.min.js'],
        dest: '<%= distdir %>/lib/angularfire.js'
      },
      firebase: {
        src:['vendor/firebase/firebase.js'],
        dest: '<%= distdir %>/lib/firebase.js'
      },
      firebasesimplelogin: {
        src:['vendor/firebase/firebase-simple-login.js'],
        dest: '<%= distdir %>/lib/firebasesimplelogin.js'
      },
      bootstrap: {
        src:['vendor/bootstrap/*.js'],
        dest: '<%= distdir %>/lib/bootstrap.js'
      },
      jquery: {
        src:['vendor/jquery/*.js'],
        dest: '<%= distdir %>/lib/jquery.js'
      }
    },
    jshint:{
      files:['gruntFile.js', '<%= src.js %>'],
      options:{
        curly:true,
        eqeqeq:true,
        immed:true,
        latedef:true,
        newcap:true,
        noarg:true,
        sub:true,
        boss:true,
        eqnull:true,
        globals:{}
      }
    }
  });

};