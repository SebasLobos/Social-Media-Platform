import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        trim: true,
        required: 'Name is required'
    },
    email: {
        type: String,
        trim: true,
        unique: 'Email already exists',
        match: [/.+\@.+\..+/, 'Please fill a valid emal address'],
        required: 'Email is required'
    },
    created: {
        type: Date,
        default: Date.now
    },
    update: Date,
    hased_password:{
        type: String,
        required: 'Password is required'
    },
    salt: String
});

UserSchema
.virtual('password')
.set(function(password) {
    this._password = password
    this.salt = this.makeSalt()
    this.hased_password = this.encryptPassword(password)
})
.get(function() {
    return this._password
})

export default mongoose.model('User', UserSchema)