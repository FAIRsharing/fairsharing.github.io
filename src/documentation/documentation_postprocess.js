/* @vuese gen command generates documentation for vueJS code.
This smaall script completes the @vuese for our documentation by:
* adding a '\n' after each ':start -->' string in each .md files in /source/components
* also adds a link at the bottom of each file that points to the corresponding file on github.
It is trigger via the ```npm run doc``` command with an extra param to control the target link (see process_content)
 */
let fs = require('fs');

class DocumentationProcessor {

    constructor(doc_path, branch, src_path) {
        this.doc_path = doc_path;
        this.src_path = src_path;
        this.branch = branch;
        this.source_files = {};
        this.doc_files = {};
        this.content = {};
    }

    /*
    Main method to run the post process of the documentation.
     */
    process_documentation_files(){
        this.get_source_files(this.src_path);
        let files = fs.readdirSync(this.doc_path),
            _self = this;
        files.forEach(function(file){
            let file_path = _self.doc_path + '/' + file;
            let file_content = fs.readFileSync(file_path, 'utf-8');
            _self.doc_files[file] = file_path;
            let processed_content = _self.process_content(file_content, file_path);
            fs.writeFileSync(file_path, processed_content, 'utf-8');
            _self.content[file.replace('.md', '').replace('.js', '')] = processed_content;
        });
    }

    /* This functions builds the dictionary of the source file path  given an input target (should be ```'src'```)
    @arg path: a string representing the directory to build the source files paths from.
    */
    get_source_files(path){
        let files = fs.readdirSync(path + '/', {encoding: 'utf-8', withFileTypes: true});
        for (let fileIndex in files){
            let file = files[fileIndex];
            if (file.isFile() &&
                (file.name.includes('.js') || file.name.includes('.vue')) &&
                !file.name.includes('.spec')){
                let fileName = file.name.replace('.js', '').replace('.vue', '');
                this.source_files[fileName] = path + '/' + file.name;
            }
            if (!file.isFile()){
                this.get_source_files(path + '/' + file.name)
            }
        }
    }

    /* Given a markdown input, adds the link to the source file at the bottom and a backspace after each ``:start-->``` string
    @arg Markdown_content: documentation markdown string coming out of vuese output files.
    @arg path: the path of the current documentation file
     */
    process_content(markdownContent, path){
        let fileNameArray = path.split('/');
        let fileName = fileNameArray[fileNameArray.length -1].replace('.md', '');
        let filePath = this.source_files[fileName];
        markdownContent += "[Find me at " + filePath + "](https://github.com/FAIRsharing/fairsharing.github.io/tree/" + this.branch  + "/" + filePath + ")";
        markdownContent = markdownContent.replace(/:end -->\n/g, ":end -->");
        return markdownContent.replace(/:start -->/g, ':start -->\n');
    }
}

module.exports = DocumentationProcessor;