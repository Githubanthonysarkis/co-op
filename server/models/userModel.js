const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, "Please enter a username"],
      unique: true,
      maxlength: [50, "Maximum username characters is 50"],
      minlength: [4, "Minimum username characters is 4"],
      validate: [
        (val) => !(val.includes("@") || val.includes(" ")),
        "Usernames can't contain '@' or white spaces",
      ],
    },
    email: {
      type: String,
      lowercase: true,
      required: [true, "Please enter an email"],
      unique: true,
      validate: [validator.isEmail, "Please enter a valid email"],
    },
    password: {
      type: String,
      required: [true, "Please enter a password"],
      minlength: [6, "Minimum password characters is 6"],
    },
    isHashed: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

userSchema.pre("save", async function () {
  if (!this.isHashed) {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(this.password, salt);
    this.password = hashedPassword;
    this.isHashed = true;
  }
});

module.exports = mongoose.model("User", userSchema);
