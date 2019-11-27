/* vuese gen command generates documentation for vueJS code.
However, there are:
* missing information we want to add
* comments that prevent a correct sphinx build we want to post process.
This script ensures that this is done properly.
It is trigger via the ```npm run doc``` command
 */

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }
const   Log = _interopDefault(require('log-horizon')),
        logger = Log.create(),
        documentation_path = '../../source/components',
        source_path = '../',
        path = require('path'),
        fs = require('fs'),
        documentationDirectoryPath = path.join(__dirname, documentation_path),
        sourceDirectoryPath = path.join(__dirname, source_path)


// Getting the files paths for which the documentation is build
fs.readdir( sourceDirectoryPath, function(err, files){
    // Solution 1: recursive (hard to code)
    // Solution 2: mapping (less flexible)
});


// Getting the files paths of the documentation file output
fs.readdir(documentationDirectoryPath, function (err, files) {

    logger.progress('Starts post-processing of the documentation files...');

    // Handling error
    if (err) {
        return console.log('Unable to scan directory: ' + err);
    }

    // Listing all files in /sources/components/
    files.forEach(function (file) {
        let file_path = documentation_path + '/' + file,
            file_content;

        // Read the file
        fs.readFile(file_path, 'utf-8', function(err, data){

            // Process the data
            file_content = [...data].join('');
            let processed_content = process_content(file_content);

            // Overwrite the file with the output
            fs.writeFile(file_path, processed_content, function(err){
                if (err) throw err;
            })

        })

    });

    logger.success('Post-processing finished. Documentation available in /source/')
});

function process_content(markdown_content){
    return markdown_content.replace(/:start -->/g, ':start -->\n');
}