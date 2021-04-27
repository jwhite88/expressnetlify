const { model, Schema} = require('mongoose');
const bcrypt = require('bcrypt');
const saltRounds = 10;

const userSchema = new Schema({
    firstname: {
        type: String,
        required: true
    },
    lastname: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        trim: true,
        required: true
    }
},
{
    collection: 'userSchema'
}
);

userSchema.pre("save", async function (next) {
    // console.log("My Password: ", this.password)
    const hash = await bcrypt.hashSync(this.password, saltRounds);
    this.password = hash;
    next();
 });

userSchema.methods.isValidPassword = async function (password) { 
    const user = this;
    const compare = await bcrypt.compare(password, user.password);
    return compare;
}

module.exports = model('User', userSchema);