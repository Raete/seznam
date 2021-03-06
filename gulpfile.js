// Initialize modules
const { src, dest, watch, series, parallel } = require('gulp');
const sourcemaps = require('gulp-sourcemaps');
const sass = require('gulp-sass');
const concat = require('gulp-concat');
const uglify = require('gulp-uglify');
const postcss = require('gulp-postcss');
const autoprefixer = require('autoprefixer');
const cssnano = require('cssnano');
const babel = require('gulp-babel');
const replace = require('gulp-replace');
const htmlmin = require('gulp-html-minifier');


// File paths
const files = { 
    scssPath: 'src/scss/**/*.scss',
    jsPath: 'src/js/**/*.js'
}

// Sass task: compiles the style.scss file into style.css
function scssTask(){    
    return src(files.scssPath)
        .pipe(sourcemaps.init()) // initialize sourcemaps first
        .pipe(sass()) // compile SCSS to CSS
        .pipe(postcss([ autoprefixer(), cssnano() ])) // PostCSS plugins
        .pipe(sourcemaps.write('.')) // write sourcemaps file in current directory
        .pipe(dest('dist')
    ); // put final CSS in dist folder
}

// JS task: concatenates and uglifies JS files to script.js
function jsTask(){
    return src([
        files.jsPath

        ]).pipe(babel({
            presets: ["@babel/preset-env"]
        }))
        .pipe(concat('script.js'))
        .pipe(uglify())
        .pipe(dest('dist')
    );
}


// minify html
function htmlTask() {
    return src(['index.html'])
        .pipe(htmlmin({collapseWhitespace: true, removeComments: true}))
        .pipe(dest('dist'))
}

// Cachebust
var cbString = new Date().getTime();
function cacheBustTask(){
    return src(['index.html'])
        .pipe(replace(/cb=\d+/g, 'cb=' + cbString))
        .pipe(dest('.'));
}

// Watch task: watch SCSS and JS files for changes
function watchTask(){
    watch([files.scssPath, files.jsPath], 
        parallel(scssTask, jsTask));    
}

// Export the default Gulp task so it can be run
exports.default = series(
    parallel(scssTask, jsTask, htmlTask), 
    cacheBustTask,
    watchTask
);