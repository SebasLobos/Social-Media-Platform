import mongoose from 'mongoose';
import crypto from 'crypto';

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
        match: [/.+\@.+\..+/, 'Please fill a valid email address'],
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
});

UserSchema.methods = {
    authenticate: function (plainText){
        return this.encryptPassword(plainText) === this.hased_password
    },
    encryptPassword: function(password) {
        if (!password) return ''
        try {
            return crypto
                .createHmac('sha1', this.salt)
                .update(password)
                .digest('hex')
        } catch (err) {
            return ''
        }
    },
    makeSalt: function() {
        return Math.round((new Date().valueOf() * Math.random())) + ''
    }
};

UserSchema.path('hased_password').validate( function (v) {
    if ( this._password && this._password.length < 6 ) {
        this.invalidate('password', 'Password must be at least 6 characters.')
    }
    if (this.isNew && !this._password) {
        this.invalidate('password', 'Password is required')
    }
}, null);

export default mongoose.model('User', UserSchema)