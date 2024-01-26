const mongoose=require('mongoose');
const slugify=require('slugify');
//const User=require('./userModel');

const tourSchema=new mongoose.Schema({
    name:{
        type:String,
        required:[true, 'A tour must have a name'],
        unique:true,
        trim:true,
        maxlength:[40, 'A tour must have less than equal to 40 characters'],
        minlength:[10, 'A tour must have more than equal to 10 characters']
    },
    slug:{
        type:String,
        required:[true, 'A tour must have a slug'],
        unique:true
    },
    duration:{
        type:Number,
        required:[true, 'A tour must hae a duration']
    },
    maxGroupSize:{
        type:Number,
        required:[true,'A group must have group size']
    },
    difficulty:{
        type:String,
        required:[true,'A group must have difficulty'],
        enum:{
            values:['easy','medium', 'difficult'],
            message:"Difficulty is either: easy, medium, difficult"
        }
    },
    ratingsAverage:{
        type:Number,
        default:4.5,
        min:[1,'Rating must be above 1'],
        max:[5, 'Rating must be below 5'],
        set:val=>Math.round(val*10)/10
    },
    ratingsQuantity:{
        type:Number,
        default:0,
    },
    price:{
        type:Number,
        required:[true, 'A tour must have a price'], 
    },
    priceDiscount:{
        type:Number,
        validate:{
            validator:function(val){
                return val<this.price;
            },
            message:'Discount price ({VALUE}) must be below regular price'
        }
    },
    summary:{
        type:String,
        trim:true,
        required:[true, 'A tour must have a summary'],
    },
    description:{
        type:String,
        trim:true
    },
    imageCover:{
        type:String,
        required:[true, 'A tour must have a imagecover'],
    },
    images:[String],
    createdAt:{
        type:Date,
        default:Date.now(),
        select:false
    },
    startDates:[Date],
    startLocation:{
        type:{
            type:String,
            default:'Point',
            enum:['Point']
        },
        coordinates:[Number],
        address:String,
        description:String
    },
    locations:[{
        type:{
            type:String,
            default:'Point',
            enum:['Point']
        },
        coordinates:[Number],
        address:String,
        description:String,
        day:Number
    }],
    guides:[
        {type:mongoose.Schema.ObjectId,
        ref:'User'
        }
    ]
},
{
    toJSON:{virtuals:true},
    toObject:{virtuals:true}
}
)

tourSchema.index({price:1,ratingsAverage:-1});
tourSchema.index({slug:-1});
tourSchema.index({startLocation:'2dsphere'})

//virtual Populate
tourSchema.virtual('reviews',{
    ref:'Review',
    foreignField:'tour',
    localField:'_id'
})


//DOCUMENT MIDDLEWARE: run before .save() and .create()
//tourSchema.slug=slugify(tourSchema.name,{lower:true});
//console.log(this.slug);
tourSchema.pre('save',function(next){
    try{
        // console.log('pre save middleware is being called');
    this.slug=slugify(this.name,{lower:true});
    // console.log(this.slug)
    //console.log(slug);
    }catch(err){
        console.log(err)
    
    }
    next();
})


/* tourSchema.pre('save',async function(next){
    const guidesPromises=this.guides.map(async id=> await User.findById(id))
    this.guides=await Promise.all(guidesPromises)
    next();
}) */
//QUERY MIDDLEWARE
tourSchema.pre(/^find/,function(next){
    this.find({secretTour:{$ne:true}})
    this.start=Date.now();
    next();
})
tourSchema.pre(/^find/, function(next){
    this.populate({
        path:'guides',
        select:'-__v -passwordChangedAt'
      });
    next();
})

// tourSchema.post(/^find/,function(docs,next){
//     console.log(`Query took ${Date.now()-this.start} milliseconds!`)
//     //console.log(docs);
//     next();
// })


const Tour= mongoose.model('Tour', tourSchema);
module.exports=Tour;
