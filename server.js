const mongoose=require('mongoose');
const dotenv=require('dotenv');
const Process= require('process');
Process.removeAllListeners('warning');
process.on('uncaughtException', err=>{
    console.log('UNCAUGHT EXCEPTION! 💥 Shutting down...')
    console.log(err.name,err.message);
        process.exit(1);    
})

dotenv.config({path: './config.env'});
const app=require('./app');

const DB=process.env.DATABASE.replace(
    '<PASSWORD>',
    process.env.DATABASE_PASSWORD
);
mongoose.connect(DB,{
    useNewUrlParser:true,
    useCreateIndex:true,
    useFindAndModify:true,
    useUnifiedTopology: true
}).then(()=>{
    console.log('DB connection is successful')
});



const port=3000;
const server= app.listen(port,()=>{
    console.log(`App running on port ${port}`);
});

process.on('unhandledRejection', err=>{
    console.log('UNHANDLED REJECTION! 💥 Shutting down...')
    console.log(err.name,err.message);
    server.close(()=>{
        process.exit(1);
    })
})


