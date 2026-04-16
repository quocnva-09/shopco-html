const { src, dest, watch, series } = require('gulp');
const sass = require('gulp-sass')(require('sass'));
const autoprefixer = require('gulp-autoprefixer');
const sourcemaps = require('gulp-sourcemaps');

function buildStyles() {
  return src('src/scss/**/*.scss')
    //compress scss to css
    .pipe(sass({ outputStyle: 'compressed' }).on('error', sass.logError))
    //export ra folder build/css
    .pipe(dest('build/css'));
}

function watchTask() {
  //thiết lập trigger thay đổi scss sang css khi có thay đổi
  watch(['src/scss/**/*.scss'], series(buildStyles));
}

//tạo lệnh default cho npx gulp với 2 hàm truyền vào
exports.default = series(buildStyles, watchTask);