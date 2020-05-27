import * as path from 'path';
import * as assert from 'assert';
import * as ttm from 'azure-pipelines-task-lib/mock-test';

const DEFAULT_TIMEOUT = 600000;

describe('Task test suite', function () {
    before( () => {} );

    after( () => {} );

    it('should run Rscript with 2 package name inputs', function(done: MochaDone) {
        this.timeout(DEFAULT_TIMEOUT);

        let installPackagesScriptPath = path.join(__dirname, '../install-packages.R')
        let tp = path.join(__dirname, 'success.js');
        let tr: ttm.MockTestRunner = new ttm.MockTestRunner(tp);
    
        tr.run();
        console.log(tr.stdout);
        console.log(`success: ${tr.succeeded}`);
        assert.equal(tr.succeeded, true, 'should have succeeded');
        assert.equal(tr.ran(`./R/R-3.5.3/bin/Rscript ${installPackagesScriptPath} stringr testthat`), true, 'should have run proper command');
        assert.equal(tr.warningIssues.length, 0, 'should have no warnings');
        assert.equal(tr.errorIssues.length, 0, 'should have no errors');
        done();
    });

    it('should fail with invalid formatted package name', function(done: MochaDone) {
        this.timeout(DEFAULT_TIMEOUT);
    
        let tp = path.join(__dirname, 'failure-name-format.js');
        let tr: ttm.MockTestRunner = new ttm.MockTestRunner(tp);
    
        tr.run();
        console.log(`success: ${tr.succeeded}`);
        assert.equal(tr.succeeded, false, 'should have failed');
        assert.equal(tr.warningIssues, 0, 'should have no warnings');
        assert.equal(tr.errorIssues.length, 1, 'should have 1 error issue');
        assert.equal(tr.errorIssues[0], 'Invalidly formatted package name(s) provided', 'package name formatting error output');
        done();
    });
})