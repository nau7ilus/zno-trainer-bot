const { Schema, model } = require("mongoose");

const UserSchema = new Schema(
  {
    id: { type: Number, required: true, unique: true },
    answers: { true: Number, false: Number },
    points: { type: Number, default: 0 },
    joinDate: { type: Date, default: Date.now },
    language: { type: String, default: "uk" },
  },
  {
    versionKey: false,
  }
);

module.exports = model("user", UserSchema);
