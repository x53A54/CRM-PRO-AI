const mongoose = require("mongoose");

function generateCompanyCode(name) {
  const normalizedName = (name || "")
    .toUpperCase()
    .replace(/\s+/g, "");

  const randomDigits = Math.floor(Math.random() * 10000)
    .toString()
    .padStart(4, "0");

  return `${normalizedName}-${randomDigits}`;
}

const companySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },

  code: {
    type: String,
    required: true,
    unique: true,
    default: function () {
      return generateCompanyCode(this.name);
    }
  },

  createdAt: {
    type: Date,
    default: Date.now
  }
});

companySchema.statics.generateCompanyCode = generateCompanyCode;

module.exports = mongoose.model("Company", companySchema);
