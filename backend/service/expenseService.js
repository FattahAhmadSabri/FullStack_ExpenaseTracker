const Expense = require("../model/expenseSchema")

const addExpenseService =async(amount,description,category)=>{
    const result = await Expense.create({amount,description,category})
    return result
}

const getExpenseService =async()=>{
    const result = await Expense.findAll()
    return result
}


module.exports ={addExpenseService,getExpenseService }