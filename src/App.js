import React, { useState, useEffect, createContext, useContext } from 'react';
import * as api from './services/api'; // Import the new API service
import { jwtDecode } from 'jwt-decode'; // You'll need to install this: npm install jwt-decode

// Create a context for user data and API functions
const AppContext = createContext(null);

// Component for displaying loading state
const Loading = () => (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="text-2xl text-gray-700">Loading...</div>
    </div>
);

// Component for displaying error messages
const ErrorMessage = ({ message }) => (
    <div className="flex items-center justify-center min-h-screen bg-red-100 text-red-700 p-4 rounded-lg">
      <p>Error: {message}</p>
    </div>
);

// Home Page Component
const HomePage = () => {
  const { navigateToPage, isAuthenticated } = useContext(AppContext);
  return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-green-100 to-blue-200 text-gray-800 p-4">
        <img src="http://googleusercontent.com/file_content/1" alt="Coffee Society Haifa Logo" className="w-48 h-48 mb-8 rounded-full shadow-lg object-contain" />
        <h1 className="text-5xl font-extrabold text-teal-700 mb-6 drop-shadow-md">Coffee Society Haifa</h1>
        <p className="text-xl text-center max-w-2xl mb-10 leading-relaxed">
          Welcome to Haifa's coffee lovers community! Discover new coffee shops, earn points, and get special rewards.
        </p>
        {isAuthenticated ? (
            <button
                onClick={() => navigateToPage('cafeList')}
                className="bg-teal-600 hover:bg-teal-700 text-white font-bold py-3 px-8 rounded-full shadow-lg transition duration-300 ease-in-out transform hover:scale-105"
            >
              View Coffee Shops
            </button>
        ) : (
            <button
                onClick={() => navigateToPage('login')} // Changed to login page
                className="bg-teal-600 hover:bg-teal-700 text-white font-bold py-3 px-8 rounded-full shadow-lg transition duration-300 ease-in-out transform hover:scale-105"
            >
              Join the Coffee Community
            </button>
        )}
      </div>
  );
};

// New Login Component
const LoginPage = () => {
  const { handleLoginSuccess, navigateToPage } = useContext(AppContext);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setLoading(true);
    try {
      const response = await api.loginUser({ email, password });
      const { token, user } = response.data;
      localStorage.setItem('token', token); // Store the token
      handleLoginSuccess(token);
      setMessage('Login successful!');
      // navigateToPage('cafeList'); // Navigation handled by App component after token processing
    } catch (error) {
      console.error("Login error:", error.response ? error.response.data : error.message);
      setMessage(error.response?.data?.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4">
        <div className="w-full max-w-md bg-white rounded-xl shadow-xl p-8 transform transition duration-300 hover:scale-105">
          <h2 className="text-3xl font-bold text-center text-teal-700 mb-8">Login</h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
              <input
                  type="email"
                  id="email"
                  className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-teal-500 focus:border-teal-500"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
              <input
                  type="password"
                  id="password"
                  className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-teal-500 focus:border-teal-500"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
              />
            </div>
            <button
                type="submit"
                className="w-full bg-teal-600 hover:bg-teal-700 text-white font-bold py-3 px-4 rounded-md shadow-md transition duration-300 ease-in-out transform hover:scale-105"
                disabled={loading}
            >
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </form>
          <div className="mt-6 text-center">
            <button
                onClick={() => navigateToPage('register')}
                className="text-teal-600 hover:text-teal-800 text-sm font-medium"
            >
              Don't have an account? Register here
            </button>
          </div>
          {message && <p className="mt-4 text-center text-red-500">{message}</p>}
        </div>
      </div>
  );
};

// New Register Component
const RegisterPage = () => {
  const { handleLoginSuccess, navigateToPage } = useContext(AppContext);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setLoading(true);
    try {
      const response = await api.registerUser({ username, email, password });
      const { token, user } = response.data;
      localStorage.setItem('token', token); // Store the token
      handleLoginSuccess(token);
      setMessage('Registration successful!');
      // navigateToPage('cafeList'); // Navigation handled by App component after token processing
    } catch (error) {
      console.error("Register error:", error.response ? error.response.data : error.message);
      setMessage(error.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4">
        <div className="w-full max-w-md bg-white rounded-xl shadow-xl p-8 transform transition duration-300 hover:scale-105">
          <h2 className="text-3xl font-bold text-center text-teal-700 mb-8">Register</h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700">Username</label>
              <input
                  type="text"
                  id="username"
                  className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-teal-500 focus:border-teal-500"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
              <input
                  type="email"
                  id="email"
                  className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-teal-500 focus:border-teal-500"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
              <input
                  type="password"
                  id="password"
                  className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-teal-500 focus:border-teal-500"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
              />
            </div>
            <button
                type="submit"
                className="w-full bg-teal-600 hover:bg-teal-700 text-white font-bold py-3 px-4 rounded-md shadow-md transition duration-300 ease-in-out transform hover:scale-105"
                disabled={loading}
            >
              {loading ? 'Registering...' : 'Register'}
            </button>
          </form>
          <div className="mt-6 text-center">
            <button
                onClick={() => navigateToPage('login')}
                className="text-teal-600 hover:text-teal-800 text-sm font-medium"
            >
              Already have an account? Login here
            </button>
          </div>
          {message && <p className="mt-4 text-center text-red-500">{message}</p>}
        </div>
      </div>
  );
};


// Cafe List Component (replacing UserDashboard's cafe display)
const CafeListPage = () => {
  const { navigateToPage } = useContext(AppContext);
  const [cafes, setCafes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getCafes = async () => {
      try {
        const response = await api.fetchCafes();
        let fetchedCafes = response.data;

        // Sort cafes: Community partners first, then by rating (descending)
        fetchedCafes.sort((a, b) => {
          if (a.isCommunityPartner && !b.isCommunityPartner) return -1;
          if (!a.isCommunityPartner && b.isCommunityPartner) return 1;
          return (b.rating || 0) - (a.rating || 0);
        });
        setCafes(fetchedCafes);
      } catch (err) {
        console.error("Error fetching cafes:", err.response ? err.response.data : err.message);
        setError("Error loading coffee shops.");
      } finally {
        setLoading(false);
      }
    };

    getCafes();
  }, []);

  if (loading) return <Loading />;
  if (error) return <ErrorMessage message={error} />;

  return (
      <div className="min-h-screen bg-gray-100 p-4 sm:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-gray-800 mb-8 text-center">Coffee Shops</h2>

          {cafes.length === 0 ? (
              <p className="text-center text-gray-600 text-lg">No coffee shops available yet.</p>
          ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {cafes.map(cafe => (
                    <div
                        key={cafe._id} // Assuming _id from MongoDB
                        className="bg-white rounded-xl shadow-md p-4 md:p-6 hover:shadow-lg transition duration-300 cursor-pointer flex flex-col"
                        onClick={() => navigateToPage('cafeDetail', { cafeId: cafe._id })}
                    >
                      <div className="relative w-full h-40 mb-4 rounded-md overflow-hidden">
                        <img
                            src={cafe.imageUrl || "https://placehold.co/600x400/CCCCCC/333333?text=Coffee+Shop"}
                            alt={cafe.name}
                            className="w-full h-full object-cover"
                            onError={(e) => { e.target.onerror = null; e.target.src="https://placehold.co/600x400/CCCCCC/333333?text=Coffee+Shop"; }}
                        />
                        {cafe.isCommunityPartner && (
                            <span className="absolute top-2 left-2 bg-teal-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-md">
                      Community Partner
                    </span>
                        )}
                      </div>
                      <h4 className="text-2xl font-semibold text-teal-700 mb-2">{cafe.name}</h4>
                      <p className="text-gray-600 text-sm mb-2">{cafe.address}</p>
                      <p className="text-yellow-500 text-lg mb-4">Rating: {(cafe.rating || 0).toFixed(1)}/5 ⭐</p>
                    </div>
                ))}
              </div>
          )}
        </div>
      </div>
  );
};


// Scan QR Component
const ScanQRPage = () => {
  const { navigateToPage, userId, username: currentUsername } = useContext(AppContext); // Added currentUsername
  const [message, setMessage] = useState('');
  const [selectedCafeId, setSelectedCafeId] = useState('');
  const [cafes, setCafes] = useState([]);
  const [loadingCafes, setLoadingCafes] = useState(true);
  const [errorCafes, setErrorCafes] = useState(null);
  const [uploadFile, setUploadFile] = useState(null); // Not directly used by the API, but kept for UI
  const [uploading, setUploading] = useState(false); // Not directly used by the API, but kept for UI

  useEffect(() => {
    const getCafes = async () => {
      try {
        const response = await api.fetchCafes();
        setCafes(response.data);
      } catch (err) {
        console.error("Error fetching cafes for QR scan:", err.response ? err.response.data : err.message);
        setErrorCafes("Error loading coffee shops.");
      } finally {
        setLoadingCafes(false);
      }
    };
    getCafes();
  }, []);

  const handleQRScan = async () => {
    setMessage('Scanning QR code...');
    if (!userId) { // Check if user is authenticated (userId from JWT)
      setMessage('Error: User not authenticated.');
      return;
    }
    if (!selectedCafeId) {
      setMessage('Please select a coffee shop before scanning the QR.');
      return;
    }

    try {
      const response = await api.scanQr(selectedCafeId); // Call the backend API
      const cafeName = cafes.find(c => c._id === selectedCafeId)?.name || 'Unknown Coffee Shop';
      setMessage(`🎉 ${response.data.message} for visiting ${cafeName}!`);
    } catch (e) {
      console.error("Error processing QR scan:", e.response ? e.response.data : e.message);
      setMessage(e.response?.data?.message || 'Error processing QR scan. Please try again.');
    }
  };

  const handleFileUpload = async () => {
    // This functionality needs backend implementation for actual file upload and admin approval
    setMessage('Uploading image/invoice is not fully implemented in this client-side demo without a file upload backend endpoint. Please use QR Scan.');
  };

  if (loadingCafes) return <Loading />;
  if (errorCafes) return <ErrorMessage message={errorCafes} />;

  return (
      <div className="min-h-screen bg-gray-100 p-4 sm:p-6 lg:p-8">
        <div className="max-w-xl mx-auto bg-white rounded-xl shadow-lg p-8">
          <h2 className="text-4xl font-bold text-gray-800 mb-8 text-center">Visit Coffee Shop</h2>

          <div className="mb-6">
            <label htmlFor="cafe-select-qr" className="block text-lg font-medium text-gray-700 mb-2">Select Coffee Shop:</label>
            <select
                id="cafe-select-qr"
                className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:ring-teal-500 focus:border-teal-500 text-lg"
                value={selectedCafeId}
                onChange={(e) => setSelectedCafeId(e.target.value)}
                required
            >
              <option value="">-- Select a Coffee Shop --</option>
              {cafes.map(cafe => (
                  <option key={cafe._id} value={cafe._id}>{cafe.name}</option>
              ))}
            </select>
          </div>

          <div className="flex flex-col items-center mb-8 p-6 border border-gray-200 rounded-lg">
            <p className="text-lg font-semibold text-gray-700 mb-4">Scan QR upon entry:</p>
            <button
                onClick={handleQRScan}
                disabled={!selectedCafeId || !userId}
                className={`w-full py-4 px-6 rounded-full font-bold text-xl shadow-lg transition duration-300 ease-in-out transform hover:scale-105 ${
                    selectedCafeId && userId ? 'bg-teal-600 hover:bg-teal-700 text-white' : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
            >
              <i className="fas fa-qrcode mr-3"></i> Scan QR
            </button>
            {!selectedCafeId && <p className="text-red-500 text-sm mt-2">Please select a coffee shop to scan.</p>}
            {!userId && <p className="text-red-500 text-sm mt-2">Please log in to scan QR codes.</p>}
          </div>

          <div className="text-center text-gray-500 font-semibold mb-8">
            OR
          </div>

          <div className="flex flex-col items-center mb-8 p-6 border border-gray-200 rounded-lg">
            <p className="text-lg font-semibold text-gray-700 mb-4">Upload Image / Invoice for approval:</p>
            <input
                type="file"
                onChange={(e) => setUploadFile(e.target.files[0])}
                className="block w-full text-sm text-gray-500
                               file:mr-4 file:py-2 file:px-4
                               file:rounded-full file:border-0
                               file:text-sm file:font-semibold
                               file:bg-violet-50 file:text-teal-700
                               hover:file:bg-violet-100 mb-4"
            />
            <button
                onClick={handleFileUpload}
                disabled={!uploadFile || uploading || !selectedCafeId || !userId}
                className={`w-full py-3 px-6 rounded-full font-bold shadow-md transition duration-300 ease-in-out ${
                    uploadFile && selectedCafeId && userId && !uploading
                        ? 'bg-purple-600 hover:bg-purple-700 text-white transform hover:scale-105'
                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
            >
              {uploading ? 'Uploading...' : 'Upload Image/Invoice'}
            </button>
            {!selectedCafeId && <p className="text-red-500 text-sm mt-2">Please select a coffee shop to upload a file.</p>}
            {!userId && <p className="text-red-500 text-sm mt-2">Please log in to upload files.</p>}
          </div>

          {message && <p className="mt-6 text-center text-sm font-medium text-teal-600">{message}</p>}

          <button
              onClick={() => navigateToPage('cafeList')}
              className="mt-8 bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-6 rounded-full shadow-md transition duration-300 w-full"
          >
            Back to Coffee Shops
          </button>
        </div>
      </div>
  );
};

// Rate Cafe Component
const RateCafePage = () => {
  const { navigateToPage, userId, username: currentUsername } = useContext(AppContext);
  const [cafes, setCafes] = useState([]);
  const [selectedCafeId, setSelectedCafeId] = useState('');
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getCafes = async () => {
      try {
        const response = await api.fetchCafes();
        setCafes(response.data);
      } catch (err) {
        console.error("Error fetching cafes for rating:", err.response ? err.response.data : err.message);
        setError("Error loading coffee shops.");
      } finally {
        setLoading(false);
      }
    };
    getCafes();
  }, []);

  const handleSubmitRating = async (e) => {
    e.preventDefault();
    setMessage('');
    if (!selectedCafeId || rating === 0) {
      setMessage('Please select a coffee shop and provide a rating.');
      return;
    }
    if (!userId) {
      setMessage('Error: User not authenticated.');
      return;
    }

    try {
      const response = await api.sendRating({ cafeId: selectedCafeId, rating, comment }); // Call the backend API
      setMessage(response.data.message || 'Rating submitted successfully!');
      setSelectedCafeId('');
      setRating(0);
      setComment('');
    } catch (e) {
      console.error("Error submitting rating:", e.response ? e.response.data : e.message);
      setMessage(e.response?.data?.message || 'Error submitting rating. Please try again.');
    }
  };

  if (loading) return <Loading />;
  if (error) return <ErrorMessage message={error} />;

  return (
      <div className="min-h-screen bg-gray-100 p-4 sm:p-6 lg:p-8">
        <div className="max-w-xl mx-auto bg-white rounded-xl shadow-lg p-8">
          <h2 className="text-4xl font-bold text-gray-800 mb-8 text-center">Rate a Coffee Shop</h2>
          <form onSubmit={handleSubmitRating} className="space-y-6">
            <div>
              <label htmlFor="cafe-select" className="block text-lg font-medium text-gray-700 mb-2">Select Coffee Shop:</label>
              <select
                  id="cafe-select"
                  className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:ring-teal-500 focus:border-teal-500 text-lg"
                  value={selectedCafeId}
                  onChange={(e) => setSelectedCafeId(e.target.value)}
                  required
              >
                <option value="">-- Select a Coffee Shop --</option>
                {cafes.map(cafe => (
                    <option key={cafe._id} value={cafe._id}>{cafe.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-lg font-medium text-gray-700 mb-2">Rating:</label>
              <div className="flex items-center space-x-1">
                {[1, 2, 3, 4, 5].map((star) => (
                    <span
                        key={star}
                        className={`text-4xl cursor-pointer ${star <= rating ? 'text-yellow-500' : 'text-gray-300'}`}
                        onClick={() => setRating(star)}
                    >
                                    ⭐
                                </span>
                ))}
              </div>
            </div>
            <div>
              <label htmlFor="comment" className="block text-lg font-medium text-gray-700 mb-2">Comment (Optional):</label>
              <textarea
                  id="comment"
                  rows="4"
                  className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:ring-teal-500 focus:border-teal-500 text-lg"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Share your experience..."
              ></textarea>
            </div>
            <button
                type="submit"
                className="w-full bg-teal-600 hover:bg-teal-700 text-white font-bold py-3 px-4 rounded-md shadow-md transition duration-300 ease-in-out transform hover:scale-105"
                disabled={!userId || loading}
            >
              {loading ? 'Submitting...' : 'Submit Rating'}
            </button>
            {!userId && <p className="text-red-500 text-sm mt-2">Please log in to submit a rating.</p>}
          </form>
          {message && <p className="mt-6 text-center text-sm font-medium text-teal-600">{message}</p>}
          <button
              onClick={() => navigateToPage('cafeList')}
              className="mt-8 bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-6 rounded-full shadow-md transition duration-300 w-full"
          >
            Back to Coffee Shops
          </button>
        </div>
      </div>
  );
};


// Cafe Detail Page Component
const CafeDetailPage = ({ cafeId }) => {
  const { navigateToPage } = useContext(AppContext);
  const [cafe, setCafe] = useState(null);
  const [baristas, setBaristas] = useState([]); // State for baristas
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCafeDetails = async () => {
      if (!cafeId) {
        setError("No coffee shop ID provided.");
        setLoading(false);
        return;
      }
      try {
        const cafeResponse = await api.fetchCafes(); // Fetch all cafes for simplicity, then find
        const foundCafe = cafeResponse.data.find(c => c._id === cafeId);

        if (foundCafe) {
          setCafe(foundCafe);
          // Assuming fetchBaristas fetches baristas *for this cafe*
          const baristasResponse = await api.fetchBaristas(cafeId);
          setBaristas(baristasResponse.data);
        } else {
          setError("Coffee shop not found.");
        }
      } catch (err) {
        console.error("Error fetching cafe details or baristas:", err.response ? err.response.data : err.message);
        setError("Error loading coffee shop details.");
      } finally {
        setLoading(false);
      }
    };

    fetchCafeDetails();
  }, [cafeId]); // Re-fetch if cafeId changes

  if (loading) return <Loading />;
  if (error) return <ErrorMessage message={error} />;
  if (!cafe) return <ErrorMessage message="Coffee shop data could not be loaded." />;

  return (
      <div className="min-h-screen bg-gray-100 p-4 sm:p-6 lg:p-8">
        <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg p-8">
          <button
              onClick={() => navigateToPage('cafeList')}
              className="mb-6 bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded-full transition duration-300 flex items-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
            Back to Coffee Shops
          </button>

          <h2 className="text-5xl font-extrabold text-teal-700 mb-6 text-center">{cafe.name}</h2>
          <div className="relative w-full h-80 mb-6 rounded-lg overflow-hidden shadow-lg">
            {/* Image Slider Placeholder - would implement using a library like Swiper.js or custom logic */}
            <img
                src={cafe.imageUrl || "https://placehold.co/800x450/CCCCCC/333333?text=Cafe+Image"}
                alt={cafe.name}
                className="w-full h-full object-cover"
                onError={(e) => { e.target.onerror = null; e.target.src="https://placehold.co/800x450/CCCCCC/333333?text=Cafe+Image"; }}
            />
            {cafe.isCommunityPartner && (
                <span className="absolute bottom-4 right-4 bg-teal-500 text-white text-lg font-bold px-4 py-2 rounded-full shadow-lg">
                  Community Partner
                </span>
            )}
          </div>

          <p className="text-lg text-gray-700 mb-4 text-center">{cafe.description}</p>
          <p className="text-xl text-gray-800 mb-2"><span className="font-semibold">Address:</span> {cafe.address}</p>
          <p className="text-2xl text-yellow-500 mb-4"><span className="font-semibold">Overall Rating:</span> {(cafe.rating || 0).toFixed(1)}/5 ⭐</p>

          {cafe.menu && (
              <div className="mb-6">
                <h3 className="text-3xl font-bold text-gray-800 mb-4">Our Menu</h3>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-2 bg-gray-50 p-4 rounded-lg shadow-inner">
                  {Object.entries(cafe.menu).map(([item, price]) => (
                      <li key={item} className="flex justify-between items-center text-gray-700">
                        <span className="font-medium">{item}</span>
                        <span className="text-teal-600 font-semibold">{price}</span>
                      </li>
                  ))}
                </ul>
              </div>
          )}

          {baristas && baristas.length > 0 && ( // Use the baristas state
              <div>
                <h3 className="text-3xl font-bold text-gray-800 mb-4">Meet Our Baristas</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {baristas.map((barista, index) => (
                      <div key={barista._id || index} className="bg-white border border-gray-200 rounded-lg p-4 text-center shadow-sm">
                        <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 text-3xl font-bold mx-auto mb-3">
                          {barista.name[0].toUpperCase()}
                        </div>
                        <p className="font-semibold text-lg text-gray-800">{barista.name}</p>
                        <p className="text-gray-600 text-sm">{barista.specialty || 'Barista'}</p>
                        <p className="text-yellow-500 text-md mt-1">Rating: {(barista.rating || 0).toFixed(1)}/5 ⭐</p>
                      </div>
                  ))}
                </div>
              </div>
          )}
        </div>
      </div>
  );
};


// Main App Component
const App = () => {
  const [currentPage, setCurrentPage] = useState('home');
  const [userId, setUserId] = useState(null);
  const [username, setUsername] = useState(null); // Renamed from userName to username for consistency with API
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loadingApp, setLoadingApp] = useState(true);
  const [appError, setAppError] = useState(null);
  const [cafeDetailId, setCafeDetailId] = useState(null);

  useEffect(() => {
    // Check for existing token on app load
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decoded = jwtDecode(token);
        // Assuming token has { id: userId, username: username, role: userRole }
        setUserId(decoded.id);
        setUsername(decoded.username);
        setIsAuthenticated(true);
        // Automatically go to cafe list if authenticated
        setCurrentPage('cafeList');
      } catch (error) {
        console.error("Failed to decode token or token is invalid:", error);
        localStorage.removeItem('token'); // Clear invalid token
        setIsAuthenticated(false);
        setUserId(null);
        setUsername(null);
        setCurrentPage('home');
      }
    } else {
      setCurrentPage('home'); // Go to home if no token
    }
    setLoadingApp(false);
  }, []);

  const handleLoginSuccess = (token) => {
    try {
      const decoded = jwtDecode(token);
      setUserId(decoded.id);
      setUsername(decoded.username);
      setIsAuthenticated(true);
      navigateToPage('cafeList'); // Navigate to cafe list after successful login/register
    } catch (error) {
      console.error("Error processing token after login/register:", error);
      setAppError("Failed to process user data after login. Please try again.");
      localStorage.removeItem('token');
      setIsAuthenticated(false);
      setUserId(null);
      setUsername(null);
    }
  };

  const navigateToPage = (page, data = {}) => {
    setCurrentPage(page);
    if (page === 'cafeDetail' && data.cafeId) {
      setCafeDetailId(data.cafeId);
    } else {
      setCafeDetailId(null);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setUserId(null);
    setUsername(null);
    setIsAuthenticated(false);
    setCurrentPage('home');
    console.log("User logged out successfully.");
  };

  if (loadingApp) {
    return <Loading />;
  }

  if (appError) {
    return <ErrorMessage message={appError} />;
  }

  // Render current page based on state
  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <HomePage />;
      case 'login':
        return <LoginPage />;
      case 'register':
        return <RegisterPage />;
      case 'cafeList': // Changed from userDashboard to cafeList
        return <CafeListPage />;
      case 'scanQr': // New component name
        return <ScanQRPage />;
      case 'rateCafe': // New component name
        return <RateCafePage />;
      case 'cafeDetail':
        return <CafeDetailPage cafeId={cafeDetailId} />;
        // Removed adminPartnerDashboard for now, needs backend implementation
      default:
        return <HomePage />;
    }
  };

  return (
      <AppContext.Provider value={{
        userId,
        username,
        isAuthenticated,
        navigateToPage,
        handleLoginSuccess
      }}>
        {/* Global Navigation - visible if user is logged in (isAuthenticated is true) */}
        {isAuthenticated && (
            <nav className="bg-teal-700 p-4 shadow-md sticky top-0 z-10">
              <div className="max-w-7xl mx-auto flex justify-between items-center">
                <div className="flex space-x-4">
                  <button onClick={() => navigateToPage('cafeList')} className="text-white hover:text-teal-200 font-semibold px-3 py-2 rounded-md transition duration-300">
                    Coffee Shops
                  </button>
                  <button onClick={() => navigateToPage('scanQr')} className="text-white hover:text-teal-200 font-semibold px-3 py-2 rounded-md transition duration-300">
                    Scan QR
                  </button>
                  <button onClick={() => navigateToPage('rateCafe')} className="text-white hover:text-teal-200 font-semibold px-3 py-2 rounded-md transition duration-300">
                    Rate Cafe
                  </button>
                  {/* Add other navigation items as needed, potentially for admin/partner dashboards */}
                </div>
                <div className="flex items-center space-x-4">
                  <span className="text-white font-semibold">Hello, {username || 'User'}!</span>
                  <button onClick={handleLogout} className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-md transition duration-300">
                    Logout
                  </button>
                </div>
              </div>
            </nav>
        )}
        {renderPage()}
      </AppContext.Provider>
  );
};

export default App;
