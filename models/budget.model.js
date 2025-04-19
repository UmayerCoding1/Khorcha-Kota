import mongoose, { Schema, Types } from "mongoose";

const budgetSchema = new Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    mouth: {
      type: String,
      required: true,
    },
    year: {
      type: String,
      required: true,
    },
    budget: {
      type: Number,
      required: true,
    },
    remainingBudget: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

export const Budget = mongoose.model("Budget", budgetSchema);
