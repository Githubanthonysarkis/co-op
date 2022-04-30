const mongoose = require('mongoose');
const Transaction = require('./transactionModel');

const groupSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please enter the group's name"],
        maxlength: [50, "Maximum group's name characters is 20"],
        minlength: [6, "Minimum group's name character is 6"]
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    members: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'User'
    },
    wallet: {
        type: Number,
        default: 0
    }
}, {timestamps: true});

groupSchema.pre('save', async function(){
    let total = 0;
    const transactions = await Transaction.find({group: this._id});
    transactions.forEach(transaction => {
        total += transaction.amount;
    });
    this.wallet = total;
})

groupSchema.methods.add_member = function (id) {
    this.members.push(id);
    this.save();
}

module.exports = mongoose.model('Group', groupSchema);