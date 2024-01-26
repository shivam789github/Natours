//review /rating/createdAt/ref to tour/ref to user
const mongoose=require('mongoose');
const Tour=require('./tourModel');

const reviewSchema=new mongoose.Schema({
    review:{
        type:String,
        required:[true,'Review can not be empty!']
    },
    rating:{
        type:Number,
        min:[1,'Rating must be above 1'],
        max:[5,'Rating must be below 5']
    },
    createdAt:{
        type:Date,
        default:Date.now()
    },
    user:{
        type:mongoose.Schema.ObjectId,
        ref:'User',
        required:[true,'Review must belong to a user']
    },
    tour:{
        type:mongoose.Schema.ObjectId,
        ref:'Tour',
        required:[true,'Review must belong to a tour']
    }
},
{   toJSON:{virtuals:true},
    toObject:{virtuals:true}
}
)

reviewSchema.index({tour:1,user:1},{unique:true});
//console.log(reviewSchema.indexes);

//QUERY MIDDLEWARE
reviewSchema.pre(/^find/, function(next){
    this.populate({
        path:'user',
        select:'name photo'
    })
   /*  this.populate({
        path:'tour',
        select:'name'
    }) */
    next();
})

reviewSchema.statics.calcAverageRatings=async function(tourId){
    const stats=await this.aggregate([
        {
            $match:{tour:tourId}
        },
        {
            $group:{
                _id:'$tour',
                nRating:{$sum:1},
                avgRating:{$avg:'$rating'}
            }
        }
    ]);
    //console.log(stats);
    if(stats.length>0){
        await Tour.findByIdAndUpdate(tourId,{
            ratingsAverage:stats[0].avgRating,
            ratingsQuantity:stats[0].nRating
        })
    }else{
        await Tour.findByIdAndUpdate(tourId,{
            ratingsAverage:4.5,
            ratingsQuantity:0
        })
    }
    
}
reviewSchema.post('save',function(){
    //this points to the current review
    this.constructor.calcAverageRatings(this.tour);
})

reviewSchema.pre(/^findOneAnd/,async function(next){
    this.r=await this.findOne();
    //console.log(this.r);
    next();
})
reviewSchema.post(/^findOneAnd/,async function(){
    //const r=await this.findOne() This does not work here. the query has already executed
   await this.r.constructor.calcAverageRatings(this.r.tour);
})

const Review=mongoose.model('Review',reviewSchema);
module.exports=Review;