// prettier-ignore
const policyPackageJsonFunc = ({
                                   packageName,
                                   private,
                                   react,
                                   testModuleImports,
                                   useRollup
})=>({
    "main": "lib/cjs/index.js",
    "module": "lib/esm/index.js",
    "type":undefined,
    "exports": {
        ".": {
            "import": "./lib/mjs/index.js",
            "require": "./lib/cjs/index.js"
        }
    },
    "typings": "lib/types/index.d.ts",
    "scripts": {
        "start": "node lib/cjs/start.js",
        "precompile": "inprint && ycplmon2 fix src && eslint src --fix --quiet",
        "precompile_full": "npm run precompile && prettier src --write",
        "clean:cjs": "yb clean_cjs",
        "build:cjs": `npm run clean:cjs && babel src --config-file ./babel.cjs.config.cjs --out-dir lib/cjs --extensions \".ts,.tsx,.js,.jsx\" --source-maps ${testModuleImports?`&& node cjs_require.test.cjs && echo cjs require is ok!`:""}`,
        "watch:cjs": "npm run clean:cjs && babel src --config-file ./babel.cjs.config.cjs --out-dir lib/cjs --extensions \".ts,.tsx,.js,.jsx\" --source-maps -w",
        "watch:test:cjs": `${testModuleImports?`npm run test_module && `:""}${true?`npm run build:cjs && `:""}jest --config=jest.config-cjs.cjs --passWithNoTests -w`,
        "clean:esm": "yb clean_esm",
        "build:esm": `npm run clean:esm && babel src --config-file ./babel.esm.config.cjs --out-dir lib/esm --extensions \".ts,.tsx,.js,.jsx\" --source-maps ${testModuleImports?`&& node mjs_import.test.mjs && echo mjs import is ok!`:""}`,
        "watch:esm": "npm run clean:esm && babel src --config-file ./babel.esm.config.cjs --out-dir lib/esm --extensions \".ts,.tsx,.js,.jsx\" --source-maps -w",
        "clean:types": "yb clean_types",
        "build:types": "npm run clean:types && tsc -p tsconfig-declarations.json",
        "watch:types": "npm run clean:types && tsc -p tsconfig-declarations.json -w",
        "clear:docs": "yb clean_docs",
        "build:docs": "api-extractor run --local && api-documenter markdown --input-folder temp --output-folder docs",
        "clean": "yb clean_all && npm run clear:docs",
        "clean:ts": "yb clean_ts",
        "build:ts": "npm run clean:ts && tsc",
        "build": "npm run precompile_full && npm run clean && npm run build:esm && npm run build:cjs && npm run build:types && npm run lint && npm run test && npm run build:docs",
        ...(testModuleImports?{"test_module": "node cjs_require.test.cjs && node mjs_import.test.mjs && echo ok",}:{}),
        "test:cjs": `${testModuleImports?`npm run test_module && `:""}${true?`npm run build:cjs && `:""}jest --config=jest.config-cjs.cjs --passWithNoTests`,
        "test:ts": `${testModuleImports?`npm run test_module && `:""}jest --config=jest.config-ts.cjs --passWithNoTests`,
        "test": `${testModuleImports?`npm run test_module && `:""}jest --config=jest.config-ts.cjs --passWithNoTests`,
        ...(react?{
            "storybook": "start-storybook -p 6006",
            "build-storybook": "build-storybook",
        }:{}),
        "tsc": "npm run build:ts",
        "lint": "npx eslint . --ext .js,.jsx,.ts,.tsx",
        "republish": "npm run build && npx version-select && yb genprojmeta && npm publish",
        "deps": "echo Finding loops in .js requires... & del deps.png & madge dist -c -i deps.png && deps.png",
        "deps_all": "echo Generating full .js requires tree... & del deps.png & madge dist -i deps.png && deps.png",
        "deps_orphans": "echo Finding orphans .js requires... & del deps.png & madge dist --orphans -i deps.png && deps.png",
    },
    "author": "Yuri Yaryshev",
    "homepage": (!private? `https://github.com/yuyaryshev/${packageName}`: `http://git.yyadev.com/yuyaryshev/${packageName}.git`),
    "repository": {
        "type": "git",
        "url": (!private? `https://github.com/yuyaryshev/${packageName}`: `http://git.yyadev.com/yuyaryshev/${packageName}.git` )
    },
    "license": (!private? "Unlicense" : "Private"),
    "publishConfig": {
        "registry": (!private? "http://registry.npmjs.org" : "http://yyadev.com:4873/")
    },
    "devDependencies": {
        "@babel/cli": "7.14.3",
        "@babel/core": "7.14.3",
        "@babel/node": "^7.14.2",
        "@babel/parser": "7.14.4",
        "@babel/plugin-proposal-class-properties": "^7.13.0",
        "@babel/plugin-proposal-decorators": "^7.14.2",
        "@babel/plugin-proposal-object-rest-spread": "^7.14.4",
        "@babel/plugin-proposal-optional-chaining": "7.14.2",
        "@babel/plugin-transform-modules-commonjs": "^7.14.0",
        "@babel/plugin-transform-typescript": "^7.14.4",
        "@microsoft/api-documenter": "^7.13.12",
        "@microsoft/api-extractor": "^7.15.2",
...(useRollup?{
    "@rollup/plugin-commonjs": "^19.0.0",
    "@rollup/plugin-node-resolve": "^13.0.0",
    "@rollup/plugin-typescript": "^8.2.1",
    "rollup": "^2.50.4",
}:{}),
        "sinon": "^11.1.1",
        "@types/sinon": "^10.0.2",
        "@types/jest": "^26.0.23",
        "@typescript-eslint/eslint-plugin": "^4.25.0",
        "@typescript-eslint/parser": "^4.25.0",
        "babel-loader": "^8.2.2",
        "babel-plugin-inline-replace-variables": "^1.3.1",
        "babel-plugin-module-resolver": "^4.1.0",
        "babel-watch": "^7.4.1",
        "eslint": "^7.27.0",
        "eslint-config-prettier": "^8.3.0",
        "eslint-plugin-import": "^2.23.4",
        "eslint-plugin-jsdoc": "^35.0.0",
        "eslint-plugin-sonarjs": "^0.7.0",
        "eslint-plugin-tsdoc": "^0.2.14",
        "inprint": "^1.2.10",
        "javascript-stringify": "^2.1.0",
        "jest": "^27.0.3",
        "ts-jest": "^27.0.1",
        "jest-ts-webcompat-resolver": "^1.0.0",
        "json5": "^2.2.0",
        "prettier": "^2.3.0",
        "pretty-quick": "^3.1.0",
        "tslib": "^2.2.0",
        "typescript": "^4.3.2",
        "cross-env": "^7.0.3",
        "modify-filepath": "*",
        ...(react?{
            "@storybook/react": "^6.2.9",
            "@storybook/addon-actions": "^6.2.9",
            "@storybook/addon-essentials": "^6.2.9",
            "@storybook/addon-links": "^6.2.9",
            "@testing-library/react": "^11.2.6",
            "@types/react": "^17.0.2",
            // "react": "^17.0.2",
            // "react-dom": "^17.0.2",
            // "react-is": "^17.0.2"
        }:{})
    },
});

const ignored = {
    scripts: [],
};

function enforceObject(j, prop, policyPackageJson, policyOptions) {
    //    console.log(`CODE00000000 enforceObject.${prop}`);
    if (!(prop in policyPackageJson)) return;
    if (typeof policyPackageJson[prop] === "undefined") {
        delete j[prop];
    } else if (typeof policyPackageJson[prop] === "object") {
        if (!j[prop]) j[prop] = {};
        for (const k in policyPackageJson[prop]) j[prop][k] = policyPackageJson[prop][k];
        for (const k in j[prop])
            if (!policyPackageJson[prop][k] && !ignored?.[prop]?.includes?.(k) && !policyOptions?.packageJson?.ignored?.[prop]?.includes?.(k) && !prop.startsWith("@types/"))
                delete j[prop][k];
    } else {
        j[prop] = policyPackageJson[prop];
    }
}

const enforcedProps = [
    "name",
    "version",
    "keywords",
    "description",
    "author",
    "type",
    "main",
    "module",
    "exports",
    "typings",
    "homepage",
    "repository",
    "license",
    "publishConfig",
    "jest",
    "scripts",
    "resolutions",
    "devDependencies",
    "peerDependencies",
    "dependencies",
];

function reorderPackageJson(j) {
    const j2 = {};
    for (let k of enforcedProps) j2[k] = j[k];
    for (let k in j) if (!enforcedProps.includes(k)) j2[k] = j[k];
    return j2;
}

module.exports = {
    filename: "package.json",
    generate: (packageJson_UNUSED, policyOptions, prevContent) => {
        try {
            let policyPackageJson = require("./package.json");
            const { testModuleImports } = policyOptions;

            const j = JSON.parse(prevContent);
            const genPackageJson = policyPackageJsonFunc({
                private: j.name.includes("@yuyaryshev/"),
                packageName: j.name.split("@yuyaryshev/").join(""),
                react: !!JSON.stringify([j.dependencies, j.peerDependencies]).includes("react"),
                testModuleImports,
            });

            // Copy package versions from original package.json
            for (const k in genPackageJson.devDependencies)
                genPackageJson.devDependencies[k] = policyPackageJson.devDependencies[k] || genPackageJson.devDependencies[k];

            // Write to original package.json missing packages
            {
                let additionToPolicy = {};
                for (const k in genPackageJson.devDependencies)
                    if (!policyPackageJson.devDependencies[k]) additionToPolicy[k] = genPackageJson.devDependencies[k];
                if (Object.keys(additionToPolicy).length)
                    console.warn(
                        `CODE00000000 Not all packages are added to policies package.json. Without it old versions from .gen file will be used. Add them:\n`,
                        JSON.stringify(additionToPolicy, undefined, "    "),
                        "\n",
                    );
            }

            for (const prop of enforcedProps) enforceObject(j, prop, genPackageJson, policyOptions);

            const reorderedPolicyPackageJson = reorderPackageJson(j);
            const newContent = JSON.stringify(reorderedPolicyPackageJson, undefined, "    ");
            //            console.log(`CODE00000000 newContent = \n`, newContent);
            return newContent;
        } catch (e) {
            console.error(`CODE00000000 Failed to parse package.json`, e);
            return prevContent;
        }
    },
};
