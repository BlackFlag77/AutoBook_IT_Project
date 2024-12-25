//add mongoose
const mongoose = require("mongoose");

//assign mongoose to schema
const schema = mongoose.Schema;

//implementing a function to connect data that we are inputing with this schema
const VCSchema = new schema({
    name:{
        type: String,   //data tpye
        require: [true, 'Vehicle name is required'],
        trim: true,
        minlength:[2, 'Name must be at least 2 characters long']
    }, 
    description:{
        type: String,
        require: false,
        trim: true,
        maxlength: [500, 'Description cannot exceed 500 characters']
    },
    drivetrain:{
        type: String,
        require: [true, 'Drivetrain is required'],
        trim: true,
      //  enum:['FWD', 'RWD', 'AWD', '4WD']
    },
    enginepower:{
        type: String,
        require:[true, 'Engine power is required']
    },
    enginetorque:{
        type: String,
        require:[true, 'Engine torque is required']
    },
    enginedisplacement:{
        type: String,
        require:[true,'Engine displacement is required'],
        trim: true,
        match: [/^\d\.\d L$/, 'Engine displacement must be in format "x.x L"']

    },
    engineconfiguration:{
        type: String,
        require:true,
        trim:true,
       // enum:['Inline 3-cylinder', 'Inline 4-cylinder', 'Inline 5-cylinder', 'Inline 6-cylinder', 'V6', 'V8', 'V10', 'V12', 'Flat-4', 'Flat-6', 'W12', 'W16', 'Rotary', 'H-type']
    },
    transmission:{
        type: String,
        require:true,
        trim: true,
    },
    doors:{
        type:Number,
        require:false,
        min: [2, 'At least 2 doors are required'],
        max: [6, 'Cannot have more than 6 doors']
    },
    seats:{
        type:Number,
        require:false,
        min: [2, 'At least 2 seats are required'],
        max: [50, 'Cannot have more than 8 seats']
    },
    wheelsize:{
        type: Number,
        require:false,
        min: [14, 'Wheel size must be at least 14 inches']
    },
    wheeltype:{
        type:String,
        require:false,
        trim: true,
        //enum: ['steel', 'alloy', 'chrome'],
    },
    fueltype:{
        type:String,
        require:[true, 'Fuel type is required']
    },
    bodytype:{
        type:String,
        require:true
    },
    image:{
        type: String
    },
    climateControl:{
        type: Boolean,
        required: false,
        default: false
    },
    infotainmentSystem:{
        type:Boolean,
        required: false,
        default: false
    },
    sunroof:{
        type:Boolean,
        required: false,
        default: false
    },
    upholstery: {
        type: Boolean,
        required: false,
        default: false
    },
    powerAdjustableSeats: {
        type: Boolean,
        required: false,
        default: false
    },
    ambientLighting: {
        type: Boolean,
        required: false,
        default: false
    },
    heatedSeats: {
        type: Boolean,
        required: false,
        default: false
    }
});


//export the model that we created
module.exports = mongoose.model(
    "VCModel",    //filename
    VCSchema    //function name
);