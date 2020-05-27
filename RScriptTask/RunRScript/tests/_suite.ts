import * as path from 'path';
import * as assert from 'assert';
import * as ttm from 'azure-pipelines-task-lib/mock-test';

const DEFAULT_TIMEOUT = 30000; // 5s
const SCRIPT_PATH = './sample-script.R';

describe('Task test suite', function () {
    before( () => {} );

    after( () => {} );

    it('should correctly attempt run Rscript with no arguments', function(done: MochaDone) {
        this.timeout(DEFAULT_TIMEOUT);

        let testPath = path.join(__dirname, 'success-no-args.js');
        let tr: ttm.MockTestRunner = new ttm.MockTestRunner(testPath);
    
        tr.run();
        console.log(tr.stdout);
        console.log(`success: ${tr.succeeded}`);
        assert.equal(tr.succeeded, true, 'should have succeeded');
        assert.equal(tr.ran(`./mock/Rscript ${SCRIPT_PATH}`), true, 'should have script with no args');
        assert.equal(tr.warningIssues.length, 0, 'should have no warnings');
        assert.equal(tr.errorIssues.length, 0, 'should have no errors');
        done();
    });

    it('should correctly attempt run Rscript with arguments', function(done: MochaDone) {
        this.timeout(DEFAULT_TIMEOUT);

        let testPath = path.join(__dirname, 'success-args.js');
        let tr: ttm.MockTestRunner = new ttm.MockTestRunner(testPath);
    
        tr.run();
        console.log(tr.stdout);
        console.log(`success: ${tr.succeeded}`);
        assert.equal(tr.succeeded, true, 'should have succeeded');
        assert.equal(tr.ran(`./mock/Rscript ${SCRIPT_PATH} arg1 --arg2 -arg3=value`), true, 'should have run script with 3 args');
        assert.equal(tr.warningIssues.length, 0, 'should have no warnings');
        assert.equal(tr.errorIssues.length, 0, 'should have no errors');
        done();
    });

    it('should fail with invalid filepath', function(done: MochaDone) {
        this.timeout(DEFAULT_TIMEOUT);
    
        let testPath = path.join(__dirname, 'fail-invalid-path.js');
        let tr: ttm.MockTestRunner = new ttm.MockTestRunner(testPath);
    
        tr.run();
        console.log(`success: ${tr.succeeded}`);
        assert.equal(tr.succeeded, false, 'should have failed');
        assert.equal(tr.warningIssues, 0, 'should have no warnings');
        assert.equal(tr.errorIssues.length, 1, 'should have 1 error issue');
        assert.equal(tr.errorIssues[0].includes('loc_mock_NotAFile'), true, 'should throw NotAFile error');
        done();
    });
})
