const { src, dest, parallel, watch } = require('gulp');
const pug = require('gulp-pug');
const less = require('gulp-less');
const minifyCSS = require('gulp-csso');
const concat = require('gulp-concat');
const browserSync = require('browser-sync').create();
const connect = require('gulp-connect-php');

function html() {
  return src('src/*.pug')
    .pipe(pug())
    .pipe(dest('build/html'))
}

function css() {
  return src('src/less/*.less')
    .pipe(less())
    .pipe(minifyCSS())
    .pipe(dest('build/css'))
}

function js() {
  return src('src/js/*.js', { sourcemaps: true })
    .pipe(concat('app.min.js'))
    .pipe(dest('build/js', { sourcemaps: true }))
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
            .pipe(less())
            .pipe(dest('src/css'));
        })
    

}

exports.server = server;
exports.js = js;
exports.css = css;
exports.html = html;
exports.default = parallel(html, css, js);