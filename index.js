const app = require('./src/app');
const PORT = require('./config/config.json').PORT;

if(!PORT) {
  console.log('Please provide a PORT');
  process.exit(1);
}

app.listen(PORT, () => {
  console.log(`server listening on port: ${PORT}`);
});
