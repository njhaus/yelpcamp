import mongoose from 'mongoose';
import User from './user.js';
import Campground from './campground.js';

const reviewSchema = new mongoose.Schema({
    text: {
        type: String,
        required: true,
        minLength: 10,
        maxLength: 2000
    },
    rating: {
        type: Number,
        required: true,
        max: 5,
        min: 1
    },
    user: {
        type: String,
        required: true
    },
})

reviewSchema.pre('findOneAndDelete', async function () {
    try {
        console.log('This middleware is running');
        const id = await this.getFilter()._id;
        // const userCheckOne = await User.find({ reviews: { $in: [id] } });
        const user = await User.updateOne({ reviews: { $in: [id] } }, { $pull: { reviews: id } });
        const campground = await Campground.updateOne({ reviews: { $in: [id] } }, { $pull: { reviews: id } });
        // const userCheckToo = await User.find({ reviews: { $in: [id] } });
        // console.log('ID: ' + id);
        // console.log('USER CHECK ONE: ' + userCheckOne);
        // console.log('USER CHECK TOO: ' + userCheckToo);
        // this.model(User).remove({ reviews: this._id });
        // this.model('Campground').remove({ reviews: this._id })
    } catch(err) {
        console.log(err);
    }
})

const Review = mongoose.model('Review', reviewSchema);

export default Review;


// farmSchema.pre(‘findOneAndDelete’, async function (farm) {
//     if (farm.products.length) {
//         await Product.deleteMany({ _id: { $in: farm.products } });
//     }
// }
