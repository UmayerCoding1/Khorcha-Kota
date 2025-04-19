import mongoose, {Schema} from "mongoose";

const expenseSchema = new Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    expense:[
        {
            itemname: {
                type: String,
                required: true,
            },
            itemprice: {
                type: Number,
                required: true,
            },
            date: {
                type: String,
                default: () => {
                    const now = new Date();
                    return `${now.getDate()}/${now.getMonth() + 1}/${now.getFullYear()}`;
                }
            }
        }
    ],
    mounth: {
        type: String,
        default: new Date().toLocaleString('default', { month: 'long' }).toLocaleLowerCase()
    },
    year: {
        type: String,
        default: new Date().getFullYear()
    }
},{timestamps: true});

export const Expense = mongoose.model("Expense", expenseSchema);