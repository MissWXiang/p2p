//引入gulp文件
var gulp = require('gulp');

//引入插件
var uglify = require('gulp-uglify');
var cleanCss = require('gulp-clean-css');
var less = require('gulp-less');
var imagemin = require('gulp-imagemin');
var rename = require('gulp-rename');

//压缩js
gulp.task('uglify',() =>{
    gulp
        .src('./js/index.js')
        .pipe(uglify())
        .pipe(rename({
            suffix:".min"
        }))
        .pipe(gulp.dest('./dist/js/'))
})

//解析less
gulp.task('less',() =>{
    gulp
        .src('./styles/less/index.less')
        .pipe(less())
        .pipe(gulp.dest('./styles/css/'))
})

//压缩css
gulp.task('cleanCss',() =>{
    gulp
        .src('./styles/css/index.css')
        .pipe(cleanCss())
        .pipe(rename({
            suffix:".min"
        }))
        .pipe(gulp.dest('./dist/css/'))
})

//压缩图片
gulp.task("imagemin",()=>{
    gulp
        .src('./images/**')
        .pipe(imagemin())
        .pipe(gulp.dest('./dist/images/'))
})

//观察者
gulp.task('default',()=>{
    gulp.watch('./js/index.js',['uglify']);
    gulp.watch('./styles/less/*.less',['less']);
    gulp.watch('./styles/css/index.css',['cleanCss']);
})