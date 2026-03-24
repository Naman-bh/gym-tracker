const mongoose = require("mongoose");
const dns = require("dns");

const configureDnsForAtlas = () => {
  const currentServers = dns.getServers();
  const isLoopbackOnly =
    currentServers.length > 0 &&
    currentServers.every((server) => server === "127.0.0.1" || server === "::1");

  if (isLoopbackOnly) {
    dns.setServers(["8.8.8.8", "1.1.1.1"]);
    console.warn(
      `Detected loopback DNS (${currentServers.join(", ")}). Switched DNS servers for MongoDB SRV lookup.`
    );
  }
};

const connectDB = async () => {
  try {
    configureDnsForAtlas();

    await mongoose.connect(process.env.MONGO_URI);

    console.log("MongoDB connected");

  } catch (err) {

    console.error("MongoDB connection error:", err.message);
    process.exit(1);

  }
};

module.exports = connectDB;
