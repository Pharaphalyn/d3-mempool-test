const path = require('path');
const { spawn } = require('child_process');
const config = require('./config');

const testAppFilePath = path.join(
  __dirname,
  'app.js',
);

describe('Logger behaviour', () => {
  it('Log\'s not empty', done => {
    const testApp = spawn('node', [testAppFilePath]);
    testApp.stdout.on('data', data => {
      const stdout = data.toString();
      expect(stdout.length).toBeGreaterThan(0);
      testApp.kill('SIGINT');
      done();
    });
  });
  it('No errors in the console', done => {
    const testApp = spawn('node', [testAppFilePath]);
    testApp.stdout.on('data', data => {
      const stdout = data.toString();
      expect(stdout).not.toContain('error');
      testApp.kill('SIGINT');
      done();
    });
  });
});