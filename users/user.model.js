const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const schema = new Schema({
  username: { type: String, unique: true, required: true },
  hash: { type: String, required: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  createdDate: { type: Date, default: Date.now },
  lastLogin: { type: Date, default: Date.now },
  lastLogout: { type: Date, default: Date.now },
  clientIP: { type: String, default: "" },
  role: { type: String, required: true },
});

schema.set("toJSON", { virtuals: true });

module.exports = mongoose.model("User", schema);
