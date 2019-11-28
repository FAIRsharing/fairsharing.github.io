/* @vuese gen command generates documentation for vueJS code.
However, there are:
* missing information we want to add
* comments that prevent a correct sphinx build we want to post process.
This script ensures that this is done properly.
It is trigger via the ```npm run doc``` command with an extra param to control the target link (see process_content)
 */
let fs = require('fs');

/* This function is the entry point of the documentation post processing. It's the one you want to use.
    @arg First argument is the path to the documentation components generates by vuese
    @arg Second argument is the branch name to build the links at the bottom of each âge.
    @arg Source: a string representing the target of source files
 */
function process_documentation_files(documentation_path, branch, target){
    let source_files_path = get_source_files(target);
    let files = fs.readdirSync(documentation_path);

    files.forEach(function(file){
        let file_path = documentation_path + '/' + file,
            file_content = fs.readFileSync(file_path, 'utf-8');
        let processed_content = process_content(file_content, source_files_path, file_path, branch);
        fs.writeFileSync(file_path, processed_content, 'utf-8')
    });
    return true;
}


/* Given a markdown input, adds the link to the source file at the bottom and a backspace after each ``:start-->``` string
    @arg Markdown_content: documentation markdown string coming out of vuese output files.
    @arg paths: a dictionary of the source files paths
    @arg path: the path of the current documentation file
    @arf branch: the branch to build the link on
 */
function process_content(markdown_content, paths, path, branch){
    let fileNameArray = path.split('/');
    let fileName = fileNameArray[fileNameArray.length -1].replace('.md', '');
    let filePath = paths[fileName];
    markdown_content += "[Find me at " + filePath + "](https://github.com/FAIRsharing/fairsharing.github.io/tree/" + branch  + "/" + filePath + ")";

    return markdown_content.replace(/:start -->/g, ':start -->\n');
}


/* This functions builds the dictionary of the source file path  given an input target (should be ```'src'```)
    @arg path: a string representing the directory to build the source files paths from.
*/
function get_source_files(path){
    let path_output = {};
    let files = fs.readdirSync(path + '/');

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


exports.process_doc = function(target_doc_path, target_source_path){
    return process_documentation_files(target_doc_path, 'master', target_source_path);
};