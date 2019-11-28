import DocProcessor from './documentation_postprocess.js'

const sinon = require('sinon');
const fs = require('fs');
let docProcessor;
let expected_source_files_output = {
    "file1": "source_path/file1.vue",
    "file2": "source_path/file2.js",
    "file3": "source_path/directory/file3.vue"
};

describe('Documentation postprocessor ', function () {

    beforeAll( () => {
        // Mocking the Dirent classes (we use withFileType:true)
        let source_content_vue_file = new fs.Dirent("file1.vue", 1);
        let source_content_vue_file_2 = new fs.Dirent("file3.vue", 1);
        let source_content_js_file = new fs.Dirent("file2.js", 1);
        let source_content_dir = new fs.Dirent("directory", 2);

        // Starting the stubs
        sinon.stub(fs,'readFileSync').withArgs('file1.md').returns("This is markdown :start -->");
        let readDirStub = sinon.stub(fs, 'readdirSync');
        readDirStub.withArgs('doc_path').returns(["file1.md", "file2.md"]);
        readDirStub.withArgs('source_path/').returns([
            source_content_vue_file,
            source_content_js_file,
            source_content_dir
        ]);
        readDirStub.withArgs('source_path/directory/').returns([source_content_vue_file_2]);
        sinon.stub(fs, 'writeFileSync').withArgs('file1.vue').returns('This is markdown :start -->\n');
    });

    beforeEach(() => {
        docProcessor = new DocProcessor('doc_path', 'master', 'source_path');
    });

    afterAll(() => {
        // Ending the stubs
        fs.writeFileSync.restore();
        fs.readFileSync.restore();
        fs.readdirSync.restore();
    });

    it('initializes correctly', () => {
        expect(docProcessor.branch).toBe('master');
        expect(docProcessor.doc_path).toBe('doc_path');
        expect(docProcessor.src_path).toBe('source_path');
    });

    it('has a get_source_files() method', () => {
        docProcessor.get_source_files('source_path');
        expect(JSON.stringify(docProcessor.source_files)).toBe(JSON.stringify(expected_source_files_output));
    });

    it('has a process_documentation_files method', () => {
        docProcessor.process_documentation_files();
        expect(JSON.stringify(docProcessor.source_files)).toBe(JSON.stringify(expected_source_files_output));
    });

    it('has a process_content method that transforms the input string into the output string', () => {
        docProcessor.source_files = {
            "file1": "source_path/file1.vue"
        };
        let content = docProcessor.process_content("abc :start -->", 'source_path/file1.md');
        expect(JSON.stringify(content)).toBe(JSON.stringify(
            "abc :start -->\n[Find me at source_path/file1.vue](https://github.com/FAIRsharing/fairsharing.github.io/tree/master/source_path/file1.vue)"
        ));
    });
});




