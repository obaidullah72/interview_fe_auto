import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'
import { useMediaPermissions } from '../hooks/useMediaPermissions'
import { useAudioRecorder } from '../hooks/useAudioRecorder'
import { useSpeechPlayer } from '../hooks/useSpeechPlayer'
import { useSpeechRecognition } from '../hooks/useSpeechRecognition'
import { interviewApi } from '../api/interviewApi'
import ConsentModal from '../components/ConsentModal'
import SessionSidebar from '../components/SessionSidebar'
import InterviewHeader from '../components/InterviewHeader'
import LiveInterviewPanel from '../components/LiveInterviewPanel'
import TranscriptPanel from '../components/TranscriptPanel'
import ConfirmModal from '../components/ConfirmModal'
import './InterviewPage.css'

const InterviewPage = () => {
  const { user, token, logout } = useAuth()
  const { success, error: showError, warning, info } = useToast()

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [questions, setQuestions] = useState([])
  const [transcribedText, setTranscribedText] = useState('')
  const [answers, setAnswers] = useState([])
  const [isLoading, setIsLoading] = useState(false)

  const [sessions, setSessions] = useState([])
  const [showSessionHistory, setShowSessionHistory] = useState(false)
  const [selectedSession, setSelectedSession] = useState(null)
  const [sessionAnswers, setSessionAnswers] = useState([])
  const [isLoadingSessions, setIsLoadingSessions] = useState(false)

  const [selectedVoiceId, setSelectedVoiceId] = useState(null)

  const [sessionToDelete, setSessionToDelete] = useState(null)
  const [isDeleteLoading, setIsDeleteLoading] = useState(false)

  const {
    permissionsGranted,
    isLoading: permissionsLoading,
    error: permissionsError,
    requestPermissions,
    mediaStream,
  } = useMediaPermissions()

  const {
    isRecording,
    isProcessing,
    setIsProcessing,
    startRecording,
    stopRecording,
    reset: resetRecorder,
  } = useAudioRecorder(mediaStream)

  const {
    isSpeaking,
    speak,
    stop: stopSpeech,
    voiceProfiles,
  } = useSpeechPlayer()

  const {
    transcript,
    isListening,
    error: speechError,
    startListening,
    stopListening,
    resetTranscript,
    getFinalTranscript,
  } = useSpeechRecognition()

  const isAdmin = user?.profile?.role === 'Admin'

  // default voice selection when profiles load
  useEffect(() => {
    if (!selectedVoiceId && voiceProfiles && voiceProfiles.length > 0) {
      setSelectedVoiceId(voiceProfiles[0].id)
    }
  }, [voiceProfiles, selectedVoiceId])

  useEffect(() => {
    if (token) {
      fetchQuestions()
      fetchSessions()
    }
  }, [token])

  const fetchSessions = async () => {
    setIsLoadingSessions(true)
    try {
      const data = await interviewApi.getSessions(token)
      setSessions(data || [])
    } catch (error) {
      console.error('Error fetching sessions:', error)
    } finally {
      setIsLoadingSessions(false)
    }
  }

  const fetchSessionAnswers = async (sessionId) => {
    try {
      const data = await interviewApi.getAnswers(token, sessionId)
      setSessionAnswers(data || [])
    } catch (error) {
      console.error('Error fetching session answers:', error)
    }
  }

  const fetchQuestions = async () => {
    try {
      const data = await interviewApi.getQuestions(token)
      setQuestions(data.questions || [])
    } catch (error) {
      console.error('Error fetching questions:', error)
      setQuestions([])
    }
  }

  const handlePlayQuestion = () => {
    if (currentQuestionIndex < questions.length) {
      speak(questions[currentQuestionIndex], { voiceProfileId: selectedVoiceId })
    }
  }

  const handleStartRecording = () => {
    try {
      startRecording()
      startListening()
      resetTranscript()
      setTranscribedText('')
      info('Recording started')
    } catch (err) {
      // showError(err.message || 'Failed to start recording')
    }
  }

  const handleStopRecording = async () => {
    setIsProcessing(true)
    try {
      stopListening()
      await stopRecording()

      setTimeout(() => {
        const finalTranscript = getFinalTranscript().trim()
        if (finalTranscript) {
          const answerExists = answers.some(
            (ans) => ans.question_number === currentQuestionIndex + 1,
          )

          if (!answerExists) {
            setTranscribedText(finalTranscript)
            const newAnswer = {
              question_number: currentQuestionIndex + 1,
              question_text: questions[currentQuestionIndex],
              transcribed_answer: finalTranscript,
            }
            setAnswers((prev) => [...prev, newAnswer])
            success('Answer transcribed successfully')

            setTimeout(() => {
              if (currentQuestionIndex < questions.length - 1) {
                setCurrentQuestionIndex((prev) => prev + 1)
                setTranscribedText('')
                resetRecorder()
                resetTranscript()
                stopListening()
                stopSpeech()
              }
            }, 1200)
          } else {
            setTranscribedText(finalTranscript)
            setAnswers((prev) =>
              prev.map((ans) =>
                ans.question_number === currentQuestionIndex + 1
                  ? { ...ans, transcribed_answer: finalTranscript }
                  : ans,
              ),
            )
            success('Answer updated successfully')
          }
        } else {
          // showError('No speech detected. Please try again.')
        }
        setIsProcessing(false)
      }, 700)
    } catch (err) {
      console.error('Error stopping recording:', err)
      // showError(err.message || 'Failed to stop recording')
      setIsProcessing(false)
    }
  }

  useEffect(() => {
    if (transcript) {
      setTranscribedText(transcript)
    }
  }, [transcript])

  useEffect(() => {
    if (speechError) {
      // showError(speechError)
    }
  }, [speechError, showError])

  const handleResetInterview = () => {
    setCurrentQuestionIndex(0)
    setTranscribedText('')
    setAnswers([])
    resetRecorder()
    resetTranscript()
    stopListening()
    stopSpeech()
  }

  const handleCompleteInterview = async () => {
    try {
      if (answers.length === 0) {
        warning('No answers to save. Please complete at least one question.')
        return
      }

      const result = await interviewApi.completeInterview(answers, token)

      if (result.success) {
        await fetchSessions()
        setCurrentQuestionIndex(0)
        setTranscribedText('')
        setAnswers([])
        resetRecorder()
        stopSpeech()
        success('Interview completed and saved successfully!')
      }
    } catch (err) {
      console.error('Error completing interview:', err)
      // showError(err.message || 'Failed to save interview. Please try again.')
    }
  }

  const handleViewSession = async (session) => {
    setSelectedSession(session)
    await fetchSessionAnswers(session.id)
    setShowSessionHistory(true)
  }

  const requestDeleteSession = (session) => {
    setSessionToDelete(session)
  }

  const handleConfirmDelete = async () => {
    if (!token || !sessionToDelete) return
    setIsDeleteLoading(true)
    try {
      await interviewApi.deleteSession(sessionToDelete.id, token)
      success(`Session ${sessionToDelete.id} deleted`)

      if (selectedSession?.id === sessionToDelete.id) {
        setSelectedSession(null)
        setSessionAnswers([])
        setShowSessionHistory(false)
      }

      await fetchSessions()
      setSessionToDelete(null)
    } catch (err) {
      console.error('Error deleting session:', err)
      showError(err.message || 'Failed to delete session')
    } finally {
      setIsDeleteLoading(false)
    }
  }

  const handleCancelDelete = () => {
    setSessionToDelete(null)
  }

  useEffect(() => {
    if (selectedSession) {
      setShowSessionHistory(true)
    }
  }, [selectedSession])

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A'
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  }

  const getSessionDuration = (session) => {
    if (!session?.started_at) return 'N/A'
    const start = new Date(session.started_at)
    const end = session.completed_at ? new Date(session.completed_at) : new Date()
    const mins = Math.floor((end - start) / 1000 / 60)
    return `${mins} min`
  }

  const currentQuestion = questions[currentQuestionIndex] || ''
  const allQuestionsAnswered = answers.length === questions.length && questions.length > 0
  const isLoadingState = isLoading || isProcessing

  if (!permissionsGranted) {
    return (
      <div className="messenger-layout fade-in">
        <ConsentModal onGrant={requestPermissions} isLoading={permissionsLoading} />
        {permissionsError && <div className="error-message">{permissionsError}</div>}
      </div>
    )
  }

  return (
    <div className="messenger-layout fade-in">
      {/* Sidebar */}
      <SessionSidebar
        user={user}
        sessions={sessions}
        selectedSession={selectedSession}
        isLoadingSessions={isLoadingSessions}
        onLogout={logout}
        onSelectSession={handleViewSession}
        onDeleteSession={isAdmin ? requestDeleteSession : undefined}
        formatDate={formatDate}
      />

      {/* Main chat area */}
      <div className="chat-area">
        {showSessionHistory && selectedSession ? (
          <div className="chat-view">
            <div className="chat-header">
              <button
                className="back-button"
                onClick={() => {
                  setSelectedSession(null)
                  setSessionAnswers([])
                  setShowSessionHistory(false)
                }}
              >
                ←
              </button>
              <div className="chat-header-info">
                <div className="chat-title">Session {selectedSession.id}</div>
                <div className="chat-subtitle">
                  {selectedSession.is_completed ? 'Completed' : 'In Progress'} • {getSessionDuration(selectedSession)}
                </div>
              </div>
            </div>

            <div className="messages-container">
              {sessionAnswers.map((answer, idx) => (
                <div key={idx} className="message-thread">
                  <div className="message message-incoming">
                    <div className="message-avatar">AI</div>
                    <div className="message-bubble question-bubble">
                      <div className="message-text">{answer.question_text}</div>
                      <div className="message-time">Question {answer.question_number}</div>
                    </div>
                  </div>
                  <div className="message message-outgoing">
                    <div className="message-bubble answer-bubble">
                      <div className="message-text">{answer.transcribed_answer}</div>
                      <div className="message-time">Your answer</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="chat-view">
            <InterviewHeader
              questionsCount={questions.length}
              currentQuestionIndex={currentQuestionIndex}
              voiceProfiles={voiceProfiles}
              selectedVoiceId={selectedVoiceId}
              onSelectVoice={setSelectedVoiceId}
            />

            <div className="interview-layout-main">
              <LiveInterviewPanel mediaStream={mediaStream} isRecording={isRecording} />

              <TranscriptPanel
                questions={questions}
                currentQuestionIndex={currentQuestionIndex}
                currentQuestion={currentQuestion}
                answers={answers}
                transcribedText={transcribedText}
                transcript={transcript}
                isListening={isListening}
                isSpeaking={isSpeaking}
                isRecording={isRecording}
                isLoadingState={isLoadingState}
                allQuestionsAnswered={allQuestionsAnswered}
                onPlayQuestion={handlePlayQuestion}
                onStartRecording={handleStartRecording}
                onStopRecording={handleStopRecording}
                onCompleteInterview={handleCompleteInterview}
                onResetInterview={handleResetInterview}
              />
            </div>
          </div>
        )}
      </div>

      <ConfirmModal
        isOpen={!!sessionToDelete}
        title="Delete interview session"
        message={
          sessionToDelete
            ? `Are you sure you want to delete session ${sessionToDelete.id}? This action cannot be undone.`
            : ''
        }
        confirmLabel={isDeleteLoading ? 'Deleting...' : 'Delete'}
        cancelLabel="Cancel"
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
      />
    </div>
  )
}

export default InterviewPage
