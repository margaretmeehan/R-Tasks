import semver = require('semver');

/**
 * Mock semver module
 * Replaces only the valid() function
 * 
 * @param returnInvalid: if true, simulate handling an incorrectly formatted version
 */
export const mockSemVer = (returnInvalid?: boolean) => ({
    ...semver,
    "valid": (version: string, options?: boolean | undefined): string | null => {
        console.log(`mocking semver.valid("${version}")`);
        if (returnInvalid)
            return null;

        return `${version}`;
    }
});

/**
 * Mock Azure Pipelines tool lib module
 * Replaces findLocalTool() and findLocalToolVersions()
 * 
 * @param mockInstallPath: mock path for R installation
 * @param mockVersions: mock string list of available R versions
 */
export const mockToolLib = (mockInstallPath: string | null, mockVersions: string[]) => ({
    "findLocalTool": (tool: string, ver: string, arch: string) => {
        console.log(`mocking find local tool ${tool} ${ver} (${arch})`);
        return mockInstallPath;
    },
    "findLocalToolVersions": (tool: string, arch: string) => {
        console.log(`mocking find local tool versions ${tool} (${arch})`);
        return mockVersions;
    }
});
