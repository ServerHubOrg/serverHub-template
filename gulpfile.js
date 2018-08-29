const gulp = require('gulp');
const pug = require('gulp-pug');
const sass = require('gulp-sass');
const ts = require('gulp-typescript')
let proj = ts.createProject('tsconfig.json');


gulp.task('pug', function () {
    return gulp.src('src/page/**/*.pug').pipe(pug({
        pretty: true
    })).pipe(gulp.dest('server/view'));
})

gulp.task('sass', function () {
    return gulp.src('src/style/**/*.sass').pipe(sass()).pipe(gulp.dest('server/www/content/'))
})

gulp.task('typescript', function () {
    return gulp.src('src/script/**/*.ts').pipe(proj()).pipe(gulp.dest('server/www/script'));
})

gulp.task('static', function () {
    return gulp.src('src/style/**/*.css').pipe(gulp.dest('server/www/content')) &&
        gulp.src('src/font/**').pipe(gulp.dest('server/www/font')) && gulp.src('src/asset/**').pipe(gulp.dest('server/www/asset'));
})

gulp.task('default', gulp.parallel('pug', 'sass', 'typescript'));

gulp.task('watch', function () {
    gulp.parallel('pug', 'sass', 'typescript', 'static');
    gulp.watch('src/script/**/*.ts', gulp.parallel('typescript'));
    gulp.watch('src/page/**/*.pug', gulp.parallel('pug'));
    gulp.watch('src/style/**/*.sass', gulp.parallel('sass'));
    gulp.watch(['src/style/**/*.css', 'src/font/**','src/asset/**'], gulp.parallel('static'));
})