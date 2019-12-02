let DocProcessor = require("./documentation_postprocess.js");

/* Only trigger the function if it's the main (executed by npm with ```npm run doc``` command).
*/
if (require.main === module) {
    let branch;

    if (process.argv[2] === undefined){
        console.warn("No branch was provided, links will be built to point to master");
        branch = 'master';
    }
    else {
        branch = process.argv[2];
        if (branch !== 'master') console.warn("Don't forget to switch the target branch to master and rebuild the library before deploying to master");

    }

    let docProcessor = new DocProcessor("source/components", branch, 'src');
    docProcessor.process_documentation_files();
}