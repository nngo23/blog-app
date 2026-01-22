const app = require("./app");
const config = require("./utils/config");
const logger = require("./utils/logger");
const path = require("path");

app.listen(config.PORT, () => {
  logger.info(`Server running on port ${config.PORT}`);
  logger.info(`Frontend served from: ${path.join(__dirname, "public")}`);
});
