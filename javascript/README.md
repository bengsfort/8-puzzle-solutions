# JavaScript 8-puzzle solution

## Dependencies

- `yarn`
- `node@v8.11.1`

## Commands

- `yarn lint`: Lints the codebase
- `yarn lint:fix`: Fixes any auto-fixable linting errors
- `yarn start`: Builds and then runs the built app against a test puzzle
- `yarn test`: Runs the test suite (mocha)
- `yarn build`: Build the codebase via babel
- `yarn clean`: Clean the build directory

Besides `yarn start` you can run `yarn build` to build the codebase, and then run it against a puzzle file via:

`node ./build/index.js ./path/to/puzzle.txt`
