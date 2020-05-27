import * as path from 'path';
import * as assert from 'assert';
import * as ttm from 'azure-pipelines-task-lib/mock-test';

const DEFAULT_TIMEOUT = 30000; // 5s

describe('Task test suite', function () {
    before( () => {
        process.env['AGENT_VERSION'] = '2.115.0';
        process.env['AGENT_TOOLSDIRECTORY'] = "C:\\Program Files";
    } );

    after( () => {} );

    it('should succeed with valid, available version', function(done: MochaDone) {
        this.timeout(DEFAULT_TIMEOUT);
    
        let testPath = path.join(__dirname, 'success.js');
        let tr: ttm.MockTestRunner = new ttm.MockTestRunner(testPath);
    
        tr.run();
        console.log(tr.stdout);
        console.log(`success: ${tr.succeeded}`);
        assert.equal(tr.succeeded, true, 'should have succeeded');
        assert.equal(tr.warningIssues, 0, 'should have no warnings');
        assert.equal(tr.errorIssues.length, 0, 'should have 0 error issues');
        done();
    });

    it('should fail with invalidly formatted version', function(done: MochaDone) {
        this.timeout(DEFAULT_TIMEOUT);
    
        let testPath = path.join(__dirname, 'unavailable-version.js');
        let tr: ttm.MockTestRunner = new ttm.MockTestRunner(testPath);
    
        tr.run();
        console.log(`success: ${tr.succeeded}`);
        assert.equal(tr.succeeded, false, 'should have failed');
        assert.equal(tr.warningIssues, 0, 'should have no warnings');
        assert.equal(tr.errorIssues.length, 1, 'should have 1 error issue');
        done();
    });

    it('should fail with incorrectly formatted version', function(done: MochaDone) {
        this.timeout(DEFAULT_TIMEOUT);
    
        let testPath = path.join(__dirname, 'invalid-version-format.js');
        let tr: ttm.MockTestRunner = new ttm.MockTestRunner(testPath);
    
        tr.run();
        console.log(`success: ${tr.succeeded}`);
        assert.equal(tr.succeeded, false, 'should have failed');
        assert.equal(tr.warningIssues, 0, 'should have no warnings');
        assert.equal(tr.errorIssues.length, 1, 'should have 1 error issue');
        done();
    });
})
