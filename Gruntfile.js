module.exports = function(grunt) {
    
    grunt.initConfig({
      /*concat: {
        options: {
          separator: ';',
        },
        dist: {
          src: ['src/intro.js', 'src/project.js', 'src/outro.js'],
          dest: 'dist/built.js',
        },
      },*/
        watch: {
            scripts: {
            files: '**/*.js',
            //tasks: ['sass'],
            options: {
              livereload: {
                host: 'localhost',
                port: 3000,
                //key: grunt.file.read('path/to/ssl.key'),
                //cert: grunt.file.read('path/to/ssl.crt')
                // you can pass in any other options you'd like to the https server, as listed here: http://nodejs.org/api/tls.html#tls_tls_createserver_options_secureconnectionlistener 
              }
            },
          },
            css: {
            files: '**/*.sass',
            //tasks: ['sass'],
            options: {
              livereload: {
                host: 'localhost',
                port: 3000,
                //key: grunt.file.read('path/to/ssl.key'),
                //cert: grunt.file.read('path/to/ssl.crt')
                // you can pass in any other options you'd like to the https server, as listed here: http://nodejs.org/api/tls.html#tls_tls_createserver_options_secureconnectionlistener 
              }
            },
          },
        },
    });
    
    grunt.loadNpmTasks('grunt-contrib-watch');
};