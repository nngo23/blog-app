require("dotenv").config();

const MONGODB_URI =
  process.env.NODE_ENV === "test"
    ? process.env.TEST_MONGODB_URI
    : process.env.MONGODB_URI;

const PORT =
  process.env.NODE_ENV === "test"
    ? process.env.TEST_PORT || 3004
    : process.env.PORT || 3003;

module.exports = { PORT, MONGODB_URI };
