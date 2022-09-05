const express = require("express");
var cors = require('cors')
const app = express();

app.use(cors());
var routes = require("./routes/index");
// swagger
const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

const swaggerOptions = {
    swaggerDefinition: {
        // Like the one described here: https://swagger.io/specification/#infoObject
        info: {
            title: "SkoolBag API",
            version: "1.0.0",
            description: "SkoolBag API Document",
            contact: { name: "Charith Wickramasinghe" },
        },
    },
    apis: ["./routes/*.js"],
};

const swaggerDoc = swaggerJsdoc(swaggerOptions);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDoc));


app.get("/", (req, res) => {
    res.redirect("/api-docs");
});

a

app.get("/swagger.json", function(req, res) {
    res.setHeader("Content-Type", "application/json");
    res.send(swaggerDoc);
});
app.use("/", routes);

app.listen(3000, () => console.log("Listening on port 3000"));

module.exports = app;