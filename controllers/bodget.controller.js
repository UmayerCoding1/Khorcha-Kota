import { Budget } from "../models/budget.model.js";
import asyncHandler from "../utils/AsyncHandler.js";
import {ObjectId} from 'mongoose'

export const addBudget = asyncHandler(async(req,res) => {
    const { userId, mouth, year, budget } = req.body;
    if (!userId || !mouth || !year || !budget ) {
        return res.status(400).json({ message: "Please fill all the fields" });
    }

    try {
        const existingBudget = await Budget.findOne({ userId, mouth, year });
        if (existingBudget) {
            return res.status(400).json({ message: "Budget already exists" });
        }

        const newBudget = await Budget.create({
            userId,
            mouth,
            year,
            budget,
            remainingBudget : budget, 
        });

        return res.status(201).json({ message: "Budget created successfully", success: true });
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({ message: "Internal server error" });
    }
});

export const addNextBudget = asyncHandler(async(req,res) => {
    const {nextBudget,budgetId} = req.body;
    if (!budgetId || !nextBudget) {
        return res.status(404).json({message: "All feaild is require",success: false})
    }
    const incrementValue = Number(nextBudget);
    if (isNaN(incrementValue)) {
      return res.status(400).json({ message: "Invalid budget value", success: false });
    }

    try {
        const existingBudget = await Budget.findOne({_id: budgetId});
        if (!existingBudget) {
            return res.status(400).json({message: "Budget not found", success: false});
        }

       
        

        const updateBudget = await Budget.findByIdAndUpdate(
            {_id: budgetId},
            {$inc: {budget: incrementValue, remainingBudget: incrementValue}},
            {new : true}
        )

       return res.status(202).json({message: "Next budget added successfully", success: true})
        
    } catch (error) {
       console.log(error);
       
    }
    
})


export const getBudget = asyncHandler(async(req,res) => {
    
    const { userId } = req.query;
    if (!userId) {
        return res.status(400).json({ message: "Please provide userId" });
    }

    try {
        const budgets = await Budget.find({ userId }).select("-userId -createdAt -updatedAt")
        if (!budgets) {
            return res.status(404).json({ message: "No budgets found" });
        }

        const budget = budgets[0];
        
        return res.status(200).json({ message: "Budgets fetched successfully", budget, success: true });
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({ message: "Internal server error" });
    }
})