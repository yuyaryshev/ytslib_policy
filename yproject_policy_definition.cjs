const { outputFileSync, existsSync, readFileSync } = require(`fs-extra`);
const execa = require("execa");
const shelljs = require("shelljs");
const packageJsonGen = require("./packageJson.gen.cjs");

module.exports.policy = "ytslib_policy";
module.exports.options = {
    exclude: [
        "cjs_require.test.cjs",
        "mjs_import.test.mjs",
        "version.js",
        "LICENSE",
        "README.md",
        "README_yya.md",
        "my_wins.json",
        "private_example.json",
        "settings_example.json",
        "private_example.js",
        "settings_example.js",
        "private_example.cjs",
        "settings_example.cjs",
        "private.json",
        "private.js",
        "private.cjs",
        "settings.json",
        "settings.js",
        "settings.cjs",
        "example.cjs",
        "temp.cjs",
		"cpl.json",
    ], // exclude specified folders and files from projects
    // policy options here
};
module.exports.create = async function create(configFileName) {
    console.log(`CODE00000000 Entering ytslib_policy.create`);
    const stdMessage = `You can only use 'yproject_policy -create ytslib_policy' in cloned and initialized with readme.md file and without package.json`;
    if (existsSync("package.json")) {
        console.error(`CODE00000000 ${stdMessage}`);
        return;
    }

    const { stdout: gitRepo } = await execa("git", "config --get remote.origin.url".split(" "));
    if (gitRepo === "undefined") {
        console.error(`CODE00000000 ${stdMessage}`);
        return;
    }

    const readmeMd = readFileSync("./README.md", "utf-8");
    if (readmeMd?.length <= 0) {
        console.error(`CODE00000000 ${stdMessage}`);
        return;
    }

    const description = readmeMd.split("#")[1].split("\n").slice(1).join("\n").trim();
    const gitRepoBaseUrl = gitRepo.substr(0, gitRepo.length - 4);
    const name = gitRepoBaseUrl.split("/").slice(-1)[0];

    // console.log(`CODE00000003`);
    // console.log(`CODE00000004`, {gitRepo, name, description, gitRepoBaseUrl});
    // console.log(`CODE00000005`);

    const packageJsonContent0 = {
        name,
        version: "0.0.1",
        description,
        repository: {
            type: "git",
            url: `git+${gitRepo}`,
        },
        keywords: name.split("-"),
        bugs: {
            url: `${gitRepoBaseUrl}/issues`,
        },
        homepage: `${gitRepoBaseUrl}#readme`,
    };
    const packageJsonContent = packageJsonGen.generate({}, {}, JSON.stringify(packageJsonContent0));

    outputFileSync("package.json", packageJsonContent, "utf-8");

    outputFileSync(
        "src/index.ts",
        `
// @INPRINT_START {exclude:["start"]}
// @INPRINT_END
    `.trim(),
        "utf-8",
    );

    outputFileSync(
        "src/hello.ts",
        `
export function hello() {
    const m = "ytslib_policy package '${name}' started successfully!";
    console.log(m);
    return m;
}
    `.trim(),
        "utf-8",
    );

    outputFileSync(
        "src/example.test.ts",
        `
import { hello } from "./hello.js";
import { expect } from "chai";

describe(\`example.test.ts\`, () => {
    it(\`example.test.ts\`, () => {
        expect(hello()).to.deep.equal("ytslib_policy package '${name}' started successfully!");
    });
});

    `.trim(),
        "utf-8",
    );

    outputFileSync(
        "src/start.ts",
        `
import { hello } from "./hello.js";
hello();
    `.trim(),
        "utf-8",
    );

    await finalRuns();
};

async function finalRuns() {
    let passedRuns = 0;

    const { stdout: yproject_policy_stdout } = await shelljs.exec("yproject_policy");
    function check_yproject_policy_stdout() {
        if (!yproject_policy_stdout.includes(`checkProject - completed`)) {
            console.error(`    STEP yproject_policy - didn't output 'checkProject - completed'`);
            return 0;
        }
        console.log(`    STEP yproject_policy - OK`);
        return 1;
    }
    passedRuns += check_yproject_policy_stdout();

    const { stdout: pnpmi_stdout } = await shelljs.exec("pnpm i");
    function check_pnpmi_stdout() {
        if (!pnpmi_stdout.trim().includes(", done")) {
            console.error(`    STEP pnpm i - didn't output 'done' - something is wrong with pnpm. Is pnpm installed?`);
            return 0;
        }
        console.log(`    STEP pnpm i - OK`);
        return 1;
    }
    passedRuns += check_pnpmi_stdout();

    const { stdout: build_stdout } = await shelljs.exec("npm run build");
    function check_build_stdout() {
        if (!build_stdout.trim().includes("Successfully compiled 4")) {
            console.error(`    STEP npm run build - didn't output 'Successfully compiled 4' - something is wrong with Babel compilation`);
            // outputFileSync("build_stdout.log", build_stdout,"utf-8");
            return 0;
        }

        if (!build_stdout.trim().includes("API Extractor completed successfully")) {
            console.error(
                `    STEP npm run build - didn't output 'API Extractor completed successfully' - something went wrong with auto-documentation compilation.`,
            );
            // outputFileSync("build_stdout.log", build_stdout,"utf-8");
            return 1;
        }
        console.log(`    STEP npm run build - OK`);
        return 2;
    }
    passedRuns += check_build_stdout();

    const { stdout: test_cjs_stdout } = await shelljs.exec("npm run test:cjs");
    function check_test_cjs_stdout() {
        if (!test_cjs_stdout.trim().includes(`ytslib_policy package '${name}' started successfully!`)) {
            console.error(`    STEP npm run test - something is wrong with the tests. Rerun 'npm run test' and review the errors`);
            // outputFileSync("test_cjs_stdout.log", test_cjs_stdout, "utf-8");
            return 0;
        }
        console.log(`    STEP npm run test:cjs - OK`);
        return 1;
    }
    passedRuns += check_test_cjs_stdout();

    const { stdout: test_ts_stdout } = await shelljs.exec("npm run test:ts");
    function check_test_ts_stdout() {
        if (!test_ts_stdout.trim().includes(`ytslib_policy package '${name}' started successfully!`)) {
            console.error(`    STEP npm run test - something is wrong with the tests. Rerun 'npm run test' and review the errors`);
            // outputFileSync("test_ts_stdout.log", test_ts_stdout, "utf-8");
            return 0;
        }
        console.log(`    STEP npm run test:ts - OK`);
        return 1;
    }
    passedRuns += check_test_ts_stdout();

    const { stdout: start_stdout } = await shelljs.exec("npm run start");
    function check_start_stdout() {
        if (!start_stdout.trim().includes(`ytslib_policy package '${name}' started successfully!`)) {
            console.error(`    STEP npm run start - didn't output correctly`);
            // outputFileSync("start_stdout.log", start_stdout, "utf-8");
            return 0;
        }
        console.error(`    STEP npm run start - OK`);
        return 1;
    }
    passedRuns += check_start_stdout();

    console.log("\n\n\n");

    const MAX_SCORE = 7;
    if (passedRuns === MAX_SCORE) console.log(`CODE00000000 SUMMARY: all done successfully!`);
    else {
        console.error(`CODE00000000 SUMMARY: Some problems above. Score: ${passedRuns} of ${MAX_SCORE}`);
        passedRuns += check_yproject_policy_stdout();
        passedRuns += check_pnpmi_stdout();
        passedRuns += check_build_stdout();
        passedRuns += check_test_cjs_stdout();
        passedRuns += check_test_ts_stdout();
        passedRuns += check_start_stdout();
    }
}
