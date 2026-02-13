import React, { useState, useEffect, useRef } from 'react';
import { Heart, Image, MessageCircle, Share2, Sparkles, Download, Upload, X, Plus, Video, Music, Gift, Calendar, Star, Smile, Camera, Send, Play, Pause, ChevronLeft, ChevronRight } from 'lucide-react';

const ValentineWishPage = () => {
  const [activeTab, setActiveTab] = useState('home');
  const [wishData, setWishData] = useState({
    cardTemplate: 'gradient',
    cardLayout: 'classic',
    message: '',
    photos: [],
    videoMessage: null,
    quizAnswers: [],
    recipientName: '',
    senderName: '',
    stickers: [],
    timeline: [],
    backgroundColor: 'gradient1',
    fontStyle: 'romantic',
    musicChoice: 'none',
    customMusicUrl: null,
    scheduledDate: '',
    virtualGifts: []
  });
  const [timeLeft, setTimeLeft] = useState({});
  const [shareableId, setShareableId] = useState(null);
  const [currentQuizQuestion, setCurrentQuizQuestion] = useState(0);
  const [recording, setRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [videoPreview, setVideoPreview] = useState(null);
  const [showStickers, setShowStickers] = useState(false);
  const [activeTimelineItem, setActiveTimelineItem] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.7);
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const audioRef = useRef(null);

  const defaultBackgroundImages = [
    '/becca-tapert-8qxdUJf346A-unsplash.jpg',
    '/priscilla-du-preez-xSAiIM6Wa2c-unsplash.jpg',
    '/sidney-pearce-yPMJliKzyc4-unsplash.jpg'
  ];

  // Countdown timer
  useEffect(() => {
    const valentinesDay = new Date('2026-02-14T00:00:00');

    const timer = setInterval(() => {
      const now = new Date();
      const difference = valentinesDay - now;

      setTimeLeft({
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60)
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Load saved wish
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get('wish');

    if (id) {
      fetch(`/api/wishes?id=${id}`)
        .then(res => res.json())
        .then(result => {
          if (result.success) {
            setWishData(result.data);
            setShareableId(id);
            setActiveTab('view');
          }
        })
        .catch(e => console.error('Failed to load wish:', e));
    }
  }, []);

  // Initialize audio volume and handle music changes
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
      // Reset playing state when music changes
      setIsPlaying(false);
    }
  }, [wishData.musicChoice, wishData.customMusicUrl, volume]);

  // Photo slideshow
  useEffect(() => {
    const photos = wishData.photos.length > 0 ? wishData.photos : defaultBackgroundImages.map(url => ({ url }));
    const interval = setInterval(() => {
      setCurrentPhotoIndex(prev => (prev + 1) % photos.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [wishData.photos.length]);

  const backgroundOptions = {
    gradient1: 'linear-gradient(135deg, #FF6B9D 0%, #C44569 50%, #FFA8A8 100%)',
    gradient2: 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)',
    gradient3: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
    gradient4: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
    gradient5: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
    gradient6: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
    gradient7: 'linear-gradient(135deg, #30cfd0 0%, #330867 100%)',
    sunset: 'linear-gradient(135deg, #ff6b6b 0%, #feca57 50%, #ee5a6f 100%)',
    ocean: 'linear-gradient(135deg, #2E3192 0%, #1BFFFF 100%)',
    royal: 'linear-gradient(135deg, #8e2de2 0%, #4a00e0 100%)',
    rose: 'linear-gradient(135deg, #f857a6 0%, #ff5858 100%)',
    fire: 'linear-gradient(135deg, #FF0844 0%, #FFB199 100%)',
    mint: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
    peach: 'linear-gradient(135deg, #fff1eb 0%, #ace0f9 100%)'
  };

  const romanticSongs = [
    { id: 'upload', name: '🎵 Upload Your Music', preview: null, isUpload: true },
    { id: 'song1', name: 'Perfect (Instrumental)', preview: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3' },
    { id: 'song2', name: 'All of Me (Piano)', preview: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3' },
    { id: 'song3', name: 'A Thousand Years', preview: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3' },
    { id: 'song4', name: 'Can\'t Help Falling in Love', preview: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3' },
    { id: 'none', name: 'No Music', preview: null }
  ];

  const cardTemplates = {
    classic: {
      name: 'Classic Love',
      color: '#ff6b9d',
      shadow: '0 20px 60px rgba(255, 107, 157, 0.4)'
    },
    elegant: {
      name: 'Elegant Romance',
      color: '#c44569',
      shadow: '0 20px 60px rgba(196, 69, 105, 0.4)'
    },
    modern: {
      name: 'Modern Love',
      color: '#6c5ce7',
      shadow: '0 20px 60px rgba(108, 92, 231, 0.4)'
    },
    dreamy: {
      name: 'Dreamy Vibes',
      color: '#a29bfe',
      shadow: '0 20px 60px rgba(162, 155, 254, 0.4)'
    },
    bold: {
      name: 'Bold Heart',
      color: '#fd79a8',
      shadow: '0 20px 60px rgba(253, 121, 168, 0.4)'
    },
    warm: {
      name: 'Warm Embrace',
      color: '#ff7675',
      shadow: '0 20px 60px rgba(255, 118, 117, 0.4)'
    }
  };

  const fontStyles = {
    romantic: "'Playfair Display', serif",
    modern: "'Poppins', sans-serif",
    elegant: "'Crimson Text', serif",
    playful: "'Quicksand', sans-serif",
    classic: "'Lora', serif"
  };

  const stickerOptions = ['❤️', '💕', '💖', '💗', '💝', '💘', '💞', '🌹', '🌺', '🌸', '🦋', '⭐', '✨', '💫', '🎀', '🎁', '🍫', '🌈', '☁️', '🌙'];

  const virtualGiftOptions = [
    { id: 'roses', emoji: '🌹', name: 'Bouquet of Roses' },
    { id: 'chocolate', emoji: '🍫', name: 'Box of Chocolates' },
    { id: 'ring', emoji: '💍', name: 'Promise Ring' },
    { id: 'teddy', emoji: '🧸', name: 'Teddy Bear' },
    { id: 'champagne', emoji: '🥂', name: 'Champagne Toast' },
    { id: 'heart', emoji: '💝', name: 'Heart Box' },
    { id: 'balloons', emoji: '🎈', name: 'Love Balloons' },
    { id: 'cake', emoji: '🎂', name: 'Sweet Cake' }
  ];

  const quizQuestions = [
    {
      question: "What's your ideal date night?",
      options: ["Cozy dinner at home", "Fancy restaurant", "Adventure outdoors", "Movie & cuddles"]
    },
    {
      question: "How do you express love?",
      options: ["Words of affirmation", "Acts of service", "Physical touch", "Quality time"]
    },
    {
      question: "Your perfect gift is...",
      options: ["Handwritten letter", "Surprise getaway", "Jewelry", "Homemade something"]
    },
    {
      question: "Dream romantic getaway?",
      options: ["Beach paradise", "Mountain cabin", "City exploration", "Countryside villa"]
    },
    {
      question: "What makes you feel most loved?",
      options: ["Deep conversations", "Surprise gestures", "Shared laughter", "Comfortable silence"]
    },
    {
      question: "Your love language is...",
      options: ["Words", "Touch", "Gifts", "Time together"]
    },
    {
      question: "Perfect Sunday morning?",
      options: ["Breakfast in bed", "Morning walk", "Sleep in late", "Cook together"]
    }
  ];

  const handlePhotoUpload = (e) => {
    const files = Array.from(e.target.files);
    files.forEach(file => {
      const reader = new FileReader();
      reader.onload = (event) => {
        setWishData(prev => ({
          ...prev,
          photos: [...prev.photos, { url: event.target.result, caption: '', filter: 'none' }]
        }));
      };
      reader.readAsDataURL(file);
    });
  };

  const updatePhotoCaption = (index, caption) => {
    setWishData(prev => ({
      ...prev,
      photos: prev.photos.map((photo, i) =>
        i === index ? { ...photo, caption } : photo
      )
    }));
  };

  const updatePhotoFilter = (index, filter) => {
    setWishData(prev => ({
      ...prev,
      photos: prev.photos.map((photo, i) =>
        i === index ? { ...photo, filter } : photo
      )
    }));
  };

  const removePhoto = (index) => {
    setWishData(prev => ({
      ...prev,
      photos: prev.photos.filter((_, i) => i !== index)
    }));
  };

  const handleQuizAnswer = (answer) => {
    const newAnswers = [...wishData.quizAnswers];
    newAnswers[currentQuizQuestion] = answer;
    setWishData(prev => ({ ...prev, quizAnswers: newAnswers }));

    if (currentQuizQuestion < quizQuestions.length - 1) {
      setCurrentQuizQuestion(currentQuizQuestion + 1);
    }
  };

  const startVideoRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      videoRef.current.srcObject = stream;
      videoRef.current.play();

      const recorder = new MediaRecorder(stream);
      const chunks = [];

      recorder.ondataavailable = (e) => chunks.push(e.data);
      recorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'video/webm' });
        const url = URL.createObjectURL(blob);
        setWishData(prev => ({ ...prev, videoMessage: url }));
        setVideoPreview(url);
        stream.getTracks().forEach(track => track.stop());
      };

      setMediaRecorder(recorder);
      recorder.start();
      setRecording(true);
    } catch (err) {
      alert('Camera access denied. Please enable camera permissions.');
    }
  };

  const stopVideoRecording = () => {
    if (mediaRecorder) {
      mediaRecorder.stop();
      setRecording(false);
    }
  };

  const addSticker = (sticker) => {
    setWishData(prev => ({
      ...prev,
      stickers: [...prev.stickers, {
        emoji: sticker,
        x: Math.random() * 80,
        y: Math.random() * 80,
        size: 40 + Math.random() * 40,
        rotation: Math.random() * 360
      }]
    }));
    setShowStickers(false);
  };

  const addTimelineItem = () => {
    const date = prompt('Enter a date (e.g., "January 2024"):');
    const event = prompt('What happened?');
    if (date && event) {
      setWishData(prev => ({
        ...prev,
        timeline: [...prev.timeline, { date, event }]
      }));
    }
  };

  const addVirtualGift = (giftId) => {
    const gift = virtualGiftOptions.find(g => g.id === giftId);
    if (gift && !wishData.virtualGifts.find(g => g.id === giftId)) {
      setWishData(prev => ({
        ...prev,
        virtualGifts: [...prev.virtualGifts, gift]
      }));
    }
  };

  const generateShareableLink = async () => {
    try {
      const id = Math.random().toString(36).substring(2, 15);
      
      const response = await fetch('/api/wishes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, data: wishData })
      });
      
      if (!response.ok) throw new Error('Failed to save');
      setShareableId(id);
      const url = `${window.location.origin}${window.location.pathname}?wish=${id}`;
      navigator.clipboard.writeText(url);
      return url;
    } catch (error) {
      alert('Failed to generate link. Please check your internet connection.');
      console.error(error);
    }
  };

  const downloadAsImage = () => {
    const canvas = document.createElement('canvas');
    canvas.width = 1200;
    canvas.height = 1600;
    const ctx = canvas.getContext('2d');

    // Background
    ctx.fillStyle = '#FF6B9D';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Card background
    ctx.fillStyle = 'rgba(255, 255, 255, 0.95)';
    ctx.beginPath();
    ctx.roundRect(100, 100, 1000, 1400, 30);
    ctx.fill();

    // Heart emoji
    ctx.font = '120px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('💝', 600, 300);

    // Recipient name
    if (wishData.recipientName) {
      ctx.fillStyle = '#FF6B9D';
      ctx.font = 'bold 60px serif';
      ctx.fillText(`To ${wishData.recipientName},`, 600, 450);
    }

    // Message
    if (wishData.message) {
      ctx.fillStyle = '#444';
      ctx.font = 'italic 32px serif';
      const words = wishData.message.split(' ');
      let line = '';
      let y = 600;
      
      words.forEach(word => {
        const testLine = line + word + ' ';
        const metrics = ctx.measureText(testLine);
        if (metrics.width > 800 && line !== '') {
          ctx.fillText(line, 600, y);
          line = word + ' ';
          y += 50;
        } else {
          line = testLine;
        }
      });
      ctx.fillText(line, 600, y);
    }

    // Sender name
    if (wishData.senderName) {
      ctx.fillStyle = '#FF6B9D';
      ctx.font = 'bold 48px serif';
      ctx.fillText('With all my love,', 600, 1300);
      ctx.fillText(`${wishData.senderName} ❤️`, 600, 1380);
    }

    // Stickers
    wishData.stickers.forEach(sticker => {
      ctx.font = `${sticker.size}px Arial`;
      ctx.save();
      ctx.translate(100 + (sticker.x / 100) * 1000, 100 + (sticker.y / 100) * 1400);
      ctx.rotate((sticker.rotation * Math.PI) / 180);
      ctx.fillText(sticker.emoji, 0, 0);
      ctx.restore();
    });

    // Download
    canvas.toBlob((blob) => {
      const link = document.createElement('a');
      link.download = 'valentine-card.png';
      link.href = URL.createObjectURL(blob);
      link.click();
    });
  };

  const calculateCompatibility = () => {
    return Math.floor(Math.random() * 15) + 85;
  };

  const getFilterStyle = (filter) => {
    const filters = {
      none: 'none',
      sepia: 'sepia(80%)',
      grayscale: 'grayscale(100%)',
      vintage: 'sepia(50%) contrast(1.2)',
      warm: 'sepia(20%) saturate(1.5)',
      cool: 'hue-rotate(180deg) saturate(1.2)',
      dreamy: 'brightness(1.1) contrast(0.9) saturate(1.3)'
    };
    return filters[filter] || 'none';
  };

  const handleMusicUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setWishData(prev => ({ ...prev, customMusicUrl: event.target.result, musicChoice: 'custom' }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleMusicSelect = (songId) => {
    const song = romanticSongs.find(s => s.id === songId);
    if (song) {
      setWishData(prev => ({ ...prev, musicChoice: songId, customMusicUrl: null }));
    }
  };

  const togglePlayPause = async () => {
    if (audioRef.current) {
      console.log('Toggle play/pause clicked. Current state:', isPlaying);
      console.log('Audio source:', getCurrentMusicUrl());
      try {
        if (isPlaying) {
          audioRef.current.pause();
          setIsPlaying(false);
          console.log('Audio paused');
        } else {
          console.log('Attempting to play audio...');
          await audioRef.current.play();
          setIsPlaying(true);
          console.log('Audio playing successfully!');
        }
      } catch (error) {
        console.error('Error playing audio:', error);
        setIsPlaying(false);
        alert('Could not play audio. Please check the browser console for details.');
      }
    } else {
      console.error('Audio ref is null');
    }
  };

  const handleVolumeChange = (e) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
    }
  };

  const getCurrentMusicUrl = () => {
    if (wishData.customMusicUrl) return wishData.customMusicUrl;
    const song = romanticSongs.find(s => s.id === wishData.musicChoice);
    return song?.preview || null;
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'transparent',
      fontFamily: fontStyles[wishData.fontStyle],
      color: '#ffffff',
      position: 'relative',
      overflow: 'hidden',
      transition: 'background 0.5s ease'
    }}>
      {/* Photo slideshow background */}
      <div style={{
        position: 'fixed',
        width: '100%',
        height: '100%',
        top: 0,
        left: 0,
        overflow: 'hidden',
        zIndex: 1
      }}>
        {(wishData.photos.length > 0 ? wishData.photos : defaultBackgroundImages.map(url => ({ url }))).map((photo, i) => (
          <div
            key={i}
            style={{
              position: 'absolute',
              width: '100%',
              height: '100%',
              backgroundImage: `url(${photo.url})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              filter: 'blur(8px) brightness(0.4)',
              opacity: i === currentPhotoIndex ? 1 : 0,
              transition: 'opacity 1s ease-in-out'
            }}
          />
        ))}
      </div>

      {/* Animated floating hearts background */}
      <div style={{
        position: 'fixed',
        width: '100%',
        height: '100%',
        top: 0,
        left: 0,
        pointerEvents: 'none',
        overflow: 'hidden',
        zIndex: 2
      }}>
        {[...Array(15)].map((_, i) => (
          <div
            key={i}
            style={{
              position: 'absolute',
              fontSize: `${20 + Math.random() * 30}px`,
              left: `${Math.random() * 100}%`,
              animation: `float ${5 + Math.random() * 10}s ease-in-out infinite`,
              animationDelay: `${Math.random() * 5}s`,
              opacity: 0.1
            }}
          >
            ❤️
          </div>
        ))}
      </div>

      {/* Main Content */}
      <div style={{ position: 'relative', zIndex: 10 }}>
        {/* Enhanced Navigation */}
        {activeTab !== 'view' && (
          <nav style={{
            padding: '1.5rem 2rem',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            gap: '1rem',
            flexWrap: 'wrap',
            backdropFilter: 'blur(10px)',
            background: 'rgba(255, 255, 255, 0.1)',
            borderBottom: '1px solid rgba(255, 255, 255, 0.2)'
          }}>
            <div style={{
              fontSize: '1.5rem',
              fontWeight: 'bold',
              marginRight: '2rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}>
              💖 LoveWish
            </div>
            {['home', 'quiz', 'card', 'photos', 'video', 'music', 'timeline', 'gifts', 'share'].map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                style={{
                  background: activeTab === tab
                    ? 'rgba(255, 255, 255, 0.25)'
                    : 'rgba(255, 255, 255, 0.1)',
                  border: activeTab === tab
                    ? '2px solid rgba(255, 255, 255, 0.5)'
                    : '1px solid rgba(255, 255, 255, 0.2)',
                  color: '#ffffff',
                  padding: '0.6rem 1.2rem',
                  borderRadius: '25px',
                  cursor: 'pointer',
                  fontSize: '0.85rem',
                  fontFamily: "'Poppins', sans-serif",
                  fontWeight: activeTab === tab ? '600' : '400',
                  textTransform: 'capitalize',
                  transition: 'all 0.3s ease',
                  backdropFilter: 'blur(5px)',
                  boxShadow: activeTab === tab ? '0 4px 15px rgba(255, 255, 255, 0.2)' : 'none'
                }}
                onMouseEnter={(e) => {
                  e.target.style.transform = 'translateY(-2px) scale(1.05)';
                  e.target.style.boxShadow = '0 6px 20px rgba(255, 255, 255, 0.3)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.transform = 'translateY(0) scale(1)';
                  e.target.style.boxShadow = activeTab === tab ? '0 4px 15px rgba(255, 255, 255, 0.2)' : 'none';
                }}
              >
                {tab === 'home' ? '🏠' :
                  tab === 'quiz' ? '💕' :
                    tab === 'card' ? '💌' :
                      tab === 'photos' ? '📸' :
                        tab === 'video' ? '📹' :
                          tab === 'music' ? '🎵' :
                            tab === 'timeline' ? '📅' :
                              tab === 'gifts' ? '🎁' : '🔗'} {tab}
              </button>
            ))}
          </nav>
        )}

        {/* Home Tab - Enhanced */}
        {activeTab === 'home' && (
          <div style={{
            maxWidth: '1400px',
            margin: '0 auto',
            padding: '4rem 2rem',
            textAlign: 'center'
          }}>
            {/* Hero Section */}
            <div style={{ marginBottom: '5rem' }}>
              <div style={{
                fontSize: '8rem',
                marginBottom: '1rem',
                animation: 'pulse 2s ease-in-out infinite'
              }}>
                💝
              </div>
              <h1 style={{
                fontSize: 'clamp(3rem, 10vw, 8rem)',
                fontWeight: '700',
                marginBottom: '1.5rem',
                lineHeight: '1.1',
                letterSpacing: '-3px',
                textShadow: '0 4px 20px rgba(0, 0, 0, 0.3)',
                animation: 'fadeInUp 1s ease-out'
              }}>
                Love Stories
              </h1>
              <p style={{
                fontSize: '1.8rem',
                marginBottom: '1rem',
                fontWeight: '300',
                textShadow: '0 2px 10px rgba(0, 0, 0, 0.2)',
                animation: 'fadeInUp 1.2s ease-out'
              }}>
                Create an unforgettable Valentine's experience
              </p>
              <p style={{
                fontSize: '1.2rem',
                maxWidth: '700px',
                margin: '0 auto',
                lineHeight: '1.8',
                opacity: 0.95,
                fontFamily: "'Poppins', sans-serif",
                animation: 'fadeInUp 1.4s ease-out'
              }}>
                Express your love with personalized cards, photo memories, video messages,
                interactive timelines, and virtual gifts that create lasting moments
              </p>
            </div>

            {/* Countdown Timer - Enhanced */}
            <div style={{
              background: 'rgba(255, 255, 255, 0.15)',
              backdropFilter: 'blur(20px)',
              border: '2px solid rgba(255, 255, 255, 0.25)',
              borderRadius: '30px',
              padding: '3rem 2rem',
              marginBottom: '5rem',
              boxShadow: '0 20px 60px rgba(0, 0, 0, 0.2)',
              animation: 'fadeInUp 1.6s ease-out'
            }}>
              <h2 style={{
                fontSize: '2.5rem',
                marginBottom: '2.5rem',
                fontWeight: '600',
                textShadow: '0 2px 10px rgba(0, 0, 0, 0.2)'
              }}>
                Countdown to Love ❤️
              </h2>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
                gap: '2rem',
                maxWidth: '700px',
                margin: '0 auto'
              }}>
                {Object.entries(timeLeft).map(([unit, value]) => (
                  <div key={unit} style={{
                    background: 'rgba(255, 255, 255, 0.2)',
                    backdropFilter: 'blur(10px)',
                    borderRadius: '20px',
                    padding: '2rem 1rem',
                    border: '2px solid rgba(255, 255, 255, 0.3)',
                    boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
                    transition: 'transform 0.3s ease'
                  }}
                    onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-5px) scale(1.05)'}
                    onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0) scale(1)'}>
                    <div style={{
                      fontSize: '3.5rem',
                      fontWeight: '700',
                      marginBottom: '0.5rem',
                      textShadow: '0 4px 15px rgba(0, 0, 0, 0.3)'
                    }}>
                      {value || '0'}
                    </div>
                    <div style={{
                      fontSize: '1rem',
                      textTransform: 'uppercase',
                      letterSpacing: '2px',
                      fontFamily: "'Poppins', sans-serif",
                      fontWeight: '600',
                      opacity: 0.9
                    }}>
                      {unit}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Features Grid - Enhanced */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
              gap: '2.5rem',
              marginBottom: '4rem',
              animation: 'fadeInUp 1.8s ease-out'
            }}>
              {[
                { icon: '💌', title: 'Custom Cards', desc: 'Beautiful templates with 5 font styles and 14+ vibrant backgrounds', color: '#FF6B9D' },
                { icon: '📸', title: 'Photo Collage', desc: 'Add filters and captions to your cherished memories', color: '#a29bfe' },
                { icon: '📹', title: 'Video Message', desc: 'Record a heartfelt video message directly in the browser', color: '#fd79a8' },
                { icon: '🎵', title: 'Romantic Music', desc: 'Choose from romantic songs or upload your own special track', color: '#FF6B9D' },
                { icon: '💕', title: 'Love Quiz', desc: '7 questions to discover your compatibility percentage', color: '#ff7675' },
                { icon: '📅', title: 'Timeline Story', desc: 'Create a visual journey of your relationship milestones', color: '#6c5ce7' },
                { icon: '🎁', title: 'Virtual Gifts', desc: 'Send roses, chocolates, rings and more adorable gifts', color: '#fd79a8' },
                { icon: '🔗', title: 'Share & Schedule', desc: 'Generate links and schedule delivery for Valentine\'s Day', color: '#ff6b9d' }
              ].map((feature, i) => (
                <div key={i} style={{
                  background: 'rgba(255, 255, 255, 0.12)',
                  backdropFilter: 'blur(15px)',
                  border: '2px solid rgba(255, 255, 255, 0.2)',
                  borderRadius: '25px',
                  padding: '2.5rem',
                  transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                  cursor: 'default',
                  boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
                  position: 'relative',
                  overflow: 'hidden'
                }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-10px) scale(1.02)';
                    e.currentTarget.style.boxShadow = '0 20px 50px rgba(0, 0, 0, 0.2)';
                    e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.4)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0) scale(1)';
                    e.currentTarget.style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.1)';
                    e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.2)';
                  }}>
                  <div style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: '5px',
                    background: `linear-gradient(90deg, ${feature.color}, transparent)`
                  }} />
                  <div style={{ fontSize: '4rem', marginBottom: '1.5rem' }}>{feature.icon}</div>
                  <h3 style={{
                    fontSize: '1.6rem',
                    marginBottom: '1rem',
                    fontWeight: '700',
                    fontFamily: "'Poppins', sans-serif"
                  }}>
                    {feature.title}
                  </h3>
                  <p style={{
                    opacity: 0.9,
                    lineHeight: '1.7',
                    fontFamily: "'Poppins', sans-serif",
                    fontSize: '1rem'
                  }}>
                    {feature.desc}
                  </p>
                </div>
              ))}
            </div>

            {/* CTA Button - Enhanced */}
            <button
              onClick={() => setActiveTab('quiz')}
              style={{
                background: 'rgba(255, 255, 255, 0.95)',
                color: '#6c5ce7',
                border: 'none',
                padding: '1.5rem 4rem',
                fontSize: '1.4rem',
                borderRadius: '60px',
                cursor: 'pointer',
                fontWeight: '700',
                fontFamily: "'Poppins', sans-serif",
                boxShadow: '0 15px 50px rgba(0, 0, 0, 0.3)',
                transition: 'all 0.3s ease',
                animation: 'fadeInUp 2s ease-out, pulse 2s ease-in-out infinite'
              }}
              onMouseEnter={(e) => {
                e.target.style.transform = 'translateY(-5px) scale(1.05)';
                e.target.style.boxShadow = '0 20px 60px rgba(0, 0, 0, 0.4)';
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = 'translateY(0) scale(1)';
                e.target.style.boxShadow = '0 15px 50px rgba(0, 0, 0, 0.3)';
              }}
            >
              Start Your Love Story ✨
            </button>
          </div>
        )}

        {/* Quiz Tab - Enhanced */}
        {activeTab === 'quiz' && (
          <div style={{
            maxWidth: '900px',
            margin: '0 auto',
            padding: '3rem 2rem',
            minHeight: '70vh',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center'
          }}>
            <div style={{
              background: 'rgba(255, 255, 255, 0.15)',
              backdropFilter: 'blur(20px)',
              border: '2px solid rgba(255, 255, 255, 0.25)',
              borderRadius: '30px',
              padding: '3.5rem',
              boxShadow: '0 20px 60px rgba(0, 0, 0, 0.2)'
            }}>
              <div style={{
                textAlign: 'center',
                marginBottom: '3rem'
              }}>
                <div style={{
                  fontSize: '1rem',
                  opacity: 0.8,
                  marginBottom: '1rem',
                  fontFamily: "'Poppins', sans-serif",
                  letterSpacing: '2px',
                  textTransform: 'uppercase',
                  fontWeight: '600'
                }}>
                  Question {currentQuizQuestion + 1} of {quizQuestions.length}
                </div>
                <div style={{
                  width: '100%',
                  height: '6px',
                  background: 'rgba(255, 255, 255, 0.2)',
                  borderRadius: '10px',
                  overflow: 'hidden',
                  marginBottom: '2rem'
                }}>
                  <div style={{
                    width: `${((currentQuizQuestion + 1) / quizQuestions.length) * 100}%`,
                    height: '100%',
                    background: 'linear-gradient(90deg, #ff6b9d, #feca57)',
                    transition: 'width 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                    boxShadow: '0 0 20px rgba(255, 107, 157, 0.6)'
                  }} />
                </div>
              </div>

              <h2 style={{
                fontSize: '2.8rem',
                marginBottom: '3.5rem',
                textAlign: 'center',
                fontWeight: '600',
                lineHeight: '1.3',
                textShadow: '0 2px 10px rgba(0, 0, 0, 0.2)'
              }}>
                {quizQuestions[currentQuizQuestion].question}
              </h2>

              <div style={{
                display: 'grid',
                gap: '1.5rem'
              }}>
                {quizQuestions[currentQuizQuestion].options.map((option, i) => (
                  <button
                    key={i}
                    onClick={() => handleQuizAnswer(option)}
                    style={{
                      background: wishData.quizAnswers[currentQuizQuestion] === option
                        ? 'rgba(255, 255, 255, 0.3)'
                        : 'rgba(255, 255, 255, 0.12)',
                      backdropFilter: 'blur(10px)',
                      border: wishData.quizAnswers[currentQuizQuestion] === option
                        ? '3px solid rgba(255, 255, 255, 0.6)'
                        : '2px solid rgba(255, 255, 255, 0.2)',
                      padding: '1.75rem 2rem',
                      borderRadius: '20px',
                      cursor: 'pointer',
                      fontSize: '1.2rem',
                      color: '#ffffff',
                      textAlign: 'left',
                      transition: 'all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                      fontFamily: "'Poppins', sans-serif",
                      fontWeight: '500',
                      boxShadow: wishData.quizAnswers[currentQuizQuestion] === option
                        ? '0 10px 30px rgba(255, 255, 255, 0.2)'
                        : '0 5px 15px rgba(0, 0, 0, 0.1)'
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.transform = 'translateX(10px) scale(1.02)';
                      e.target.style.boxShadow = '0 15px 40px rgba(255, 255, 255, 0.25)';
                      e.target.style.background = 'rgba(255, 255, 255, 0.25)';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.transform = 'translateX(0) scale(1)';
                      if (wishData.quizAnswers[currentQuizQuestion] !== option) {
                        e.target.style.background = 'rgba(255, 255, 255, 0.12)';
                        e.target.style.boxShadow = '0 5px 15px rgba(0, 0, 0, 0.1)';
                      }
                    }}
                  >
                    {option}
                  </button>
                ))}
              </div>

              {wishData.quizAnswers.length === quizQuestions.length && (
                <div style={{
                  marginTop: '3rem',
                  textAlign: 'center',
                  padding: '3rem',
                  background: 'rgba(255, 255, 255, 0.2)',
                  backdropFilter: 'blur(15px)',
                  borderRadius: '25px',
                  border: '2px solid rgba(255, 255, 255, 0.3)',
                  animation: 'fadeInUp 0.5s ease-out'
                }}>
                  <div style={{
                    fontSize: '5rem',
                    marginBottom: '1rem',
                    animation: 'pulse 1.5s ease-in-out infinite'
                  }}>
                    💖
                  </div>
                  <h3 style={{
                    fontSize: '3rem',
                    marginBottom: '1rem',
                    fontWeight: '700',
                    textShadow: '0 4px 15px rgba(0, 0, 0, 0.2)'
                  }}>
                    {calculateCompatibility()}% Match!
                  </h3>
                  <p style={{
                    fontSize: '1.3rem',
                    marginBottom: '2rem',
                    fontFamily: "'Poppins', sans-serif",
                    opacity: 0.95
                  }}>
                    You two are absolutely perfect together! ✨
                  </p>
                  <button
                    onClick={() => setActiveTab('card')}
                    style={{
                      background: 'rgba(255, 255, 255, 0.95)',
                      color: '#6c5ce7',
                      border: 'none',
                      padding: '1.25rem 3rem',
                      fontSize: '1.1rem',
                      borderRadius: '50px',
                      cursor: 'pointer',
                      fontWeight: '700',
                      fontFamily: "'Poppins', sans-serif",
                      boxShadow: '0 10px 30px rgba(0, 0, 0, 0.2)',
                      transition: 'all 0.3s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.transform = 'translateY(-3px) scale(1.05)';
                      e.target.style.boxShadow = '0 15px 40px rgba(0, 0, 0, 0.3)';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.transform = 'translateY(0) scale(1)';
                      e.target.style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.2)';
                    }}
                  >
                    Continue to Card Design →
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Card Creator Tab - Enhanced */}
        {activeTab === 'card' && (
          <div style={{
            maxWidth: '1100px',
            margin: '0 auto',
            padding: '3rem 2rem'
          }}>
            <h2 style={{
              fontSize: '3.5rem',
              marginBottom: '3rem',
              textAlign: 'center',
              fontWeight: '700',
              textShadow: '0 4px 15px rgba(0, 0, 0, 0.2)'
            }}>
              Design Your Perfect Card 💌
            </h2>

            {/* Customization Options */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
              gap: '2rem',
              marginBottom: '3rem'
            }}>
              {/* Names */}
              <div style={{
                background: 'rgba(255, 255, 255, 0.12)',
                backdropFilter: 'blur(15px)',
                padding: '2rem',
                borderRadius: '20px',
                border: '2px solid rgba(255, 255, 255, 0.2)'
              }}>
                <label style={{
                  display: 'block',
                  marginBottom: '1rem',
                  fontFamily: "'Poppins', sans-serif",
                  fontSize: '1rem',
                  letterSpacing: '1px',
                  textTransform: 'uppercase',
                  fontWeight: '600'
                }}>
                  Your Name
                </label>
                <input
                  type="text"
                  value={wishData.senderName}
                  onChange={(e) => setWishData({ ...wishData, senderName: e.target.value })}
                  placeholder="Enter your name"
                  style={{
                    width: '100%',
                    padding: '1.25rem',
                    background: 'rgba(255, 255, 255, 0.15)',
                    backdropFilter: 'blur(10px)',
                    border: '2px solid rgba(255, 255, 255, 0.25)',
                    borderRadius: '15px',
                    color: '#ffffff',
                    fontSize: '1.1rem',
                    fontFamily: "'Poppins', sans-serif",
                    transition: 'all 0.3s ease'
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = 'rgba(255, 255, 255, 0.5)';
                    e.target.style.background = 'rgba(255, 255, 255, 0.2)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = 'rgba(255, 255, 255, 0.25)';
                    e.target.style.background = 'rgba(255, 255, 255, 0.15)';
                  }}
                />
              </div>

              <div style={{
                background: 'rgba(255, 255, 255, 0.12)',
                backdropFilter: 'blur(15px)',
                padding: '2rem',
                borderRadius: '20px',
                border: '2px solid rgba(255, 255, 255, 0.2)'
              }}>
                <label style={{
                  display: 'block',
                  marginBottom: '1rem',
                  fontFamily: "'Poppins', sans-serif",
                  fontSize: '1rem',
                  letterSpacing: '1px',
                  textTransform: 'uppercase',
                  fontWeight: '600'
                }}>
                  Their Name
                </label>
                <input
                  type="text"
                  value={wishData.recipientName}
                  onChange={(e) => setWishData({ ...wishData, recipientName: e.target.value })}
                  placeholder="Enter their name"
                  style={{
                    width: '100%',
                    padding: '1.25rem',
                    background: 'rgba(255, 255, 255, 0.15)',
                    backdropFilter: 'blur(10px)',
                    border: '2px solid rgba(255, 255, 255, 0.25)',
                    borderRadius: '15px',
                    color: '#ffffff',
                    fontSize: '1.1rem',
                    fontFamily: "'Poppins', sans-serif",
                    transition: 'all 0.3s ease'
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = 'rgba(255, 255, 255, 0.5)';
                    e.target.style.background = 'rgba(255, 255, 255, 0.2)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = 'rgba(255, 255, 255, 0.25)';
                    e.target.style.background = 'rgba(255, 255, 255, 0.15)';
                  }}
                />
              </div>
            </div>

            {/* Background Selection */}
            <div style={{
              background: 'rgba(255, 255, 255, 0.12)',
              backdropFilter: 'blur(15px)',
              padding: '2rem',
              borderRadius: '20px',
              border: '2px solid rgba(255, 255, 255, 0.2)',
              marginBottom: '2rem'
            }}>
              <label style={{
                display: 'block',
                marginBottom: '1.5rem',
                fontFamily: "'Poppins', sans-serif",
                fontSize: '1.1rem',
                letterSpacing: '1px',
                textTransform: 'uppercase',
                fontWeight: '600'
              }}>
                Choose Background
              </label>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))',
                gap: '1rem'
              }}>
                {Object.entries(backgroundOptions).map(([key, gradient]) => (
                  <button
                    key={key}
                    onClick={() => setWishData({ ...wishData, backgroundColor: key })}
                    style={{
                      background: gradient,
                      border: wishData.backgroundColor === key ? '4px solid #ffffff' : '2px solid rgba(255, 255, 255, 0.3)',
                      borderRadius: '15px',
                      height: '80px',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                      boxShadow: wishData.backgroundColor === key ? '0 10px 30px rgba(255, 255, 255, 0.4)' : '0 5px 15px rgba(0, 0, 0, 0.1)',
                      position: 'relative'
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.transform = 'scale(1.1)';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.transform = 'scale(1)';
                    }}
                  />
                ))}
              </div>
            </div>

            {/* Font Style Selection */}
            <div style={{
              background: 'rgba(255, 255, 255, 0.12)',
              backdropFilter: 'blur(15px)',
              padding: '2rem',
              borderRadius: '20px',
              border: '2px solid rgba(255, 255, 255, 0.2)',
              marginBottom: '2rem'
            }}>
              <label style={{
                display: 'block',
                marginBottom: '1.5rem',
                fontFamily: "'Poppins', sans-serif",
                fontSize: '1.1rem',
                letterSpacing: '1px',
                textTransform: 'uppercase',
                fontWeight: '600'
              }}>
                Font Style
              </label>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
                gap: '1rem'
              }}>
                {Object.entries(fontStyles).map(([key, font]) => (
                  <button
                    key={key}
                    onClick={() => setWishData({ ...wishData, fontStyle: key })}
                    style={{
                      background: wishData.fontStyle === key ? 'rgba(255, 255, 255, 0.25)' : 'rgba(255, 255, 255, 0.1)',
                      backdropFilter: 'blur(10px)',
                      border: wishData.fontStyle === key ? '3px solid rgba(255, 255, 255, 0.5)' : '2px solid rgba(255, 255, 255, 0.2)',
                      borderRadius: '15px',
                      padding: '1.5rem 1rem',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                      fontFamily: font,
                      fontSize: '1.2rem',
                      color: '#ffffff'
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.transform = 'scale(1.05)';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.transform = 'scale(1)';
                    }}
                  >
                    {key.charAt(0).toUpperCase() + key.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            {/* Message Input */}
            <div style={{
              background: 'rgba(255, 255, 255, 0.12)',
              backdropFilter: 'blur(15px)',
              padding: '2rem',
              borderRadius: '20px',
              border: '2px solid rgba(255, 255, 255, 0.2)',
              marginBottom: '2rem'
            }}>
              <label style={{
                display: 'block',
                marginBottom: '1rem',
                fontFamily: "'Poppins', sans-serif",
                fontSize: '1.1rem',
                letterSpacing: '1px',
                textTransform: 'uppercase',
                fontWeight: '600'
              }}>
                Your Love Message
              </label>
              <textarea
                value={wishData.message}
                onChange={(e) => setWishData({ ...wishData, message: e.target.value })}
                placeholder="Write your heartfelt message here..."
                rows={8}
                style={{
                  width: '100%',
                  padding: '1.5rem',
                  background: 'rgba(255, 255, 255, 0.15)',
                  backdropFilter: 'blur(10px)',
                  border: '2px solid rgba(255, 255, 255, 0.25)',
                  borderRadius: '15px',
                  color: '#ffffff',
                  fontSize: '1.2rem',
                  fontFamily: fontStyles[wishData.fontStyle],
                  lineHeight: '1.9',
                  resize: 'vertical',
                  transition: 'all 0.3s ease'
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = 'rgba(255, 255, 255, 0.5)';
                  e.target.style.background = 'rgba(255, 255, 255, 0.2)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = 'rgba(255, 255, 255, 0.25)';
                  e.target.style.background = 'rgba(255, 255, 255, 0.15)';
                }}
              />
            </div>

            {/* Stickers Section */}
            <div style={{
              background: 'rgba(255, 255, 255, 0.12)',
              backdropFilter: 'blur(15px)',
              padding: '2rem',
              borderRadius: '20px',
              border: '2px solid rgba(255, 255, 255, 0.2)',
              marginBottom: '3rem'
            }}>
              <label style={{
                display: 'block',
                marginBottom: '1.5rem',
                fontFamily: "'Poppins', sans-serif",
                fontSize: '1.1rem',
                letterSpacing: '1px',
                textTransform: 'uppercase',
                fontWeight: '600'
              }}>
                Add Stickers & Decorations
              </label>
              <button
                onClick={() => setShowStickers(!showStickers)}
                style={{
                  background: 'rgba(255, 255, 255, 0.2)',
                  backdropFilter: 'blur(10px)',
                  border: '2px solid rgba(255, 255, 255, 0.3)',
                  borderRadius: '15px',
                  padding: '1rem 2rem',
                  cursor: 'pointer',
                  fontSize: '1.1rem',
                  color: '#ffffff',
                  fontFamily: "'Poppins', sans-serif",
                  fontWeight: '600',
                  transition: 'all 0.3s ease',
                  marginBottom: showStickers ? '1.5rem' : '0'
                }}
                onMouseEnter={(e) => {
                  e.target.style.transform = 'scale(1.05)';
                  e.target.style.background = 'rgba(255, 255, 255, 0.3)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.transform = 'scale(1)';
                  e.target.style.background = 'rgba(255, 255, 255, 0.2)';
                }}
              >
                {showStickers ? '✨ Hide Stickers' : '✨ Show Stickers'}
              </button>

              {showStickers && (
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(60px, 1fr))',
                  gap: '1rem',
                  animation: 'fadeIn 0.3s ease-out'
                }}>
                  {stickerOptions.map((sticker, i) => (
                    <button
                      key={i}
                      onClick={() => addSticker(sticker)}
                      aria-label={`Add ${sticker} sticker`}
                      style={{
                        background: 'rgba(255, 255, 255, 0.15)',
                        backdropFilter: 'blur(10px)',
                        border: '2px solid rgba(255, 255, 255, 0.25)',
                        borderRadius: '15px',
                        padding: '1rem',
                        cursor: 'pointer',
                        fontSize: '2rem',
                        transition: 'all 0.3s ease'
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.transform = 'scale(1.2) rotate(10deg)';
                        e.target.style.background = 'rgba(255, 255, 255, 0.25)';
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.transform = 'scale(1) rotate(0deg)';
                        e.target.style.background = 'rgba(255, 255, 255, 0.15)';
                      }}
                    >
                      {sticker}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Card Preview */}
            <div id="valentine-card" style={{
              background: 'rgba(255, 255, 255, 0.95)',
              borderRadius: '30px',
              padding: '4rem 3rem',
              minHeight: '500px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              textAlign: 'center',
              position: 'relative',
              overflow: 'hidden',
              border: '3px solid rgba(255, 255, 255, 0.5)',
              boxShadow: '0 30px 80px rgba(0, 0, 0, 0.3)',
              color: '#333'
            }}>
              {/* Card background with selected gradient */}
              <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: backgroundOptions[wishData.backgroundColor],
                opacity: 0.15,
                zIndex: 0
              }} />

              {/* Stickers */}
              {wishData.stickers.map((sticker, i) => (
                <div
                  key={i}
                  style={{
                    position: 'absolute',
                    left: `${sticker.x}%`,
                    top: `${sticker.y}%`,
                    fontSize: `${sticker.size}px`,
                    transform: `rotate(${sticker.rotation}deg)`,
                    zIndex: 1,
                    pointerEvents: 'none'
                  }}
                >
                  {sticker.emoji}
                </div>
              ))}

              <div style={{ position: 'relative', zIndex: 2 }}>
                <div style={{
                  fontSize: '5rem',
                  marginBottom: '2rem',
                  animation: 'pulse 2s ease-in-out infinite'
                }}>
                  💝
                </div>

                {wishData.recipientName && (
                  <div style={{
                    fontSize: '3rem',
                    marginBottom: '2rem',
                    fontWeight: '600',
                    fontFamily: fontStyles[wishData.fontStyle],
                    color: '#FF6B9D'
                  }}>
                    To {wishData.recipientName},
                  </div>
                )}

                <div style={{
                  fontSize: '1.5rem',
                  lineHeight: '2',
                  color: '#444',
                  maxWidth: '700px',
                  marginBottom: '2.5rem',
                  fontFamily: fontStyles[wishData.fontStyle],
                  fontStyle: 'italic'
                }}>
                  {wishData.message || "Your beautiful message will appear here..."}
                </div>

                {wishData.senderName && (
                  <div style={{
                    fontSize: '2rem',
                    fontWeight: '600',
                    fontFamily: fontStyles[wishData.fontStyle],
                    color: '#FF6B9D'
                  }}>
                    With all my love,<br />
                    {wishData.senderName} ❤️
                  </div>
                )}
              </div>
            </div>

            {/* Next Button */}
            <div style={{ textAlign: 'center', marginTop: '3rem' }}>
              <button
                onClick={() => setActiveTab('photos')}
                style={{
                  background: 'rgba(255, 255, 255, 0.95)',
                  color: '#6c5ce7',
                  border: 'none',
                  padding: '1.5rem 4rem',
                  fontSize: '1.3rem',
                  borderRadius: '60px',
                  cursor: 'pointer',
                  fontWeight: '700',
                  fontFamily: "'Poppins', sans-serif",
                  boxShadow: '0 15px 50px rgba(0, 0, 0, 0.3)',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  e.target.style.transform = 'translateY(-5px) scale(1.05)';
                  e.target.style.boxShadow = '0 20px 60px rgba(0, 0, 0, 0.4)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.transform = 'translateY(0) scale(1)';
                  e.target.style.boxShadow = '0 15px 50px rgba(0, 0, 0, 0.3)';
                }}
              >
                Next: Add Photos →
              </button>
            </div>
          </div>
        )}

        {/* Photos Tab - Enhanced */}
        {activeTab === 'photos' && (
          <div style={{
            maxWidth: '1200px',
            margin: '0 auto',
            padding: '3rem 2rem'
          }}>
            <h2 style={{
              fontSize: '3.5rem',
              marginBottom: '1.5rem',
              textAlign: 'center',
              fontWeight: '700',
              textShadow: '0 4px 15px rgba(0, 0, 0, 0.2)'
            }}>
              Memory Collage 📸
            </h2>
            <p style={{
              textAlign: 'center',
              opacity: 0.95,
              marginBottom: '3rem',
              fontFamily: "'Poppins', sans-serif",
              fontSize: '1.3rem'
            }}>
              Upload your favorite moments and add filters
            </p>

            {/* Upload Button */}
            <div style={{
              marginBottom: '3rem',
              textAlign: 'center'
            }}>
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handlePhotoUpload}
                style={{ display: 'none' }}
                id="photo-upload"
              />
              <label
                htmlFor="photo-upload"
                style={{
                  display: 'inline-block',
                  background: 'rgba(255, 255, 255, 0.9)',
                  color: '#6c5ce7',
                  padding: '1.5rem 3rem',
                  borderRadius: '50px',
                  cursor: 'pointer',
                  fontFamily: "'Poppins', sans-serif",
                  fontWeight: '700',
                  fontSize: '1.2rem',
                  boxShadow: '0 15px 40px rgba(0, 0, 0, 0.2)',
                  transition: 'all 0.3s ease',
                  border: '3px solid rgba(255, 255, 255, 0.5)'
                }}
                onMouseEnter={(e) => {
                  e.target.style.transform = 'translateY(-3px) scale(1.05)';
                  e.target.style.boxShadow = '0 20px 50px rgba(0, 0, 0, 0.3)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.transform = 'translateY(0) scale(1)';
                  e.target.style.boxShadow = '0 15px 40px rgba(0, 0, 0, 0.2)';
                }}
              >
                📸 Upload Photos
              </label>
            </div>

            {/* Photo Grid */}
            {wishData.photos.length > 0 ? (
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
                gap: '2.5rem'
              }}>
                {wishData.photos.map((photo, index) => (
                  <div
                    key={index}
                    style={{
                      background: 'rgba(255, 255, 255, 0.12)',
                      backdropFilter: 'blur(15px)',
                      border: '2px solid rgba(255, 255, 255, 0.25)',
                      borderRadius: '25px',
                      overflow: 'hidden',
                      transition: 'all 0.3s ease',
                      boxShadow: '0 10px 30px rgba(0, 0, 0, 0.2)'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateY(-5px)';
                      e.currentTarget.style.boxShadow = '0 20px 50px rgba(0, 0, 0, 0.3)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.2)';
                    }}
                  >
                    <div style={{
                      position: 'relative',
                      paddingTop: '100%',
                      overflow: 'hidden'
                    }}>
                      <img
                        src={photo.url}
                        alt={`Memory ${index + 1}`}
                        style={{
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover',
                          filter: getFilterStyle(photo.filter)
                        }}
                      />
                      <button
                        onClick={() => removePhoto(index)}
                        aria-label="Remove photo"
                        style={{
                          position: 'absolute',
                          top: '15px',
                          right: '15px',
                          background: 'rgba(0, 0, 0, 0.7)',
                          backdropFilter: 'blur(10px)',
                          border: 'none',
                          borderRadius: '50%',
                          width: '40px',
                          height: '40px',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          transition: 'all 0.3s ease',
                          boxShadow: '0 4px 15px rgba(0, 0, 0, 0.3)'
                        }}
                        onMouseEnter={(e) => {
                          e.target.style.background = 'rgba(255, 107, 157, 0.9)';
                          e.target.style.transform = 'scale(1.1)';
                        }}
                        onMouseLeave={(e) => {
                          e.target.style.background = 'rgba(0, 0, 0, 0.7)';
                          e.target.style.transform = 'scale(1)';
                        }}
                      >
                        <X size={20} color="#fff" />
                      </button>
                    </div>
                    <div style={{ padding: '1.5rem' }}>
                      {/* Filter Selection */}
                      <div style={{ marginBottom: '1rem' }}>
                        <label style={{
                          display: 'block',
                          marginBottom: '0.5rem',
                          fontFamily: "'Poppins', sans-serif",
                          fontSize: '0.85rem',
                          fontWeight: '600',
                          textTransform: 'uppercase',
                          letterSpacing: '1px',
                          opacity: 0.9
                        }}>
                          Filter
                        </label>
                        <select
                          value={photo.filter}
                          onChange={(e) => updatePhotoFilter(index, e.target.value)}
                          style={{
                            width: '100%',
                            padding: '0.75rem',
                            background: 'rgba(255, 255, 255, 0.15)',
                            backdropFilter: 'blur(10px)',
                            border: '2px solid rgba(255, 255, 255, 0.25)',
                            borderRadius: '10px',
                            color: '#ffffff',
                            fontSize: '1rem',
                            fontFamily: "'Poppins', sans-serif",
                            cursor: 'pointer'
                          }}
                        >
                          <option value="none" style={{ color: '#333' }}>No Filter</option>
                          <option value="sepia" style={{ color: '#333' }}>Sepia</option>
                          <option value="grayscale" style={{ color: '#333' }}>Grayscale</option>
                          <option value="vintage" style={{ color: '#333' }}>Vintage</option>
                          <option value="warm" style={{ color: '#333' }}>Warm</option>
                          <option value="cool" style={{ color: '#333' }}>Cool</option>
                          <option value="dreamy" style={{ color: '#333' }}>Dreamy</option>
                        </select>
                      </div>
                      {/* Caption Input */}
                      <input
                        type="text"
                        value={photo.caption}
                        onChange={(e) => updatePhotoCaption(index, e.target.value)}
                        placeholder="Add a caption..."
                        style={{
                          width: '100%',
                          background: 'transparent',
                          border: 'none',
                          borderBottom: '2px solid rgba(255, 255, 255, 0.3)',
                          color: '#ffffff',
                          padding: '0.75rem 0',
                          fontSize: '1rem',
                          fontFamily: "'Poppins', sans-serif",
                          fontStyle: 'italic',
                          transition: 'all 0.3s ease'
                        }}
                        onFocus={(e) => {
                          e.target.style.borderBottomColor = 'rgba(255, 255, 255, 0.6)';
                        }}
                        onBlur={(e) => {
                          e.target.style.borderBottomColor = 'rgba(255, 255, 255, 0.3)';
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div style={{
                textAlign: 'center',
                padding: '5rem 2rem',
                fontSize: '1.5rem',
                fontFamily: "'Poppins', sans-serif",
                opacity: 0.7
              }}>
                No photos yet. Upload your favorite memories! 📷✨
              </div>
            )}

            {/* Skip/Next Buttons */}
            <div style={{ textAlign: 'center', marginTop: '3rem', display: 'flex', gap: '1.5rem', justifyContent: 'center', flexWrap: 'wrap' }}>
              <button
                onClick={() => setActiveTab('video')}
                style={{
                  background: 'rgba(255, 255, 255, 0.2)',
                  backdropFilter: 'blur(10px)',
                  color: '#ffffff',
                  border: '2px solid rgba(255, 255, 255, 0.3)',
                  padding: '1.25rem 3rem',
                  fontSize: '1.1rem',
                  borderRadius: '50px',
                  cursor: 'pointer',
                  fontWeight: '600',
                  fontFamily: "'Poppins', sans-serif",
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  e.target.style.background = 'rgba(255, 255, 255, 0.3)';
                  e.target.style.transform = 'scale(1.05)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = 'rgba(255, 255, 255, 0.2)';
                  e.target.style.transform = 'scale(1)';
                }}
              >
                Skip Photos
              </button>
              <button
                onClick={() => setActiveTab('video')}
                style={{
                  background: 'rgba(255, 255, 255, 0.95)',
                  color: '#6c5ce7',
                  border: 'none',
                  padding: '1.5rem 4rem',
                  fontSize: '1.3rem',
                  borderRadius: '60px',
                  cursor: 'pointer',
                  fontWeight: '700',
                  fontFamily: "'Poppins', sans-serif",
                  boxShadow: '0 15px 50px rgba(0, 0, 0, 0.3)',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  e.target.style.transform = 'translateY(-5px) scale(1.05)';
                  e.target.style.boxShadow = '0 20px 60px rgba(0, 0, 0, 0.4)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.transform = 'translateY(0) scale(1)';
                  e.target.style.boxShadow = '0 15px 50px rgba(0, 0, 0, 0.3)';
                }}
              >
                Next: Video Message →
              </button>
            </div>
          </div>
        )}

        {/* Video Message Tab */}
        {activeTab === 'video' && (
          <div style={{
            maxWidth: '900px',
            margin: '0 auto',
            padding: '3rem 2rem'
          }}>
            <h2 style={{
              fontSize: '3.5rem',
              marginBottom: '1.5rem',
              textAlign: 'center',
              fontWeight: '700',
              textShadow: '0 4px 15px rgba(0, 0, 0, 0.2)'
            }}>
              Record Video Message 📹
            </h2>
            <p style={{
              textAlign: 'center',
              opacity: 0.95,
              marginBottom: '3rem',
              fontFamily: "'Poppins', sans-serif",
              fontSize: '1.3rem'
            }}>
              Record a heartfelt video message for your loved one
            </p>

            <div style={{
              background: 'rgba(255, 255, 255, 0.12)',
              backdropFilter: 'blur(20px)',
              border: '2px solid rgba(255, 255, 255, 0.25)',
              borderRadius: '30px',
              padding: '3rem',
              textAlign: 'center'
            }}>
              {!wishData.videoMessage && !recording && (
                <div>
                  <div style={{ fontSize: '6rem', marginBottom: '2rem' }}>🎥</div>
                  <button
                    onClick={startVideoRecording}
                    style={{
                      background: 'rgba(255, 255, 255, 0.9)',
                      color: '#6c5ce7',
                      border: 'none',
                      padding: '1.5rem 3rem',
                      fontSize: '1.3rem',
                      borderRadius: '50px',
                      cursor: 'pointer',
                      fontWeight: '700',
                      fontFamily: "'Poppins', sans-serif",
                      boxShadow: '0 15px 40px rgba(0, 0, 0, 0.2)',
                      transition: 'all 0.3s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.transform = 'translateY(-3px) scale(1.05)';
                      e.target.style.boxShadow = '0 20px 50px rgba(0, 0, 0, 0.3)';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.transform = 'translateY(0) scale(1)';
                      e.target.style.boxShadow = '0 15px 40px rgba(0, 0, 0, 0.2)';
                    }}
                  >
                    Start Recording
                  </button>
                </div>
              )}

              {recording && (
                <div>
                  <video
                    ref={videoRef}
                    style={{
                      width: '100%',
                      maxWidth: '600px',
                      borderRadius: '20px',
                      marginBottom: '2rem',
                      border: '3px solid rgba(255, 255, 255, 0.3)'
                    }}
                    muted
                  />
                  <button
                    onClick={stopVideoRecording}
                    style={{
                      background: '#ff6b9d',
                      color: '#ffffff',
                      border: 'none',
                      padding: '1.5rem 3rem',
                      fontSize: '1.3rem',
                      borderRadius: '50px',
                      cursor: 'pointer',
                      fontWeight: '700',
                      fontFamily: "'Poppins', sans-serif",
                      boxShadow: '0 15px 40px rgba(255, 107, 157, 0.4)',
                      transition: 'all 0.3s ease',
                      animation: 'pulse 1.5s ease-in-out infinite'
                    }}
                  >
                    🔴 Stop Recording
                  </button>
                </div>
              )}

              {wishData.videoMessage && !recording && (
                <div>
                  <video
                    src={wishData.videoMessage}
                    controls
                    style={{
                      width: '100%',
                      maxWidth: '600px',
                      borderRadius: '20px',
                      marginBottom: '2rem',
                      border: '3px solid rgba(255, 255, 255, 0.3)'
                    }}
                  />
                  <button
                    onClick={() => setWishData({ ...wishData, videoMessage: null })}
                    style={{
                      background: 'rgba(255, 255, 255, 0.2)',
                      backdropFilter: 'blur(10px)',
                      color: '#ffffff',
                      border: '2px solid rgba(255, 255, 255, 0.3)',
                      padding: '1rem 2rem',
                      fontSize: '1.1rem',
                      borderRadius: '50px',
                      cursor: 'pointer',
                      fontWeight: '600',
                      fontFamily: "'Poppins', sans-serif",
                      transition: 'all 0.3s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.background = 'rgba(255, 255, 255, 0.3)';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.background = 'rgba(255, 255, 255, 0.2)';
                    }}
                  >
                    Record New Video
                  </button>
                </div>
              )}
            </div>

            {/* Skip/Next Buttons */}
            <div style={{ textAlign: 'center', marginTop: '3rem', display: 'flex', gap: '1.5rem', justifyContent: 'center', flexWrap: 'wrap' }}>
              <button
                onClick={() => setActiveTab('music')}
                style={{
                  background: 'rgba(255, 255, 255, 0.2)',
                  backdropFilter: 'blur(10px)',
                  color: '#ffffff',
                  border: '2px solid rgba(255, 255, 255, 0.3)',
                  padding: '1.25rem 3rem',
                  fontSize: '1.1rem',
                  borderRadius: '50px',
                  cursor: 'pointer',
                  fontWeight: '600',
                  fontFamily: "'Poppins', sans-serif",
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  e.target.style.background = 'rgba(255, 255, 255, 0.3)';
                  e.target.style.transform = 'scale(1.05)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = 'rgba(255, 255, 255, 0.2)';
                  e.target.style.transform = 'scale(1)';
                }}
              >
                Skip Video
              </button>
              <button
                onClick={() => setActiveTab('music')}
                style={{
                  background: 'rgba(255, 255, 255, 0.95)',
                  color: '#6c5ce7',
                  border: 'none',
                  padding: '1.5rem 4rem',
                  fontSize: '1.3rem',
                  borderRadius: '60px',
                  cursor: 'pointer',
                  fontWeight: '700',
                  fontFamily: "'Poppins', sans-serif",
                  boxShadow: '0 15px 50px rgba(0, 0, 0, 0.3)',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  e.target.style.transform = 'translateY(-5px) scale(1.05)';
                  e.target.style.boxShadow = '0 20px 60px rgba(0, 0, 0, 0.4)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.transform = 'translateY(0) scale(1)';
                  e.target.style.boxShadow = '0 15px 50px rgba(0, 0, 0, 0.3)';
                }}
              >
                Next: Add Music →
              </button>
            </div>
          </div>
        )}

        {/* Music Tab - NEW */}
        {activeTab === 'music' && (
          <div style={{
            maxWidth: '1000px',
            margin: '0 auto',
            padding: '3rem 2rem'
          }}>
            <h2 style={{
              fontSize: '3.5rem',
              marginBottom: '1.5rem',
              textAlign: 'center',
              fontWeight: '700',
              textShadow: '0 4px 15px rgba(0, 0, 0, 0.2)'
            }}>
              Romantic Music 🎵
            </h2>
            <p style={{
              textAlign: 'center',
              opacity: 0.95,
              marginBottom: '3rem',
              fontFamily: "'Poppins', sans-serif",
              fontSize: '1.3rem'
            }}>
              Choose a romantic song or upload your own special track
            </p>

            {/* Song Selection */}
            <div style={{
              background: 'rgba(255, 255, 255, 0.12)',
              backdropFilter: 'blur(20px)',
              border: '2px solid rgba(255, 255, 255, 0.25)',
              borderRadius: '25px',
              padding: '3rem',
              marginBottom: '2rem',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '4rem', marginBottom: '1.5rem' }}>🎵</div>
              <h3 style={{
                fontSize: '2rem',
                marginBottom: '1.5rem',
                fontFamily: "'Poppins', sans-serif",
                fontWeight: '600'
              }}>
                Upload Your Special Song
              </h3>
              <p style={{
                opacity: 0.9,
                marginBottom: '2.5rem',
                fontFamily: "'Poppins', sans-serif",
                fontSize: '1.1rem',
                lineHeight: '1.7'
              }}>
                Make your Valentine's card extra special by adding your favorite romantic song!
                <br />Choose an MP3, WAV, or any audio file from your device.
              </p>

              <input
                type="file"
                accept="audio/*"
                onChange={handleMusicUpload}
                style={{ display: 'none' }}
                id="music-upload-main"
              />
              <label
                htmlFor="music-upload-main"
                style={{
                  display: 'inline-block',
                  background: 'linear-gradient(135deg, #FF6B9D, #C44569)',
                  color: '#ffffff',
                  padding: '1.5rem 4rem',
                  borderRadius: '60px',
                  cursor: 'pointer',
                  fontFamily: "'Poppins', sans-serif",
                  fontWeight: '700',
                  fontSize: '1.3rem',
                  boxShadow: '0 15px 40px rgba(255, 107, 157, 0.4)',
                  transition: 'all 0.3s ease',
                  border: 'none'
                }}
                onMouseEnter={(e) => {
                  e.target.style.transform = 'translateY(-5px) scale(1.05)';
                  e.target.style.boxShadow = '0 20px 50px rgba(255, 107, 157, 0.5)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.transform = 'translateY(0) scale(1)';
                  e.target.style.boxShadow = '0 15px 40px rgba(255, 107, 157, 0.4)';
                }}
              >
                📤 Choose Music File
              </label>

              {wishData.customMusicUrl && (
                <div style={{
                  marginTop: '2rem',
                  padding: '1.5rem',
                  background: 'rgba(67, 233, 123, 0.2)',
                  borderRadius: '20px',
                  fontFamily: "'Poppins', sans-serif",
                  fontSize: '1.2rem',
                  border: '2px solid rgba(67, 233, 123, 0.4)'
                }}>
                  ✅ Music uploaded successfully!
                </div>
              )}
            </div>

            {/* Audio Player */}
            {getCurrentMusicUrl() && (
              <div style={{
                background: 'rgba(255, 255, 255, 0.15)',
                backdropFilter: 'blur(20px)',
                border: '2px solid rgba(255, 255, 255, 0.25)',
                borderRadius: '25px',
                padding: '2.5rem',
                textAlign: 'center'
              }}>
                <h3 style={{
                  fontSize: '1.8rem',
                  marginBottom: '2rem',
                  fontFamily: "'Poppins', sans-serif",
                  fontWeight: '600'
                }}>
                  Preview Your Music 🎧
                </h3>

                <div style={{
                  display: 'flex',
                  justifyContent: 'center',
                  gap: '2rem',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  marginBottom: '1.5rem'
                }}>
                  <button
                    onClick={togglePlayPause}
                    aria-label={isPlaying ? "Pause music" : "Play music"}
                    style={{
                      background: 'rgba(255, 255, 255, 0.9)',
                      border: 'none',
                      borderRadius: '50%',
                      width: '80px',
                      height: '80px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '2rem',
                      boxShadow: '0 10px 30px rgba(0, 0, 0, 0.3)',
                      transition: 'all 0.3s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.transform = 'scale(1.1)';
                      e.target.style.boxShadow = '0 15px 40px rgba(0, 0, 0, 0.4)';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.transform = 'scale(1)';
                      e.target.style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.3)';
                    }}
                  >
                    {isPlaying ? <Pause size={32} color="#6c5ce7" /> : <Play size={32} color="#6c5ce7" />}
                  </button>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '1rem',
                    flexGrow: 1,
                    maxWidth: '400px'
                  }}>
                    <span style={{ fontSize: '1.5rem' }}>🔊</span>
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.01"
                      value={volume}
                      onChange={handleVolumeChange}
                      aria-label="Volume control"
                      style={{
                        flexGrow: 1,
                        height: '8px',
                        borderRadius: '10px',
                        background: 'rgba(255, 255, 255, 0.3)',
                        outline: 'none',
                        cursor: 'pointer'
                      }}
                    />
                    <span style={{
                      fontFamily: "'Poppins', sans-serif",
                      fontSize: '1rem',
                      minWidth: '45px'
                    }}>
                      {Math.round(volume * 100)}%
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Timeline Tab */}
        {activeTab === 'timeline' && (
          <div style={{
            maxWidth: '1000px',
            margin: '0 auto',
            padding: '3rem 2rem'
          }}>
            <h2 style={{
              fontSize: '3.5rem',
              marginBottom: '1.5rem',
              textAlign: 'center',
              fontWeight: '700',
              textShadow: '0 4px 15px rgba(0, 0, 0, 0.2)'
            }}>
              Our Love Story Timeline 📅
            </h2>
            <p style={{
              textAlign: 'center',
              opacity: 0.95,
              marginBottom: '3rem',
              fontFamily: "'Poppins', sans-serif",
              fontSize: '1.3rem'
            }}>
              Add important dates and milestones in your relationship
            </p>

            <div style={{
              textAlign: 'center',
              marginBottom: '3rem'
            }}>
              <button
                onClick={addTimelineItem}
                style={{
                  background: 'rgba(255, 255, 255, 0.9)',
                  color: '#6c5ce7',
                  border: 'none',
                  padding: '1.25rem 2.5rem',
                  fontSize: '1.1rem',
                  borderRadius: '50px',
                  cursor: 'pointer',
                  fontWeight: '700',
                  fontFamily: "'Poppins', sans-serif",
                  boxShadow: '0 10px 30px rgba(0, 0, 0, 0.2)',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  e.target.style.transform = 'translateY(-3px)';
                  e.target.style.boxShadow = '0 15px 40px rgba(0, 0, 0, 0.3)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.transform = 'translateY(0)';
                  e.target.style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.2)';
                }}
              >
                + Add Milestone
              </button>
            </div>

            {wishData.timeline.length > 0 ? (
              <div style={{
                position: 'relative',
                paddingLeft: '3rem'
              }}>
                {/* Timeline line */}
                <div style={{
                  position: 'absolute',
                  left: '1rem',
                  top: '2rem',
                  bottom: '2rem',
                  width: '3px',
                  background: 'linear-gradient(180deg, rgba(255, 255, 255, 0.5), rgba(255, 255, 255, 0.1))'
                }} />

                {wishData.timeline.map((item, index) => (
                  <div
                    key={index}
                    style={{
                      position: 'relative',
                      marginBottom: '3rem',
                      paddingLeft: '2rem'
                    }}
                  >
                    {/* Timeline dot */}
                    <div style={{
                      position: 'absolute',
                      left: '-1.4rem',
                      top: '0.5rem',
                      width: '2rem',
                      height: '2rem',
                      borderRadius: '50%',
                      background: 'rgba(255, 255, 255, 0.9)',
                      border: '3px solid rgba(255, 107, 157, 0.8)',
                      boxShadow: '0 0 20px rgba(255, 107, 157, 0.6)'
                    }} />

                    <div style={{
                      background: 'rgba(255, 255, 255, 0.12)',
                      backdropFilter: 'blur(15px)',
                      border: '2px solid rgba(255, 255, 255, 0.25)',
                      borderRadius: '20px',
                      padding: '2rem',
                      transition: 'all 0.3s ease'
                    }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'translateX(10px)';
                        e.currentTarget.style.background = 'rgba(255, 255, 255, 0.18)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'translateX(0)';
                        e.currentTarget.style.background = 'rgba(255, 255, 255, 0.12)';
                      }}>
                      <div style={{
                        fontSize: '1.1rem',
                        fontWeight: '700',
                        marginBottom: '0.5rem',
                        fontFamily: "'Poppins', sans-serif",
                        opacity: 0.9
                      }}>
                        {item.date}
                      </div>
                      <div style={{
                        fontSize: '1.3rem',
                        lineHeight: '1.7',
                        fontFamily: fontStyles[wishData.fontStyle]
                      }}>
                        {item.event}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div style={{
                textAlign: 'center',
                padding: '5rem 2rem',
                fontSize: '1.5rem',
                fontFamily: "'Poppins', sans-serif",
                opacity: 0.7
              }}>
                No timeline items yet. Start adding your special moments! 💕
              </div>
            )}
          </div>
        )}

        {/* Virtual Gifts Tab */}
        {activeTab === 'gifts' && (
          <div style={{
            maxWidth: '1000px',
            margin: '0 auto',
            padding: '3rem 2rem'
          }}>
            <h2 style={{
              fontSize: '3.5rem',
              marginBottom: '1.5rem',
              textAlign: 'center',
              fontWeight: '700',
              textShadow: '0 4px 15px rgba(0, 0, 0, 0.2)'
            }}>
              Virtual Gifts 🎁
            </h2>
            <p style={{
              textAlign: 'center',
              opacity: 0.95,
              marginBottom: '3rem',
              fontFamily: "'Poppins', sans-serif",
              fontSize: '1.3rem'
            }}>
              Send adorable virtual gifts with your wish
            </p>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '2rem',
              marginBottom: '3rem'
            }}>
              {virtualGiftOptions.map((gift) => {
                const isSelected = wishData.virtualGifts.find(g => g.id === gift.id);
                return (
                  <button
                    key={gift.id}
                    onClick={() => addVirtualGift(gift.id)}
                    style={{
                      background: isSelected
                        ? 'rgba(255, 255, 255, 0.25)'
                        : 'rgba(255, 255, 255, 0.12)',
                      backdropFilter: 'blur(15px)',
                      border: isSelected
                        ? '3px solid rgba(255, 255, 255, 0.5)'
                        : '2px solid rgba(255, 255, 255, 0.25)',
                      borderRadius: '25px',
                      padding: '2.5rem 1.5rem',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                      boxShadow: isSelected
                        ? '0 15px 40px rgba(255, 255, 255, 0.3)'
                        : '0 10px 30px rgba(0, 0, 0, 0.1)'
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.transform = 'translateY(-10px) scale(1.05)';
                      e.target.style.boxShadow = '0 20px 50px rgba(255, 255, 255, 0.3)';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.transform = 'translateY(0) scale(1)';
                      e.target.style.boxShadow = isSelected
                        ? '0 15px 40px rgba(255, 255, 255, 0.3)'
                        : '0 10px 30px rgba(0, 0, 0, 0.1)';
                    }}
                  >
                    <div style={{
                      fontSize: '4rem',
                      marginBottom: '1rem'
                    }}>
                      {gift.emoji}
                    </div>
                    <div style={{
                      fontSize: '1.1rem',
                      fontWeight: '600',
                      fontFamily: "'Poppins', sans-serif"
                    }}>
                      {gift.name}
                    </div>
                    {isSelected && (
                      <div style={{
                        marginTop: '0.5rem',
                        fontSize: '0.9rem',
                        opacity: 0.9
                      }}>
                        ✓ Selected
                      </div>
                    )}
                  </button>
                );
              })}
            </div>

            {wishData.virtualGifts.length > 0 && (
              <div style={{
                background: 'rgba(255, 255, 255, 0.15)',
                backdropFilter: 'blur(20px)',
                border: '2px solid rgba(255, 255, 255, 0.25)',
                borderRadius: '25px',
                padding: '2.5rem',
                textAlign: 'center'
              }}>
                <h3 style={{
                  fontSize: '1.8rem',
                  marginBottom: '1.5rem',
                  fontFamily: "'Poppins', sans-serif",
                  fontWeight: '600'
                }}>
                  Your Selected Gifts
                </h3>
                <div style={{
                  display: 'flex',
                  justifyContent: 'center',
                  gap: '1.5rem',
                  flexWrap: 'wrap',
                  fontSize: '3rem'
                }}>
                  {wishData.virtualGifts.map((gift) => (
                    <div
                      key={gift.id}
                      style={{
                        animation: 'bounce 1s ease-in-out infinite'
                      }}
                    >
                      {gift.emoji}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Share Tab - Enhanced */}
        {activeTab === 'share' && (
          <div style={{
            maxWidth: '800px',
            margin: '0 auto',
            padding: '3rem 2rem',
            textAlign: 'center'
          }}>
            <div style={{
              background: 'rgba(255, 255, 255, 0.15)',
              backdropFilter: 'blur(20px)',
              border: '2px solid rgba(255, 255, 255, 0.25)',
              borderRadius: '30px',
              padding: '4rem 3rem',
              boxShadow: '0 20px 60px rgba(0, 0, 0, 0.2)'
            }}>
              <div style={{
                fontSize: '6rem',
                marginBottom: '2rem',
                animation: 'pulse 2s ease-in-out infinite'
              }}>
                💝
              </div>
              <h2 style={{
                fontSize: '3.5rem',
                marginBottom: '1.5rem',
                fontWeight: '700',
                textShadow: '0 4px 15px rgba(0, 0, 0, 0.2)'
              }}>
                Share Your Love Story
              </h2>
              <p style={{
                fontSize: '1.3rem',
                marginBottom: '3rem',
                fontFamily: "'Poppins', sans-serif",
                opacity: 0.95,
                lineHeight: '1.8'
              }}>
                Generate a magical link to share your complete Valentine's wish
              </p>

              {/* Schedule Option */}
              <div style={{
                background: 'rgba(255, 255, 255, 0.1)',
                backdropFilter: 'blur(10px)',
                border: '2px solid rgba(255, 255, 255, 0.2)',
                borderRadius: '20px',
                padding: '2rem',
                marginBottom: '2.5rem'
              }}>
                <label style={{
                  display: 'block',
                  marginBottom: '1rem',
                  fontFamily: "'Poppins', sans-serif",
                  fontSize: '1.1rem',
                  fontWeight: '600',
                  letterSpacing: '1px',
                  textTransform: 'uppercase'
                }}>
                  📅 Schedule for Valentine's Day (Optional)
                </label>
                <input
                  type="date"
                  value={wishData.scheduledDate}
                  onChange={(e) => setWishData({ ...wishData, scheduledDate: e.target.value })}
                  style={{
                    padding: '1rem',
                    background: 'rgba(255, 255, 255, 0.15)',
                    backdropFilter: 'blur(10px)',
                    border: '2px solid rgba(255, 255, 255, 0.25)',
                    borderRadius: '15px',
                    color: '#ffffff',
                    fontSize: '1.1rem',
                    fontFamily: "'Poppins', sans-serif",
                    width: '100%',
                    maxWidth: '300px'
                  }}
                />
              </div>

              {!shareableId ? (
                <div>
                  <button
                    onClick={generateShareableLink}
                    style={{
                      background: 'rgba(255, 255, 255, 0.95)',
                      color: '#6c5ce7',
                      border: 'none',
                      padding: '1.75rem 4rem',
                      fontSize: '1.4rem',
                      borderRadius: '60px',
                      cursor: 'pointer',
                      fontWeight: '700',
                      fontFamily: "'Poppins', sans-serif",
                      boxShadow: '0 20px 50px rgba(0, 0, 0, 0.3)',
                      transition: 'all 0.3s ease',
                      marginBottom: '2rem'
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.transform = 'translateY(-5px) scale(1.05)';
                      e.target.style.boxShadow = '0 25px 60px rgba(0, 0, 0, 0.4)';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.transform = 'translateY(0) scale(1)';
                      e.target.style.boxShadow = '0 20px 50px rgba(0, 0, 0, 0.3)';
                    }}
                  >
                    🔗 Generate Shareable Link
                  </button>
                  <button
                    onClick={downloadAsImage}
                    style={{
                      background: 'rgba(255, 255, 255, 0.2)',
                      backdropFilter: 'blur(10px)',
                      color: '#ffffff',
                      border: '2px solid rgba(255, 255, 255, 0.3)',
                      padding: '1.25rem 3rem',
                      fontSize: '1.1rem',
                      borderRadius: '50px',
                      cursor: 'pointer',
                      fontWeight: '600',
                      fontFamily: "'Poppins', sans-serif",
                      transition: 'all 0.3s ease',
                      display: 'block',
                      margin: '0 auto'
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.background = 'rgba(255, 255, 255, 0.3)';
                      e.target.style.transform = 'scale(1.05)';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.background = 'rgba(255, 255, 255, 0.2)';
                      e.target.style.transform = 'scale(1)';
                    }}
                  >
                    📥 Download as Image
                  </button>
                </div>
              ) : (
                <div style={{ animation: 'fadeInUp 0.5s ease-out' }}>
                  <div style={{
                    background: 'rgba(255, 255, 255, 0.2)',
                    backdropFilter: 'blur(15px)',
                    border: '2px solid rgba(255, 255, 255, 0.3)',
                    borderRadius: '20px',
                    padding: '1.5rem',
                    marginBottom: '2rem',
                    wordBreak: 'break-all',
                    fontFamily: "'Poppins', monospace",
                    fontSize: '1rem',
                    fontWeight: '600'
                  }}>
                    {`${window.location.origin}${window.location.pathname}?wish=${shareableId}`}
                  </div>
                  <div style={{
                    padding: '2rem',
                    background: 'rgba(255, 107, 157, 0.2)',
                    backdropFilter: 'blur(10px)',
                    borderRadius: '20px',
                    marginBottom: '2rem',
                    border: '2px solid rgba(255, 107, 157, 0.4)'
                  }}>
                    <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>✨</div>
                    <p style={{
                      margin: 0,
                      fontSize: '1.3rem',
                      fontFamily: "'Poppins', sans-serif",
                      fontWeight: '600'
                    }}>
                      Link Copied to Clipboard!
                    </p>
                  </div>
                  <p style={{
                    fontSize: '1.2rem',
                    fontFamily: "'Poppins', sans-serif",
                    opacity: 0.95,
                    lineHeight: '1.8'
                  }}>
                    Share this magical link via text, email, or social media.
                    Your loved one will experience your complete Valentine's wish! 💖
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* View Mode - Enhanced */}
        {activeTab === 'view' && (
          <div style={{
            maxWidth: '1100px',
            margin: '0 auto',
            padding: '3rem 2rem'
          }}>
            {/* Card Display */}
            <div id="valentine-card" style={{
              background: 'rgba(255, 255, 255, 0.95)',
              borderRadius: '30px',
              padding: '4rem 3rem',
              minHeight: '500px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              textAlign: 'center',
              position: 'relative',
              overflow: 'hidden',
              border: '3px solid rgba(255, 255, 255, 0.5)',
              boxShadow: '0 30px 80px rgba(0, 0, 0, 0.3)',
              color: '#333',
              marginBottom: '3rem',
              animation: 'fadeInUp 0.8s ease-out'
            }}>
              <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: backgroundOptions[wishData.backgroundColor],
                opacity: 0.15,
                zIndex: 0
              }} />

              {wishData.stickers.map((sticker, i) => (
                <div
                  key={i}
                  style={{
                    position: 'absolute',
                    left: `${sticker.x}%`,
                    top: `${sticker.y}%`,
                    fontSize: `${sticker.size}px`,
                    transform: `rotate(${sticker.rotation}deg)`,
                    zIndex: 1,
                    pointerEvents: 'none',
                    animation: 'fadeIn 0.5s ease-out'
                  }}
                >
                  {sticker.emoji}
                </div>
              ))}

              <div style={{ position: 'relative', zIndex: 2 }}>
                <div style={{
                  fontSize: '5rem',
                  marginBottom: '2rem',
                  animation: 'pulse 2s ease-in-out infinite'
                }}>
                  💝
                </div>

                {wishData.recipientName && (
                  <div style={{
                    fontSize: '3rem',
                    marginBottom: '2rem',
                    fontWeight: '600',
                    fontFamily: fontStyles[wishData.fontStyle],
                    background: backgroundOptions[wishData.backgroundColor],
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text'
                  }}>
                    To {wishData.recipientName},
                  </div>
                )}

                <div style={{
                  fontSize: '1.5rem',
                  lineHeight: '2',
                  color: '#444',
                  maxWidth: '700px',
                  marginBottom: '2.5rem',
                  fontFamily: fontStyles[wishData.fontStyle],
                  fontStyle: 'italic'
                }}>
                  {wishData.message}
                </div>

                {wishData.senderName && (
                  <div style={{
                    fontSize: '2rem',
                    fontWeight: '600',
                    fontFamily: fontStyles[wishData.fontStyle],
                    background: backgroundOptions[wishData.backgroundColor],
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text'
                  }}>
                    With all my love,<br />
                    {wishData.senderName} ❤️
                  </div>
                )}
              </div>
            </div>

            {/* Virtual Gifts Display */}
            {wishData.virtualGifts.length > 0 && (
              <div style={{
                background: 'rgba(255, 255, 255, 0.15)',
                backdropFilter: 'blur(20px)',
                border: '2px solid rgba(255, 255, 255, 0.25)',
                borderRadius: '25px',
                padding: '3rem',
                marginBottom: '3rem',
                textAlign: 'center',
                animation: 'fadeInUp 1s ease-out'
              }}>
                <h3 style={{
                  fontSize: '2.5rem',
                  marginBottom: '2rem',
                  fontFamily: "'Poppins', sans-serif",
                  fontWeight: '700',
                  textShadow: '0 2px 10px rgba(0, 0, 0, 0.2)'
                }}>
                  Special Gifts for You
                </h3>
                <div style={{
                  display: 'flex',
                  justifyContent: 'center',
                  gap: '2rem',
                  flexWrap: 'wrap',
                  fontSize: '4rem'
                }}>
                  {wishData.virtualGifts.map((gift, i) => (
                    <div
                      key={gift.id}
                      style={{
                        animation: `bounce 1s ease-in-out infinite ${i * 0.2}s`
                      }}
                    >
                      {gift.emoji}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Quiz Results */}
            {wishData.quizAnswers.length > 0 && (
              <div style={{
                background: 'rgba(255, 255, 255, 0.15)',
                backdropFilter: 'blur(20px)',
                border: '2px solid rgba(255, 255, 255, 0.25)',
                borderRadius: '25px',
                padding: '3rem',
                marginBottom: '3rem',
                textAlign: 'center',
                animation: 'fadeInUp 1.2s ease-out'
              }}>
                <div style={{
                  fontSize: '5rem',
                  marginBottom: '1.5rem',
                  animation: 'pulse 2s ease-in-out infinite'
                }}>
                  💖
                </div>
                <h3 style={{
                  fontSize: '3rem',
                  marginBottom: '1rem',
                  fontWeight: '700',
                  textShadow: '0 4px 15px rgba(0, 0, 0, 0.2)'
                }}>
                  {calculateCompatibility()}% Perfect Match!
                </h3>
                <p style={{
                  fontSize: '1.3rem',
                  fontFamily: "'Poppins', sans-serif",
                  opacity: 0.95
                }}>
                  According to the love quiz ✨
                </p>
              </div>
            )}

            {/* Video Message */}
            {wishData.videoMessage && (
              <div style={{
                background: 'rgba(255, 255, 255, 0.15)',
                backdropFilter: 'blur(20px)',
                border: '2px solid rgba(255, 255, 255, 0.25)',
                borderRadius: '25px',
                padding: '3rem',
                marginBottom: '3rem',
                textAlign: 'center',
                animation: 'fadeInUp 1.4s ease-out'
              }}>
                <h3 style={{
                  fontSize: '2.5rem',
                  marginBottom: '2rem',
                  fontFamily: "'Poppins', sans-serif",
                  fontWeight: '700',
                  textShadow: '0 2px 10px rgba(0, 0, 0, 0.2)'
                }}>
                  A Special Message for You 📹
                </h3>
                <video
                  src={wishData.videoMessage}
                  controls
                  style={{
                    width: '100%',
                    maxWidth: '700px',
                    borderRadius: '20px',
                    border: '3px solid rgba(255, 255, 255, 0.3)',
                    boxShadow: '0 15px 40px rgba(0, 0, 0, 0.2)'
                  }}
                />
              </div>
            )}

            {/* Timeline Display */}
            {wishData.timeline.length > 0 && (
              <div style={{
                background: 'rgba(255, 255, 255, 0.15)',
                backdropFilter: 'blur(20px)',
                border: '2px solid rgba(255, 255, 255, 0.25)',
                borderRadius: '25px',
                padding: '3rem',
                marginBottom: '3rem',
                animation: 'fadeInUp 1.6s ease-out'
              }}>
                <h3 style={{
                  fontSize: '2.5rem',
                  marginBottom: '3rem',
                  textAlign: 'center',
                  fontFamily: "'Poppins', sans-serif",
                  fontWeight: '700',
                  textShadow: '0 2px 10px rgba(0, 0, 0, 0.2)'
                }}>
                  Our Journey Together 💕
                </h3>
                <div style={{
                  position: 'relative',
                  paddingLeft: '3rem'
                }}>
                  <div style={{
                    position: 'absolute',
                    left: '1rem',
                    top: '2rem',
                    bottom: '2rem',
                    width: '3px',
                    background: 'linear-gradient(180deg, rgba(255, 255, 255, 0.5), rgba(255, 255, 255, 0.1))'
                  }} />

                  {wishData.timeline.map((item, index) => (
                    <div
                      key={index}
                      style={{
                        position: 'relative',
                        marginBottom: '3rem',
                        paddingLeft: '2rem'
                      }}
                    >
                      <div style={{
                        position: 'absolute',
                        left: '-1.4rem',
                        top: '0.5rem',
                        width: '2rem',
                        height: '2rem',
                        borderRadius: '50%',
                        background: 'rgba(255, 255, 255, 0.9)',
                        border: '3px solid rgba(255, 107, 157, 0.8)',
                        boxShadow: '0 0 20px rgba(255, 107, 157, 0.6)'
                      }} />

                      <div style={{
                        background: 'rgba(255, 255, 255, 0.12)',
                        backdropFilter: 'blur(15px)',
                        border: '2px solid rgba(255, 255, 255, 0.25)',
                        borderRadius: '20px',
                        padding: '2rem'
                      }}>
                        <div style={{
                          fontSize: '1.1rem',
                          fontWeight: '700',
                          marginBottom: '0.5rem',
                          fontFamily: "'Poppins', sans-serif",
                          opacity: 0.9
                        }}>
                          {item.date}
                        </div>
                        <div style={{
                          fontSize: '1.3rem',
                          lineHeight: '1.7',
                          fontFamily: fontStyles[wishData.fontStyle]
                        }}>
                          {item.event}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Photos Display */}
            {wishData.photos.length > 0 && (
              <div style={{ animation: 'fadeInUp 1.8s ease-out' }}>
                <h3 style={{
                  fontSize: '2.5rem',
                  marginBottom: '2.5rem',
                  textAlign: 'center',
                  fontFamily: "'Poppins', sans-serif",
                  fontWeight: '700',
                  textShadow: '0 2px 10px rgba(0, 0, 0, 0.2)'
                }}>
                  Our Beautiful Memories 📸
                </h3>
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
                  gap: '2.5rem'
                }}>
                  {wishData.photos.map((photo, index) => (
                    <div
                      key={index}
                      style={{
                        background: 'rgba(255, 255, 255, 0.12)',
                        backdropFilter: 'blur(15px)',
                        border: '2px solid rgba(255, 255, 255, 0.25)',
                        borderRadius: '25px',
                        overflow: 'hidden',
                        transition: 'all 0.3s ease',
                        boxShadow: '0 15px 40px rgba(0, 0, 0, 0.2)'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'translateY(-10px) scale(1.02)';
                        e.currentTarget.style.boxShadow = '0 25px 60px rgba(0, 0, 0, 0.3)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'translateY(0) scale(1)';
                        e.currentTarget.style.boxShadow = '0 15px 40px rgba(0, 0, 0, 0.2)';
                      }}
                    >
                      <div style={{
                        position: 'relative',
                        paddingTop: '100%',
                        overflow: 'hidden'
                      }}>
                        <img
                          src={photo.url}
                          alt={`Memory ${index + 1}`}
                          style={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover',
                            filter: getFilterStyle(photo.filter)
                          }}
                        />
                      </div>
                      {photo.caption && (
                        <div style={{
                          padding: '1.5rem',
                          textAlign: 'center',
                          fontStyle: 'italic',
                          fontSize: '1.1rem',
                          fontFamily: "'Poppins', sans-serif"
                        }}>
                          {photo.caption}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Global Audio Player */}
      <audio
        ref={audioRef}
        src={getCurrentMusicUrl()}
        loop
        onEnded={() => setIsPlaying(false)}
        onError={(e) => {
          console.error('Audio error:', e);
          setIsPlaying(false);
        }}
        onLoadedData={() => console.log('Audio loaded successfully')}
        onCanPlay={() => console.log('Audio can play')}
        style={{ display: 'none' }}
        crossOrigin="anonymous"
      />

      {/* Floating Music Control for View Mode */}
      {activeTab === 'view' && getCurrentMusicUrl() && (
        <div style={{
          position: 'fixed',
          bottom: '30px',
          right: '30px',
          zIndex: 1000,
          animation: 'fadeInUp 1s ease-out'
        }}>
          <button
            onClick={togglePlayPause}
            aria-label={isPlaying ? "Pause music" : "Play music"}
            style={{
              background: 'rgba(255, 255, 255, 0.9)',
              border: 'none',
              borderRadius: '50%',
              width: '60px',
              height: '60px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 5px 20px rgba(0, 0, 0, 0.2)',
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => {
              e.target.style.transform = 'scale(1.1)';
              e.target.style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.3)';
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = 'scale(1)';
              e.target.style.boxShadow = '0 5px 20px rgba(0, 0, 0, 0.2)';
            }}
          >
            {isPlaying ? (
              <Pause size={24} color="#6c5ce7" />
            ) : (
              <Play size={24} color="#6c5ce7" />
            )}
          </button>
        </div>
      )}

      {/* Enhanced CSS Animations */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400&family=Poppins:wght@300;400;500;600;700;800&family=Crimson+Text:ital,wght@0,400;0,600;1,400&family=Quicksand:wght@400;500;600;700&family=Lora:ital,wght@0,400;0,600;1,400&display=swap');
        
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes pulse {
          0%, 100% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.05);
          }
        }

        @keyframes float {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-20px);
          }
        }

        @keyframes bounce {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-15px);
          }
        }

        * {
          box-sizing: border-box;
          margin: 0;
          padding: 0;
        }

        input:focus, textarea:focus, select:focus {
          outline: none;
        }

        ::placeholder {
          color: rgba(255, 255, 255, 0.5);
        }

        input[type="date"]::-webkit-calendar-picker-indicator {
          filter: invert(1);
          cursor: pointer;
        }

        ::-webkit-scrollbar {
          width: 10px;
        }

        ::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.1);
        }

        ::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.3);
          border-radius: 5px;
        }

        ::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.5);
        }
      `}</style>
    </div>
  );
};

export default ValentineWishPage;
