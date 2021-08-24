const fs = require("fs");
function copy_gitignore_contents() {
    gitignore_content = fs.readFileSync(".gitignore", "utf-8");

    const gitignore_cjs_content = `// prettier-ignore
module.exports = {
    filename: ".gitignore",
    generate: (packageJson_UNUSED, policyOptions, prevContent) => {
        return \`
${gitignore_content}
        \`;
    },
};
`;

    fs.writeFileSync(".gitignore.gen.cjs", gitignore_cjs_content, "utf-8");
}

module.exports.copy_gitignore_contents = copy_gitignore_contents;
