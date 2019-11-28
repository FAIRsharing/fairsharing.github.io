/* @vuese gen command generates documentation for vueJS code.
However, there are:
* missing information we want to add
* comments that prevent a correct sphinx build we want to post process.
This script ensures that this is done properly.
It is trigger via the ```npm run doc``` command with an extra param to control the target link (see process_content)
 */

let fs = require('fs');
function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }
const Log = _interopDefault(require('log-horizon')),
    logger = Log.create();


function process_documentation_files(documentation_path, branch){

    let source_files_path = get_source_files("src");

    // Getting the files paths of the documentation file output
    fs.readdir(documentation_path, function (err, files) {
        // Handling error
        if (err) throw err;

        // Listing all files in /sources/components/
        files.forEach(function (file) {
            let file_path = documentation_path + '/' + file,
                file_content;

            // Read the file
            fs.readFile(file_path, 'utf-8', function(err, data){
                if (err) throw err;

                // Process the data
                file_content = [...data].join('');
                process_content(file_content, source_files_path, file_path, branch).then(function(response){
                    fs.writeFile(file_path, response, function(err){
                        if (err) throw err;
                    });
                });
            });
        });
    });
}

async function process_content(markdown_content, paths, path, branch){
    let fileNameArray = path.split('/');
    let fileName = fileNameArray[fileNameArray.length -1].replace('.md', '');
    let filePath = paths[fileName];

    let extraString = "[Find me at " + filePath + "](https://github.com/FAIRsharing/fairsharing.github.io/tree/" + branch  + "/" + filePath + ")";

    markdown_content += extraString;

    return markdown_content.replace(/:start -->/g, ':start -->\n');
}

function get_source_files(path){
    let path_output = {};

    let files = fs.readdirSync(path + '/', 'utf-8');
    for (let fileIndex in files){
        let file = files[fileIndex];
        if ((file.includes('.js') || file.includes('.vue'))
            && !file.includes('.spec')){
            let fileName = file.replace('.js', '').replace('.vue', '');
            path_output[fileName] = path + '/' + file;
        }
        else if (!file.includes(".")){
            path_output = {...path_output, ...get_source_files(path + '/' +file) }
        }
    }
    return path_output;
}

// If main, trigger the function
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

    process_documentation_files('source/components', branch);
    logger.success('Documentation post processing succeeded');

}