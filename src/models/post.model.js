import mongoose from 'mongoose';

const postSchema = new mongoose.Schema({
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  name: {
    type: String,
    required: false,
  },
  content: {
    type: String,
    required: true,
  },
});

export default mongoose.model('Post', postSchema);
