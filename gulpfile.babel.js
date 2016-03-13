/* eslint-disable no-undef, no-console, arrow-body-style */
import bg from 'gulp-bg';
import eslint from 'gulp-eslint';
import gulp from 'gulp';
import mochaRunCreator from './test/mochaRunCreator';
import path from 'path';
import shell from 'gulp-shell';
import runSequence from 'run-sequence';

// To fix some eslint issues: gulp eslint --fix
const runEslint = () => {
  return gulp.src([
    'gulpfile.babel.js',
    'src/**/*.js'
  ], { base: './' })
    .pipe(eslint({ fix: false }))
    .pipe(eslint.format());
};

gulp.task('eslint', () => runEslint());

// Exit process with an error code (1) on lint error for CI build.
// gulp.task('eslint-ci', () => runEslint().pipe(eslint.failAfterError()));

gulp.task('mocha', done => {
  mochaRunCreator('', done)();
});

// Enable to run single test file
// ex. gulp mocha-file --file src/browser/components/__test__/Button.js
// gulp.task('mocha-file', () => {
//   mochaRunCreator('process')({ path: path.join(__dirname, args.file) });
// });

// Continuous test running
// gulp.task('mocha-watch', () => {
//   gulp.watch(
//     ['src/browser/**', 'src/common/**', 'src/server/**'],
//     mochaRunCreator('log')
//   );
// });

gulp.task('test', done => {
  runSequence('eslint', 'mocha', done);
});

gulp.task('consumer', bg('node', './src/server/consumer'));
gulp.task('producer', bg('node', './src/server/producer'));
gulp.task('consumer-nodemon', shell.task(
  // Normalize makes path cross platform.
  path.normalize('node_modules/.bin/nodemon src/server/consumer')
));
gulp.task('producer-nodemon', shell.task(
  // Normalize makes path cross platform.
  path.normalize('node_modules/.bin/nodemon src/server/producer')
));

// Default task to start development. Just type gulp.
gulp.task('default', ['consumer']);
