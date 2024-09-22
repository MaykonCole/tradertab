const dotenv = require("dotenv");
dotenv.config({ path: ".env.development" });

const nextJest = require("next/jest");
const createJestConfig = nextJest({
  dir: ".",
});

console.log(process.env.NODE_ENV);
console.log(process.env.POSTGRES_HOST);

const jestConfig = createJestConfig({
  moduleDirectories: ["node_modules", "<rootDir>"],
});

module.exports = jestConfig;
