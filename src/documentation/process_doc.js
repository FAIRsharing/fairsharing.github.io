let DocProcessor = require("./documentation_postprocess.js");

/* Only trigger the function if it's the main (executed by npm with ```npm run doc``` command).
*/
if (require.main === module) {
    let branch = 'master';
    if (process.argv[2]) {
        branch = process.argv[2];
    }
    let docProcessor = new DocProcessor("source/components", branch, "src");
    docProcessor.process_documentation_files();
}