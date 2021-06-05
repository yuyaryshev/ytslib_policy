module.exports = {
    filename: "package.json",
    generate: (packageJson, policyOptions, prevContent) => {
        try {
            const j: any = JSON.parse(prevContent);
            if(!j.scripts)
                j.scripts = {};
            j.scripts["new_script"] = "new_script_cmd_"+(new Date()).toISOString();
            const newContent = JSON.stringify(j,undefined, "    ");
            return newContent;
        } catch (e) {
            console.error(`CODE00000000 Failed to parse package.json`, e);
            return prevContent;
        }
    }
}