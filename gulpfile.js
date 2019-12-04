const { src, dest, parallel, watch } = require('gulp');
const pug = require('gulp-pug');
const less = require('gulp-less');
const minifyCSS = require('gulp-csso');
const concat = require('gulp-concat');
const browserSync = require('browser-sync').create();
const connect = require('gulp-connect-php');
const gulpUtil = require('gulp-util');

function html() {
  return src('src/*.pug')
    .pipe(pug())
    .pipe(dest('dist/html'))
}

function css() {
  return src('src/less/*.less')
    .pipe(less())
    .pipe(minifyCSS())
    .pipe(dest('dist/css'))
}

function js() {
  return src('src/js/*.js', { sourcemaps: true })
    .pipe(concat('app.min.js'))
    .pipe(dest('dist/js', { sourcemaps: true }))
}

function server(){
    connect.server();
    
    browserSync.init({
      server: {
          baseDir: 'src'
      }
    });

    watch('src/**/*').on('change', browserSync.reload);

    watch(['src/js/**/*.js'])
      .on('change', function(event) {
        console.log("Linting " + event.path);
        src(event.path)
            .pipe(jshint({esversion: 6}))
            .pipe(jshint.reporter(jshintStylish));
      });


    watch(['src/css/**/*.css']);

    watch('src/img/**/*').on('change', (event)=> {
       src(event.path)
            .pipe( dest('src/img'));
    })

    watch(['src/less/**/*.less'])
      .on('change', ()=>{ 
          return src('src/less/*.less', ['less'])
          .pipe(less().on('error', err =>{
            // console.log(err);
            
            var fileError = err.fileName.split('\\').splice(-1); 
            var line = err.line;
            var resErro = err.extract;
            console.log(`File erro = ${fileError} line = ${line} error = ${resErro} `)
            // gulpUtil.log(err) 
          }))
          .pipe(dest('src/css'));
      })
}

exports.server = server;
exports.js = js;
exports.css = css;
exports.html = html;
exports.default = parallel(html, css, js);