import mongoose, { Schema } from "mongoose";

const expenseSchema = new Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    expense: [
      {
        itemname: {
          type: String,
          required: true,
        },
        qty: {
          type: Number,
          required: true,
        },
        kgprice: {
          type: Number,
          required: true,
        },
        type: {
            type: String,
            required: true,
            enum: ["kg", "quantity"]
          },          
        date: {
          type: String,
          default: () => {
            const now = new Date();
            return `${now.getDate()}-${
              now.getMonth() + 1
            }-${now.getFullYear()}`;
          },
        },
      },
    ],
    month: {
      type: String,
      default: new Date()
        .toLocaleString("default", { month: "long" })
        .toLocaleLowerCase(),
    },
    year: {
      type: String,
      default: new Date().getFullYear(),
    },
  },
  { timestamps: true }
);

export const Expense = mongoose.model("Expense", expenseSchema);
