const documentation_path = '../../source/components';
const path = require('path');
const fs = require('fs');

const directoryPath = path.join(__dirname, documentation_path);

fs.readdir(directoryPath, function (err, files) {
    //handling error
    if (err) {
        return console.log('Unable to scan directory: ' + err);
    }
    //listing all files using forEach
    files.forEach(function (file) {
        let file_path = documentation_path + '/' + file,
            file_content;
        // Do whatever you want to do with the file
        fs.readFile(file_path, 'utf-8', function(err, data){
            console.log(data);
            file_content = [...data].join(''); // making a copy
            let processed_content = process_content(file_content);
            console.log(processed_content);
            fs.writeFile(file_path, processed_content, function(err){
                if (err) throw err;
                console.log(file + ' has been saved!');
            })

        })

    });
});


function process_content(markdown_content){
    return markdown_content.replace(/:start -->/g, '>\n');
}