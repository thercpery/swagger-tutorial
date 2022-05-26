const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const swaggerUI = require("swagger-ui-express");
const swaggerJsDoc = require("swagger-jsdoc");
const booksRoutes = require("./routes/books");

const PORT = process.env.PORT || 4000;

const swaggerOptions = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "Library API",
            version: "1.0.0",
            description: "A simple Express Library API"
        },
        servers: [
            {
                url: "http://localhost:4000"
            }
        ]
    },
    apis: ["./routes/*.js"]
};

const specs = swaggerJsDoc(swaggerOptions);

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(morgan("dev"));
app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(specs));
app.use("/books", booksRoutes);

app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));