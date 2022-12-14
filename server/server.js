const path = require("path");
const express = require("express");
const { errorHandler } = require("./middlewares/errorMiddleware");
require("colors");
require("dotenv").config();
const app = express();
const { protect } = require("./middlewares/authMiddleware");

// Starting the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server up and runnning on port ${PORT}`));

// Connecting to the database
require("./config/db")();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// ["log", "warn"].forEach(function (method) {
//   var old = console[method];
//   console[method] = function () {
//     var stack = new Error().stack.split(/\n/);
//     // Chrome includes a single "Error" line, FF doesn't.
//     if (stack[0].indexOf("Error") === 0) {
//       stack = stack.slice(1);
//     }
//     var args = [].slice.apply(arguments).concat([stack[1].trim()]);
//     return old.apply(console, args);
//   };
// });

// Routes

app.use("/api/user", require("./routes/userRoutes"));
app.use("/api/groups", protect, require("./routes/groupRoutes"));

// Serve the frontend
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../client/build")));

  app.get("*", (req, res) =>
    res.sendFile(
      path.resolve(__dirname, "../", "client", "build", "index.html")
    )
  );
}

app.use(errorHandler);
