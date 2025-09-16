const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ["admin", "user", "export"], required: true },
 category: { 
  type: String, 
  enum: ["Apparel", "Safety and PPE", "Bedding", "Socks", "Export Office"], 
  required: function () {
    return this.role === "user" || this.role === "export";
  }
}

});

module.exports = mongoose.model("User", UserSchema);
