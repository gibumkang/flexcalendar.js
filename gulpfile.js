const gulp = require('gulp');
const sass = require('gulp-sass');
const minifyCSS = require('gulp-clean-css');
const browserSync = require('browser-sync');

function sassCompile(cb){
    return gulp.src('app/scss/**/*.scss')
    .pipe(sass())
    .pipe(minifyCSS())
    .pipe(gulp.dest('app/css'))
    cb();
}

function reload(cb){
    browserSync.reload();
    cb();
}

function watch(){
    browserSync.init({
        server: {
            baseDir: './app',
            notify: false,
        }
    });
    //Compile SCSS and reload on save
    gulp.watch('app/scss/**/*.scss', sassCompile);
    gulp.watch('app/scss/**/*.scss', reload);
    //Reload on HTML Save
    gulp.watch('app/*.html', reload);
    //Reload on JS Save
    gulp.watch('app/js/**/*.js', reload)
}

exports.watch = watch;