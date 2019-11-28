import DocProcessor from './documentation_postprocess.js'

const sinon = require('sinon');
const fs = require('fs');

describe('Documentation postprocessor ', function () {


    beforeEach(() => {
        sinon.stub(fs,'readFileSync').withArgs('file1.md').returns("This is markdown :start -->");

        let readStub = sinon.stub(fs, 'readdirSync');
        readStub.withArgs('doc_path').returns(["file1.md", "file2.md"]);
        readStub.withArgs('source_path/').returns(["file1.vue", "file2.js", "directory"]);
        readStub.withArgs('source_path/directory/').returns(["file3.vue"]);

        sinon.stub(fs, 'writeFileSync').withArgs('file1.vue').returns('This is markdown :start -->\n')
        ;
    });
    afterEach(() => {
        fs.writeFileSync.restore();
        fs.readFileSync.restore();
        fs.readdirSync.restore();

    });

    it('initializes correctly', () => {
        let docProcessor = new DocProcessor('doc_path', 'master', 'source_path');
        expect(docProcessor.branch).toBe('master');
        expect(docProcessor.doc_path).toBe('doc_path');
        expect(docProcessor.src_path).toBe('source_path');
    });

    it('has a process_documentation_files method', () => {
        let docProcessor = new DocProcessor('doc_path', 'master', 'source_path');
        docProcessor.process_documentation_files();
        expect(JSON.stringify(docProcessor.source_files)).toBe(JSON.stringify({
            "file1": "source_path/file1.vue",
            "file2": "source_path/file2.js",
            "file3": "source_path/directory/file3.vue"
        }));
    });

    it('has a process_documentation_files method that builds the output', () => {
        let docProcessor = new DocProcessor('doc_path', 'master', 'source_path');
        docProcessor.source_files = {
            "file1": "source_path/file1.vue"
        };
        let content = docProcessor.process_content("abc :start -->", 'source_path/file1.md');
        expect(JSON.stringify(content)).toBe(JSON.stringify(
            "abc :start -->\n[Find me at source_path/file1.vue](https://github.com/FAIRsharing/fairsharing.github.io/tree/master/source_path/file1.vue)"
        ));
    });
});




