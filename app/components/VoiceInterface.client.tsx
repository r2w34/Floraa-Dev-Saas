import { useState, useEffect, useRef } from 'react';
import { voiceToCode, type VoiceCommand, type VoiceResponse } from '~/lib/ai/VoiceToCode.client';
import { classNames } from '~/utils/classNames';

interface VoiceInterfaceProps {
  projectId?: string;
  conversationId?: string;
  onCodeGenerated?: (code: string) => void;
  onActionTriggered?: (action: { type: string; data: any }) => void;
}

export function VoiceInterface({
  projectId,
  conversationId,
  onCodeGenerated,
  onActionTriggered,
}: VoiceInterfaceProps) {
  const [isListening, setIsListening] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentTranscript, setCurrentTranscript] = useState('');
  const [recentCommands, setRecentCommands] = useState<VoiceCommand[]>([]);
  const [recentResponses, setRecentResponses] = useState<VoiceResponse[]>([]);
  const [isSupported, setIsSupported] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState('en-US');
  const [selectedVoice, setSelectedVoice] = useState<string>('');
  const [availableVoices, setAvailableVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [showSettings, setShowSettings] = useState(false);
  const [continuousMode, setContinuousMode] = useState(false);
  
  const transcriptRef = useRef<HTMLDivElement>(null);
  const commandHistoryRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    // Check if voice features are supported
    setIsSupported(voiceToCode.isSupported());
    
    // Get available voices
    const voices = voiceToCode.getAvailableVoices();
    setAvailableVoices(voices);
    
    if (voices.length > 0) {
      setSelectedVoice(voices[0].name);
    }
    
    // Set up event listeners
    const unsubscribeCommand = voiceToCode.onVoiceCommand(handleVoiceCommand);
    const unsubscribeResponse = voiceToCode.onVoiceResponse(handleVoiceResponse);
    
    return () => {
      unsubscribeCommand();
      unsubscribeResponse();
    };
  }, []);
  
  useEffect(() => {
    // Update listening state
    const interval = setInterval(() => {
      setIsListening(voiceToCode.isCurrentlyListening());
      setIsProcessing(voiceToCode.isCurrentlyProcessing());
    }, 100);
    
    return () => clearInterval(interval);
  }, []);
  
  useEffect(() => {
    // Auto-scroll command history
    if (commandHistoryRef.current) {
      commandHistoryRef.current.scrollTop = commandHistoryRef.current.scrollHeight;
    }
  }, [recentCommands, recentResponses]);
  
  const handleVoiceCommand = (command: VoiceCommand) => {
    setRecentCommands(prev => [...prev.slice(-9), command]);
    setCurrentTranscript(command.transcript);
  };
  
  const handleVoiceResponse = (response: VoiceResponse) => {
    setRecentResponses(prev => [...prev.slice(-9), response]);
    
    // Handle actions
    if (response.actions) {
      response.actions.forEach(action => {
        handleAction(action);
      });
    }
  };
  
  const handleAction = (action: { type: string; data: any }) => {
    switch (action.type) {
      case 'create_file':
      case 'open_editor':
        if (onCodeGenerated && action.data.content) {
          onCodeGenerated(action.data.content);
        }
        break;
      
      default:
        if (onActionTriggered) {
          onActionTriggered(action);
        }
        break;
    }
  };
  
  const startListening = async () => {
    try {
      await voiceToCode.startListening();
    } catch (error) {
      console.error('Failed to start listening:', error);
    }
  };
  
  const stopListening = async () => {
    try {
      await voiceToCode.stopListening();
    } catch (error) {
      console.error('Failed to stop listening:', error);
    }
  };
  
  const toggleListening = async () => {
    if (isListening) {
      await stopListening();
    } else {
      await startListening();
    }
  };
  
  const handleTextInput = async (text: string) => {
    if (text.trim()) {
      await voiceToCode.processTextCommand(text);
    }
  };
  
  const toggleContinuousMode = async () => {
    if (continuousMode) {
      await voiceToCode.disableContinuousMode();
      setContinuousMode(false);
    } else {
      await voiceToCode.enableContinuousMode();
      setContinuousMode(true);
    }
  };
  
  const changeLanguage = (language: string) => {
    setSelectedLanguage(language);
    voiceToCode.setLanguage(language);
  };
  
  const clearHistory = () => {
    setRecentCommands([]);
    setRecentResponses([]);
    voiceToCode.clearContext();
  };
  
  if (!isSupported) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <div className="flex items-center gap-2">
          <div className="i-ph:warning text-yellow-600" />
          <p className="text-sm text-yellow-800">
            Voice features are not supported in your browser. Please use a modern browser with speech recognition support.
          </p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="bg-floraa-elements-bg-depth-2 border border-floraa-elements-borderColor rounded-xl overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-floraa-elements-borderColor">
        <div className="flex items-center gap-3">
          <div className="i-ph:microphone-duotone text-xl text-accent-600" />
          <h3 className="font-semibold text-floraa-elements-textPrimary">Voice Assistant</h3>
          {isListening && (
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
              <span className="text-sm text-red-600">Listening...</span>
            </div>
          )}
          {isProcessing && (
            <div className="flex items-center gap-2">
              <div className="i-ph:spinner animate-spin text-accent-600" />
              <span className="text-sm text-accent-600">Processing...</span>
            </div>
          )}
        </div>
        
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowSettings(!showSettings)}
            className="p-2 hover:bg-floraa-elements-bg-depth-3 rounded-lg transition-colors"
            title="Voice Settings"
          >
            <div className="i-ph:gear text-floraa-elements-textSecondary" />
          </button>
          
          <button
            onClick={clearHistory}
            className="p-2 hover:bg-floraa-elements-bg-depth-3 rounded-lg transition-colors"
            title="Clear History"
          >
            <div className="i-ph:trash text-floraa-elements-textSecondary" />
          </button>
        </div>
      </div>
      
      {/* Settings Panel */}
      {showSettings && (
        <div className="p-4 border-b border-floraa-elements-borderColor bg-floraa-elements-bg-depth-1">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-floraa-elements-textPrimary mb-2">
                Language
              </label>
              <select
                value={selectedLanguage}
                onChange={(e) => changeLanguage(e.target.value)}
                className="block w-full px-3 py-2 border border-floraa-elements-borderColor rounded-lg bg-floraa-elements-bg-depth-2 text-floraa-elements-textPrimary focus:ring-2 focus:ring-accent-500 focus:border-accent-500"
              >
                <option value="en-US">English (US)</option>
                <option value="en-GB">English (UK)</option>
                <option value="es-ES">Spanish</option>
                <option value="fr-FR">French</option>
                <option value="de-DE">German</option>
                <option value="it-IT">Italian</option>
                <option value="pt-BR">Portuguese (Brazil)</option>
                <option value="ja-JP">Japanese</option>
                <option value="ko-KR">Korean</option>
                <option value="zh-CN">Chinese (Simplified)</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-floraa-elements-textPrimary mb-2">
                Voice
              </label>
              <select
                value={selectedVoice}
                onChange={(e) => setSelectedVoice(e.target.value)}
                className="block w-full px-3 py-2 border border-floraa-elements-borderColor rounded-lg bg-floraa-elements-bg-depth-2 text-floraa-elements-textPrimary focus:ring-2 focus:ring-accent-500 focus:border-accent-500"
              >
                {availableVoices.map((voice) => (
                  <option key={voice.name} value={voice.name}>
                    {voice.name} ({voice.lang})
                  </option>
                ))}
              </select>
            </div>
          </div>
          
          <div className="mt-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="continuousMode"
                checked={continuousMode}
                onChange={toggleContinuousMode}
                className="rounded border-floraa-elements-borderColor text-accent-600 focus:ring-accent-500"
              />
              <label htmlFor="continuousMode" className="text-sm text-floraa-elements-textPrimary">
                Continuous listening mode
              </label>
            </div>
          </div>
        </div>
      )}
      
      {/* Current Transcript */}
      {currentTranscript && (
        <div className="p-4 border-b border-floraa-elements-borderColor bg-accent-50">
          <div className="flex items-start gap-3">
            <div className="i-ph:quotes text-accent-600 mt-1" />
            <div>
              <p className="text-sm font-medium text-accent-800 mb-1">Current Command:</p>
              <p className="text-accent-700">{currentTranscript}</p>
            </div>
          </div>
        </div>
      )}
      
      {/* Command History */}
      <div
        ref={commandHistoryRef}
        className="h-64 overflow-y-auto p-4 space-y-3"
      >
        {recentCommands.length === 0 && recentResponses.length === 0 ? (
          <div className="text-center py-8">
            <div className="i-ph:microphone text-4xl text-floraa-elements-textSecondary mb-4" />
            <p className="text-floraa-elements-textSecondary">
              Start speaking or type a command to begin
            </p>
            <div className="mt-4 text-sm text-floraa-elements-textTertiary">
              <p>Try saying:</p>
              <ul className="mt-2 space-y-1">
                <li>"Create a React component called UserProfile"</li>
                <li>"Explain this function"</li>
                <li>"Add error handling to the login function"</li>
                <li>"Generate unit tests for this component"</li>
              </ul>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {recentCommands.map((command, index) => {
              const response = recentResponses[index];
              return (
                <div key={command.id} className="space-y-2">
                  {/* User Command */}
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-accent-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <div className="i-ph:user text-accent-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm font-medium text-floraa-elements-textPrimary">You</span>
                        <span className="text-xs text-floraa-elements-textTertiary">
                          {new Date(command.timestamp).toLocaleTimeString()}
                        </span>
                        {command.intent && (
                          <span className="px-2 py-0.5 bg-accent-100 text-accent-700 text-xs rounded-full">
                            {command.intent.replace('_', ' ')}
                          </span>
                        )}
                      </div>
                      <p className="text-floraa-elements-textSecondary">{command.transcript}</p>
                    </div>
                  </div>
                  
                  {/* AI Response */}
                  {response && (
                    <div className="flex items-start gap-3 ml-4">
                      <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <div className="i-ph:robot text-purple-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-sm font-medium text-floraa-elements-textPrimary">Floraa AI</span>
                          <span className="text-xs text-floraa-elements-textTertiary">
                            {new Date(response.timestamp).toLocaleTimeString()}
                          </span>
                        </div>
                        <p className="text-floraa-elements-textSecondary">{response.text}</p>
                        
                        {/* Actions */}
                        {response.actions && response.actions.length > 0 && (
                          <div className="mt-2 flex flex-wrap gap-2">
                            {response.actions.map((action, actionIndex) => (
                              <span
                                key={actionIndex}
                                className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full"
                              >
                                {action.type.replace('_', ' ')}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
      
      {/* Controls */}
      <div className="p-4 border-t border-floraa-elements-borderColor">
        <div className="flex items-center gap-3">
          {/* Voice Control Button */}
          <button
            onClick={toggleListening}
            className={classNames(
              'flex items-center justify-center w-12 h-12 rounded-full transition-all duration-200',
              isListening
                ? 'bg-red-500 hover:bg-red-600 text-white animate-pulse'
                : 'bg-accent-600 hover:bg-accent-700 text-white'
            )}
            title={isListening ? 'Stop Listening' : 'Start Listening'}
          >
            <div className={isListening ? 'i-ph:stop' : 'i-ph:microphone'} />
          </button>
          
          {/* Text Input */}
          <div className="flex-1">
            <input
              type="text"
              placeholder="Or type your command here..."
              className="block w-full px-4 py-2 border border-floraa-elements-borderColor rounded-lg bg-floraa-elements-bg-depth-1 text-floraa-elements-textPrimary placeholder-floraa-elements-textTertiary focus:ring-2 focus:ring-accent-500 focus:border-accent-500"
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  const input = e.target as HTMLInputElement;
                  handleTextInput(input.value);
                  input.value = '';
                }
              }}
            />
          </div>
          
          {/* Quick Actions */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => handleTextInput('Explain the current code')}
              className="px-3 py-2 text-sm bg-floraa-elements-bg-depth-3 hover:bg-floraa-elements-bg-depth-1 text-floraa-elements-textSecondary rounded-lg transition-colors"
              title="Explain Code"
            >
              <div className="i-ph:question" />
            </button>
            
            <button
              onClick={() => handleTextInput('Review this code for issues')}
              className="px-3 py-2 text-sm bg-floraa-elements-bg-depth-3 hover:bg-floraa-elements-bg-depth-1 text-floraa-elements-textSecondary rounded-lg transition-colors"
              title="Review Code"
            >
              <div className="i-ph:magnifying-glass" />
            </button>
            
            <button
              onClick={() => handleTextInput('Generate tests for this code')}
              className="px-3 py-2 text-sm bg-floraa-elements-bg-depth-3 hover:bg-floraa-elements-bg-depth-1 text-floraa-elements-textSecondary rounded-lg transition-colors"
              title="Generate Tests"
            >
              <div className="i-ph:test-tube" />
            </button>
          </div>
        </div>
        
        {/* Status */}
        <div className="mt-3 text-xs text-floraa-elements-textTertiary text-center">
          {continuousMode ? (
            <span>Continuous mode active - say "Hey Floraa" to activate</span>
          ) : (
            <span>Click the microphone or press and hold to speak</span>
          )}
        </div>
      </div>
    </div>
  );
}