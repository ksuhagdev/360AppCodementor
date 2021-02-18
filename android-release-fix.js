const fs = require('fs');

try {
  const curDir = __dirname;
  const rootDir = process.cwd();

  const file = `${rootDir}/node_modules/react-native/react.gradle`;
  const dataFix = fs.readFileSync(`${curDir}/android-gradle-fix`, 'utf8');
  const data = fs.readFileSync(file, 'utf8');

  // TODO: This matching function will keep evolving along
  // with the react.gradle file. For now, the default
  // react.gradle file only has one doLast {} block. In
  // the future, this might change (if this Android issue
  // is not fixed by then).
  if ((data.match(/doLast {/g) || []).length > 1) {
    throw new Error('Already fixed.');
  }

  const result = data.replace(/\/\/ Set up inputs and outputs so gradle can cache the result/g, dataFix);

  fs.writeFileSync(file, result, 'utf8');
  console.log('Android Gradle Fixed!');
} catch (error) {
  console.error(error);
}
