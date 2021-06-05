const policyScripts = {
    precompile: "inprint && ycplmon2 fix src && eslint src --fix --quiet",
    precompile_full: "npm run precompile && prettier src --write",
    "clean:cjs": "yb clean_cjs",
    "build:cjs":
        'npm run clean:cjs && babel src --config-file ./babel.cjs.config.cjs --out-dir lib/cjs --extensions ".ts,.tsx,.js,.jsx" --source-maps && node cjs_require.test.cjs && echo cjs require is ok!',
    "watch:cjs":
        'npm run clean:cjs && babel src --config-file ./babel.cjs.config.cjs --out-dir lib/cjs --extensions ".ts,.tsx,.js,.jsx" --source-maps -w',
    "clean:esm": "yb clean_esm",
    "build:esm":
        'npm run clean:esm && babel src --config-file ./babel.esm.config.cjs --out-dir lib/esm --extensions ".ts,.tsx,.js,.jsx" --source-maps && node mjs_import.test.mjs && echo mjs import is ok!',
    "watch:esm":
        'npm run clean:esm && babel src --config-file ./babel.esm.config.cjs --out-dir lib/esm --extensions ".ts,.tsx,.js,.jsx" --source-maps -w',
    "clean:types": "yb clean_types",
    "build:types": "npm run clean:types && tsc -p tsconfig-declarations.json",
    "watch:types": "npm run clean:types && tsc -p tsconfig-declarations.json -w",
    "clear:docs": "rm -rf docs/*",
    "build:docs": "api-extractor run --local && api-documenter markdown --input-folder temp --output-folder docs",
    "clean:all": "rm -rf dist/* && yb clean_all && npm run clear:docs",
    "clean:ts": "yb clean_ts",
    "build:ts": "npm run clean:ts && tsc",
    build: "npm run precompile_full && npm run clean:all && npm run build:esm && npm run build:cjs && npm run build:types && npm run build:docs && npm run lint && npm run test",
    test_module: "node cjs_require.test.cjs && node mjs_import.test.mjs && echo ok",
    test: "npm run test_module && jest",
    storybook: "start-storybook -p 6006",
    "build-storybook": "build-storybook",
    tsc: "npm run build:ts",
    lint: "npx eslint . --ext .js,.jsx,.ts,.tsx",
    republish: "npm run build && npx version-select && npx genversion --es6 --semi version.js && npm publish",
};
const ignoredScipts = [];

module.exports = {
    filename: "package.json",
    generate: (packageJson, policyOptions, prevContent) => {
        try {
            const j = JSON.parse(prevContent);

            for (const k in policyScripts) j.scripts[k] = policyScripts[k];

            for (const k in j.scripts)
                if (!policyScripts[k] && !ignoredScipts?.includes?.(k) && !policyOptions?.ignoredScipts?.includes?.(k)) delete j.scripts[k];

            return newContent;
        } catch (e) {
            console.error(`CODE00000000 Failed to parse package.json`, e);
            return prevContent;
        }
    },
};
