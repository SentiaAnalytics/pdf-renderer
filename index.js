const app = require('./src/app');
const PORT = process.env.PORT;

if(!PORT) {
  console.log('Please provide a PORT');
  process.exit(1);
}

app.listen(PORT, () => {
  console.log(`server listening on port: ${PORT}`);
});
