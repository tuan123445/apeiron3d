/* eslint-disable prettier/prettier */
/* eslint-disable no-undef */
const express = require("express");
const path = require("path");
const app = express();
const historyApiFallback = require("connect-history-api-fallback");

app.use(express.static(path.join(__dirname, "./dist/")));

app.use("/upload", express.static(path.join(__dirname, "/server/upload")));

// Connect history api fallback
// https://github.com/bripkens/connect-history-api-fallback
// -----------------------------------------------
app.use(historyApiFallback({
  disableDotRule: true,
  verbose: true
}));


app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "./dist/index.html"));
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`server listening to port + ${PORT}`));