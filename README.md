# Q&A Interview Application - Frontend

React + Vite frontend for a Q&A-based interview application with audio recording and speech recognition capabilities.

## Features

- **User Authentication**: Login and registration with JWT token management
- **Interview Interface**: Interactive Q&A interview flow
- **Audio Recording**: Record answers using browser microphone
- **Speech Recognition**: Real-time speech-to-text transcription
- **Question Player**: Text-to-speech playback of questions
- **Session Management**: Create, view, and manage interview sessions
- **Session History**: View past interview sessions and answers
- **Transcript Panel**: View transcribed answers in real-time
- **Progress Tracking**: Visual progress indicator for interview completion
- **Responsive Design**: Modern UI built with Tailwind CSS

## Technology Stack

- **React 19.2.0**: UI library
- **Vite 7.2.4**: Build tool and dev server
- **React Router DOM 6.30.2**: Client-side routing
- **Tailwind CSS 4.1.18**: Utility-first CSS framework
- **react-speech-recognition 4.0.1**: Browser speech recognition API
- **react-hot-toast 2.6.0**: Toast notifications

## Prerequisites

- Node.js 16.x or higher
- npm or yarn package manager

## Installation

1. **Navigate to the frontend directory**:
   ```bash
   cd frontend
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure environment variables** (if needed):
   - Create or update `.env` file
   - Set `VITE_API_BASE_URL` if your backend runs on a different port

## Development

### Start Development Server

```bash
npm run dev
```

The application will start on `http://localhost:5173` (or next available port).

### Build for Production

```bash
npm run build
```

The production build will be created in the `dist/` directory.

### Preview Production Build

```bash
npm run preview
```

### Linting

```bash
npm run lint
```

## Project Structure

```
frontend/
├── public/                 # Static assets
├── src/
│   ├── api/               # API client modules
│   │   ├── authApi.js     # Authentication API calls
│   │   └── interviewApi.js # Interview API calls
│   ├── components/        # React components
│   │   ├── ConsentModal.jsx
│   │   ├── ControlsBar.jsx
│   │   ├── InterviewHeader.jsx
│   │   ├── LiveInterviewPanel.jsx
│   │   ├── ProgressIndicator.jsx
│   │   ├── QuestionPlayer.jsx
│   │   ├── RecorderControls.jsx
│   │   ├── SessionSidebar.jsx
│   │   ├── Toast.jsx
│   │   ├── TranscriptPanel.jsx
│   │   └── VideoPreview.jsx
│   ├── context/           # React Context providers
│   │   ├── AuthContext.jsx # Authentication context
│   │   └── ToastContext.jsx # Toast notification context
│   ├── hooks/             # Custom React hooks
│   │   ├── useAudioRecorder.js
│   │   ├── useMediaPermissions.js
│   │   ├── useSpeechPlayer.js
│   │   └── useSpeechRecognition.js
│   ├── pages/             # Page components
│   │   ├── InterviewPage.jsx
│   │   ├── LoginPage.jsx
│   │   └── RegisterPage.jsx
│   ├── utils/             # Utility functions
│   │   ├── audioConverter.js # WebM to WAV conversion
│   │   └── constants.js   # App constants
│   ├── App.jsx            # Main App component
│   ├── Routes.jsx         # Route configuration
│   ├── main.jsx           # Application entry point
│   └── index.css          # Global styles
├── package.json           # Dependencies and scripts
├── vite.config.js         # Vite configuration
└── eslint.config.js       # ESLint configuration
```

## Key Features Explained

### Authentication
- JWT token-based authentication
- Automatic token refresh
- Protected routes
- User profile management

### Interview Flow
1. User logs in or registers
2. Grants microphone permissions
3. Starts a new interview session
4. Answers questions sequentially
5. Records audio answers
6. Gets real-time transcription
7. Can review and manage session history

### Audio Recording
- Uses Web Audio API for recording
- Converts WebM format to WAV before sending to backend
- Real-time audio visualization
- Browser-based recording (no external dependencies)

### Speech Recognition
- Uses browser's built-in Speech Recognition API
- Real-time transcription display
- Fallback to backend transcription if needed

## API Integration

The frontend communicates with the backend API at `http://localhost:8000/api` (configurable via constants).

### API Endpoints Used
- `POST /api/auth/register/` - User registration
- `POST /api/auth/login/` - User login
- `GET /api/questions/` - Fetch interview questions
- `POST /api/sessions/` - Create interview session
- `GET /api/sessions/` - Get user's sessions
- `GET /api/sessions/<id>/` - Get session details
- `POST /api/sessions/<id>/answers/` - Submit answer
- `POST /api/transcribe/` - Transcribe audio

## Environment Variables

Create a `.env` file in the frontend directory:

```env
VITE_API_BASE_URL=http://localhost:8000/api
```

## Browser Compatibility

- **Chrome/Edge**: Full support (recommended)
- **Firefox**: Full support
- **Safari**: Limited speech recognition support
- **Mobile browsers**: May have limited microphone access

### Required Browser Permissions
- Microphone access (for audio recording)
- Camera access (optional, for video preview)

## Customization

### Styling
The application uses Tailwind CSS. Customize styles by:
- Modifying component CSS files
- Updating Tailwind configuration
- Adding custom CSS classes

### Constants
Update `src/utils/constants.js` to modify:
- API base URL
- Default questions
- Total question count

## Troubleshooting

### Microphone Not Working
- Check browser permissions
- Ensure HTTPS or localhost (required for microphone access)
- Verify microphone is not being used by another application

### Speech Recognition Not Working
- Check browser compatibility (Chrome/Edge recommended)
- Verify microphone permissions
- Check browser console for errors

### API Connection Issues
- Verify backend server is running
- Check `API_BASE_URL` in constants
- Verify CORS settings on backend
- Check browser console for network errors

### Build Issues
- Clear `node_modules` and reinstall: `rm -rf node_modules && npm install`
- Clear Vite cache: `rm -rf node_modules/.vite`
- Check Node.js version compatibility

## Production Deployment

1. **Build the application**:
   ```bash
   npm run build
   ```

2. **Serve the `dist/` directory** using:
   - Nginx
   - Apache
   - Vercel
   - Netlify
   - Any static file server

3. **Configure environment variables** for production API URL

4. **Set up HTTPS** (required for microphone access in production)

## Development Tips

- Use React DevTools for debugging
- Check browser console for warnings and errors
- Use Network tab to debug API calls
- Test microphone permissions in different browsers

## License

[Add your license information here]
