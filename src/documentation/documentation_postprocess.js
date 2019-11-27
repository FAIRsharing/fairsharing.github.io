/* @vuese gen command generates documentation for vueJS code.
However, there are:
* missing information we want to add
* comments that prevent a correct sphinx build we want to post process.
This script ensures that this is done properly.
It is trigger via the ```npm run doc``` command
 */


function process_files(fs){
    const   documentation_path = '../../source/components',
        path = require('path'),
        documentationDirectoryPath = path.join(__dirname, documentation_path);

    // Getting the files paths of the documentation file output
    fs.readdir(documentationDirectoryPath, function (err, files) {

        // Handling error
        if (err) throw err;
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

            });
        });

        return true;
    });
}

function process_content(markdown_content){
    return markdown_content.replace(/:start -->/g, ':start -->\n');
}

module.exports.test_function = function(){
    return process_files();
} ;

if (require.main === module) {
    const fs = require('fs');
    process_files(fs);
}