const Comment = require("../Models/CommentModel");


// Get comments of a specific post
const getCommentsByPostId = async (req, res) => {
    let comments;
    try {
      comments = await Comment.find({ postId: req.params.postId }).sort({ createdAt: -1 }); // Sort by latest
    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: err.message });
    }
    //Comment not found
    if (!comments) {
      return res.status(404).json({ message: "Comments not found" });
    }
    //Display all Comments
    return res.status(200).json({ comments });
  };

// Display All Comments
const getAllComments = async (req, res, next) => {
  let comments;

  try {
    comments = await Comment.find();
  } catch {
    console.log(err);
    return res.status(500).json({ message: "Error retrieving comments", error: err.message });
  }

  //Comment not found
  if (!comments) {
    return res.status(404).json({ message: "Comments not found" });
  }

  //Display all Comments
  return res.status(200).json({ comments });
};

// Comment Creation/Insertion
const addComment = async (req, res, next) => {
  const { postId, content } = req.body;

  let comment;

  try {
    comment = new Comment({
        postId,
        content,
    //   userId: req.user.userId, // Attach the logged-in user's ID to the Comment
    });
    await comment.save();
  } catch (err) {
    console.log(err);
  }

  // If Comment did not insert
  if (!comment) {
    return res.status(404).send({ message: "Unable to add Comment" });
  }
  return res.status(200).json({ comment });
};

// Update Comment Details
const updateComment = async (req, res, next) => {
  const id = req.params.id;
  const { title, description } = req.body;

  let comments;

  try {
    comments = await Comment.findByIdAndUpdate(id, {
      title: title,
      description: description,
    });
    comments = await comments.save();
  } catch (err) {
    console.log(err);
  }

  // If Comment not updated
  if (!comments) {
    return res.status(404).send({ message: "Unable to Update Comment Details" });
  }
  return res.status(200).json({ comments });
};

// Delete Comment Details
const deleteComment = async (req, res, next) => {
  const id = req.params.id;

  let comment;

  try {
    comment = await Comment.findByIdAndDelete(id);
  } catch (err) {
    console.log(err);
  }

  // If Comment did not delete
  if (!comment) {
    return res.status(404).send({ message: "Unable to Delete Comment Details" });
  }
  return res.status(200).json({ comment });
};

exports.getCommentsByPostId = getCommentsByPostId;
exports.getAllComments = getAllComments;
exports.addComment = addComment;
exports.updateComment = updateComment;
exports.deleteComment = deleteComment;
// exports.getSearchComments = getSearchComments;






// // Backend validation
// if (!title || title.trim() === '') {
//   return res.status(400).json({ error: 'Title is required' });
// }
// if (title.length > 100) {
//   return res.status(400).json({ error: 'Title must be less than 100 characters' });
// }
// if (!content || content.trim() === '') {
//   return res.status(400).json({ error: 'Content is required' });
// }
// if (!file.mimetype.startsWith('image/') && !file.mimetype.startsWith('video/')) {
//   return res.status(400).json({ error: 'Only image or video files are allowed' });
// }

// Get all search Comments
//AddPost
// const sendRequest = async () => {
//     formData.append("tag", inputs.tag); // Add the tag to the form data
// };

// <form onSubmit={handleSubmit}></form>
// {/* Tag input field */}
// <input
//     type="text"
//     placeholder="Tag"
//     value={inputs.tag || ''}
//     onChange={(e) => setInputs({ ...inputs, tag: e.target.value })}
//     />
// </form>

// If a select input
// {/* Select Tag Dropdown */}
// <select
// value={inputs.tag || ""}
// onChange={(e) => setInputs({ ...inputs, tag: e.target.value })}
// >

// If multiple tags
// {/* Multi-Select Dropdown for Tags */}
//  <select
//  multiple
//  value={inputs.tags || []}
//  onChange={(e) => {
//    const selectedTags = Array.from(e.target.selectedOptions, option => option.value);
//    setInputs({ ...inputs, tags: selectedTags });
//  }}
// >

// PostModel
// const postSchema = new mongoose.Schema({
//     tag: {
//         type: String,
//         required: false,
//     },
// });

// If multiple tags
// tags: { type: [String], default: [] },  // Array of tags

// PostController
// const addPosts = async (req, res, next) => {
//     const { title, description, tag } = req.body;
//     post = new Post({
//         tag: tag,
//     });
// };

// If multiple tags
// post = new Post({
//     tags: JSON.parse(tags),  // Parse the tags array
// });

// 80% progress viva Task
// try {
//     posts = new Post({
//         title: title,
//         description: description,
//         email: email,
//         mediaUrl: mediaUrl,
//         mediaType: mediaType
//     });
//     await posts.save();
// } catch (err) {
//     console.log(err);
// }
// const [inputs,setInputs] = useState({
//   title:"",
//   description:"",
//   email:"",
//   media:null
// });
// formData.append("email", inputs.email);

// <label for="email">Email:</label>
// <input
//   type="email"
//   name="email"
//   onChange={handleChange}
//   value={inputs.email}
//   required/>
// <br/>
//
// {/* <p className="post-description">{email}</p> */}
