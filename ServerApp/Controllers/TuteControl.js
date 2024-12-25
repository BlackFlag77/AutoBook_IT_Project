const User = require("../Models/TuteModel");
const Tutorial = require("../Models/TuteModel");
const path = require('path');
const multer = require('multer');
const fs = require('fs'); // Import fs to handle directory checks

// Ensure 'uploads' directory exists
const uploadDir = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true }); // Create directory if it doesn't exist
}



// Configure multer storage
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        // Define where to store the uploaded files
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        // Rename the file to include the date and original name
        cb(null, Date.now() + '-' + file.originalname);
    }
});


// File filter to accept only images or videos, but not both
const fileFilter = (req, file, cb) => {
    const allowedImageTypes = /jpeg|jpg|png|gif/;
    const allowedVideoTypes = /mp4|mov|avi/;
    const extName = path.extname(file.originalname).toLowerCase();

    if (allowedImageTypes.test(extName)) {
        req.fileType = 'image'; // Set file type for later use
        cb(null, true);
    } else if (allowedVideoTypes.test(extName)) {
        req.fileType = 'video'; // Set file type for later use
        cb(null, true);
    } else {
        cb(new Error('Only image and video files are allowed'));
    }
};

// Initialize multer with storage and file filter
const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: { fileSize: 100000000 } // Limit file size to ~100MB
});

// Controller Functions




//data display
const getAllUsers = async(req , res , next) =>{

    let Tutorial;

    //database data display all
    try{
        Tutorial = await User.find();

    }catch(err){
        console.log(err);
        return res.status(500).json({ message: "Server error" });
    }
    //not found users
    if(!Tutorial){
        return res.status(404).json({message:"No Tutorials found"});
    }
    //display users
    return res.status(200).json({Tutorial});
};

//Add new tutorial with visual content
const addTutorial = async (req, res, next) => {
    const { title, content } = req.body;
//input
    let newTutorial;
    try {
        // Handle uploaded file
        const visualContent = req.file ? req.file.path : null;
        const visualContentType = req.fileType || null;

        newTutorial = new Tutorial({//input
            title,
            content,
            
            visualContent: visualContent ? `/${visualContent}` : undefined, // Store the path
            visualContentType // Store the type
        });
        await newTutorial.save();
    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: "Unable to add tutorial" });
    }
    return res.status(201).json({ newTutorial });
};

//get by id
const getById = async(req , res , next)=>{
    const id  = req.params.id;

    let Tutorial;
    try{
        Tutorial = await User.findById(id);
    }catch(err){
        console.log(err);
        return res.status(500).json({ message: "Server error" });
    }
    //not find id
    if(!Tutorial){
        return res.status(404).json({message :"Tutorial not found"});
        }
        
        return res.status(200).json({Tutorial});
}

//update function
const updateTutorial = async(req, res,next)=>{
    const id  = req.params.id;
    const {title,content} = req.body;

    let Tutorial;

    try{
        //handle upload file
        let updateData = {title,content};

        if (req.file) {
            updateData.visualContent = `/${req.file.path}`;
            updateData.visualContentType = req.fileType;
        }


        Tutorial = await User.findByIdAndUpdate(id,
           updateData,{new : true});
           


    }catch(err){
        console.log(err);
        return res.status(500).json({ message: "Unable to update tutorial" });
    }
     //not update
    if(!Tutorial){
    return res.status(404).json({message :"Unable to update Tutorial "});
    }
    
    return res.status(200).json({Tutorial});

};

//delte function
const deleteTutorial = async(req , res, next) =>{
    const id  = req.params.id;

    let Tutorial;

    try{
        Tutorial = await User.findByIdAndDelete(id)
    }catch(err){
        console.log(err);
        return res.status(500).json({ message: "Unable to delete tutorial" });
    }

    //not delete
    if(!Tutorial){
        return res.status(404).json({message :"Unable to delete Tutorial "});
        }
        
        return res.status(200).json({ message: "Tutorial deleted successfully"});
};

// Like a Tutorial
const likeTutorial = async (req, res, next) => {
    const id = req.params.id;

    try {
        const tutorial = await Tutorial.findByIdAndUpdate(
            id,
            { $inc: { likes: 1 } }, // Increment likes by 1
            { new: true }
        );

        if (!tutorial) {
            return res.status(404).json({ message: "Tutorial not found" });
        }

        return res.status(200).json({ likes: tutorial.likes }); 
    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: "Unable to update likes" });
    }
};

// Add a Comment to a Tutorial
const addComment = async (req, res, next) => {
    const id = req.params.id;
    const { user, comment } = req.body;

    if (!user || !comment) {
        return res.status(400).json({ message: "User and comment are required" });
    }

    try {
        const tutorial = await Tutorial.findByIdAndUpdate(
            id,
            { $push: { comments: { user, comment } } }, 
            { new: true }
        );

        if (!tutorial) {
            return res.status(404).json({ message: "Tutorial not found" });
        }

        return res.status(200).json({ comments: tutorial.comments }); 
    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: "Unable to add comment" });
    }
};


const getComments = async (req, res, next) => {
    const id = req.params.id;

    try {
        const tutorial = await Tutorial.findById(id).select('comments'); 
        if (!tutorial) {
            return res.status(404).json({ message: "Tutorial not found" });
        }

        return res.status(200).json({ comments: tutorial.comments });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: "Server error" });
    }
};






module.exports= {
    getAllUsers,
    addTutorial,
    getById,
    updateTutorial,
    deleteTutorial,
    upload, // exports the upload middleware
    likeTutorial, // Export the new like controller
    addComment, // Export the new addComment controller
    getComments, // Export getComments if needed
};



