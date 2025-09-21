import React, { useState } from 'react';
import { Sparkles, Video } from 'lucide-react';

function App() {
  const [userPromptInput, setUserPromptInput] = useState('');
  const [statusMessage, setStatusMessage] = useState('');
  const [videoSrc, setVideoSrc] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerateVideo = async () => {
    if (!userPromptInput.trim() || isGenerating) return;
    
    setIsGenerating(true);
    setStatusMessage('Analyzing your script...');
    setVideoSrc('');
    
    try {
      // Simulate video generation process
      await new Promise(resolve => setTimeout(resolve, 1000));
      setStatusMessage('Processing with AI video generator...');
      
      await new Promise(resolve => setTimeout(resolve, 2000));
      setStatusMessage('Rendering your video...');
      
      await new Promise(resolve => setTimeout(resolve, 1500));
      setStatusMessage('Video generation complete!');
      
      // Set a sample video (using a placeholder video URL)
      setVideoSrc('https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4');
      
    } catch (error) {
      setStatusMessage('Error generating video. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <div className="p-3 bg-purple-600 rounded-2xl mr-3">
              <Video className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900">AI Video Generator</h1>
          </div>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Enter your video script and watch as AI transforms it into a professional video.
          </p>
        </div>

        {/* Video Generation Form */}
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-8">
          <div className="space-y-4">
            {/* UserPromptInput */}
            <div>
              <label htmlFor="UserPromptInput" className="block text-sm font-medium text-gray-700 mb-2">
                Enter your video script here
              </label>
              <textarea
                id="UserPromptInput"
                name="UserPromptInput"
                value={userPromptInput}
                onChange={(e) => setUserPromptInput(e.target.value)}
                placeholder="Write your video script here... (e.g., 'A story about a young entrepreneur starting their first business')"
                className="w-full h-32 p-4 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:outline-none resize-none text-gray-700 placeholder-gray-400"
                disabled={isGenerating}
              />
              <div className="absolute bottom-4 right-4 text-sm text-gray-400">
                {userPromptInput.length}/1000
              </div>
            </div>
            
            {/* GenerateButton */}
            <button
              name="GenerateButton"
              onClick={handleGenerateVideo}
              disabled={!userPromptInput.trim() || isGenerating}
              className="w-full flex items-center justify-center gap-2 bg-purple-600 text-white py-4 px-6 rounded-xl font-semibold hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
            >
              {isGenerating ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Generating...
                </>
              ) : (
                <>
                  <Video className="w-5 h-5" />
                  Generate Video
                </>
              )}
            </button>
          </div>
          
          {/* StatusMessage */}
          {statusMessage && (
            <div className="relative">
              <div
                name="StatusMessage"
                className="mt-4 p-4 bg-purple-50 border border-purple-200 rounded-xl"
              >
                <div className="flex items-center gap-3">
                  {isGenerating && (
                    <div className="w-5 h-5 border-2 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
                  )}
                  <span className="text-purple-700 font-medium">{statusMessage}</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* VideoPlayer */}
        {videoSrc && (
          <div className="bg-white rounded-2xl shadow-xl p-6 mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Your Generated Video</h2>
            <div className="aspect-video bg-gray-100 rounded-xl overflow-hidden">
              <video
                name="VideoPlayer"
                src={videoSrc}
                controls
                className="w-full h-full object-cover"
                preload="metadata"
              >
                Your browser does not support the video tag.
              </video>
            </div>
          </div>
        )}

        {/* Feature Information */}
        <div className="grid md:grid-cols-3 gap-4 mt-8">
          {[
            { icon: <Video />, title: 'AI Video Generation', desc: 'Transform scripts into videos' },
            { icon: <Sparkles />, title: 'Smart Processing', desc: 'Advanced AI understanding' },
            { icon: <Video />, title: 'Professional Quality', desc: 'High-resolution output' }
          ].map((feature, index) => (
            <div key={index} className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-200">
              <div className="text-purple-600 mb-3">{feature.icon}</div>
              <h3 className="font-semibold text-gray-900">{feature.title}</h3>
              <p className="text-sm text-gray-600">{feature.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;