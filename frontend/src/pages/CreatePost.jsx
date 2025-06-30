import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function CreatePost() {
  const [content, setContent] = useState('');
  const [image, setImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append('content', content);
      if (image) {
        formData.append('image', image);
      }

      const res = await axios.post('/api/posts', formData, {
        withCredentials: true,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      console.log('Post created:', res.data);
      setContent('');
      setImage(null);
      setPreviewUrl('');
      alert('Post created successfully!');
      navigate('/');
    } catch (err) {
      console.error('Error creating post:', err);
      alert('Error while creating post');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl p-8">
        <h2 className="text-3xl font-bold mb-6 text-center text-blue-700">Create a New Post 📝</h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block font-medium mb-1 text-gray-700">Upload Image</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="w-full text-sm text-gray-600 file:mr-4 file:py-2 file:px-4
                         file:rounded-xl file:border-0 file:text-sm file:font-semibold
                         file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />
          </div>

          {previewUrl && (
            <div className="rounded-xl overflow-hidden border">
              <img
                src={previewUrl}
                alt="Preview"
                className="w-full h-64 object-cover"
              />
            </div>
          )}

          <div>
            <label className="block font-medium mb-1 text-gray-700">Caption</label>
            <textarea
              placeholder="Write something cool..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full border border-gray-300 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none h-28"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 transition disabled:opacity-60"
          >
            {loading ? 'Posting...' : 'Post'}
          </button>
        </form>
      </div>
    </div>
  );
}
