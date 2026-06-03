import { execSync } from 'child_process';
try{
  console.log('Running tests...');
  execSync('node ./test/tests.js', {stdio:'inherit'});
  console.log('All tests passed');
}catch(e){ console.error('Tests failed'); process.exit(2); }
