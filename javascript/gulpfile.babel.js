import * as childProcess from "child_process";
import gulp from "gulp";
import babel from "gulp-babel";
import concat from "gulp-concat";
import uglify from "gulp-uglify";
import rename from "gulp-rename";

gulp.task( 'build', () => {
    var scriptDirs = [
        '',
        'classes/'
    ];

    scriptDirs.map( (dir) => {
        return gulp.src( `src/${dir}*.js` )
              .pipe( babel() )
//              .pipe( uglify() )
              .pipe( gulp.dest(`build/${dir}`) )
              .on('end', (file) => console.log(`        Built: src/${dir}`));
    });
});

gulp.task( 'watch', () => gulp.watch( 'src/**/*', ['build'] ));

gulp.task( 'run', () => {
    return childProcess.execFile( 'build/index.js', ['puzzles/testPuzzle.txt'], (stdout) => console.log(`Test run complete: \n${stdout}`));
});

gulp.task( 'default', ['build'] );
