const app = require('./app');
const PORT = process.env.PORT || 8080
const HOST_NAME = process.env.HOST || "localhost"

app.listen(PORT, HOST_NAME, () => {
    console.log(`Server started at ${HOST_NAME}:${PORT}`)
})
