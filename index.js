const express = require("express");
const userRoute = require("./routes/user");
const adminRoute = require("./routes/admin");
const commonRoute = require("./routes/common");
const designerRoute = require("./routes/designer");

require("dotenv").config();
const cors = require("cors");
const cookieParser = require("cookie-parser");
const app = express();

app.use(cookieParser());
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({ message: "Server is running" });
});

app.use("/", userRoute);
app.use("/", adminRoute);
app.use("/", commonRoute);
app.use("/", designerRoute);
app.use('/local-storage', express.static('local-storage')); // Update with the correct path to the local storage directory
// app.use("/", superAdminRoute);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
