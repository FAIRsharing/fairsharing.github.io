import DocProcessor from './documentation_postprocess.js'

const sinon = require('sinon');
const fs = require('fs');

describe('Documentation postprocessor ', function () {


    beforeEach(() => {
        sinon.stub(fs,'readFileSync').withArgs('file1.md').returns("This is markdown :start -->");
        let readStub = sinon.stub(fs, 'readdirSync');
        readStub.withArgs('doc_path').returns(["file1.md", "file2.md"]);
        readStub.withArgs('source_path/').returns(["file1.vue", "file2.js", "directory"]);
        readStub.withArgs('directory').returns();
        sinon.stub(fs, 'writeFileSync').withArgs('file1.vue').returns('This is markdown :start -->\n')
        ;
    });
    afterEach(() => {
        fs.writeFileSync.restore();
        fs.readFileSync.restore();
        fs.readdirSync.restore();

    });

    it('should run without errors', () => {
        expect(DocProcessor.process_doc('doc_path', 'source_path')).toBe(true);
    });
});

