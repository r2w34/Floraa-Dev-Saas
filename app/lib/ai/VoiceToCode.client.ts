import { z } from 'zod';

// Voice Command Schema
export const VoiceCommandSchema = z.object({
  id: z.string(),
  transcript: z.string(),
  confidence: z.number(),
  language: z.string(),
  timestamp: z.string(),
  intent: z.enum([
    'code_generation',
    'code_explanation',
    'code_modification',
    'navigation',
    'file_operation',
    'debugging',
    'testing',
    'deployment'
  ]).optional(),
  entities: z.array(z.object({
    type: z.string(),
    value: z.string(),
    confidence: z.number(),
  })).optional(),
});

export type VoiceCommand = z.infer<typeof VoiceCommandSchema>;

// Voice Response Schema
export const VoiceResponseSchema = z.object({
  id: z.string(),
  text: z.string(),
  audioUrl: z.string().optional(),
  actions: z.array(z.object({
    type: z.string(),
    data: z.record(z.any()),
  })).optional(),
  timestamp: z.string(),
});

export type VoiceResponse = z.infer<typeof VoiceResponseSchema>;

// Advanced Voice-to-Code System
export class VoiceToCodeSystem {
  private static instance: VoiceToCodeSystem;
  private recognition: SpeechRecognition | null = null;
  private synthesis: SpeechSynthesis | null = null;
  private isListening: boolean = false;
  private isProcessing: boolean = false;
  private currentLanguage: string = 'en-US';
  private listeners: Set<(command: VoiceCommand) => void> = new Set();
  private responseListeners: Set<(response: VoiceResponse) => void> = new Set();
  private contextBuffer: VoiceCommand[] = [];
  private maxContextSize: number = 10;
  
  private constructor() {
    this.initializeSpeechRecognition();
    this.initializeSpeechSynthesis();
  }
  
  public static getInstance(): VoiceToCodeSystem {
    if (!VoiceToCodeSystem.instance) {
      VoiceToCodeSystem.instance = new VoiceToCodeSystem();
    }
    return VoiceToCodeSystem.instance;
  }
  
  private initializeSpeechRecognition(): void {
    if (typeof window === 'undefined') return;
    
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    
    if (SpeechRecognition) {
      this.recognition = new SpeechRecognition();
      this.recognition.continuous = true;
      this.recognition.interimResults = true;
      this.recognition.lang = this.currentLanguage;
      
      this.recognition.onstart = () => {
        this.isListening = true;
        console.log('Voice recognition started');
      };
      
      this.recognition.onend = () => {
        this.isListening = false;
        console.log('Voice recognition ended');
      };
      
      this.recognition.onresult = (event) => {
        this.handleSpeechResult(event);
      };
      
      this.recognition.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        this.isListening = false;
      };
    } else {
      console.warn('Speech recognition not supported in this browser');
    }
  }
  
  private initializeSpeechSynthesis(): void {
    if (typeof window === 'undefined') return;
    
    if ('speechSynthesis' in window) {
      this.synthesis = window.speechSynthesis;
    } else {
      console.warn('Speech synthesis not supported in this browser');
    }
  }
  
  private handleSpeechResult(event: SpeechRecognitionEvent): void {
    let finalTranscript = '';
    let interimTranscript = '';
    
    for (let i = event.resultIndex; i < event.results.length; i++) {
      const transcript = event.results[i][0].transcript;
      
      if (event.results[i].isFinal) {
        finalTranscript += transcript;
      } else {
        interimTranscript += transcript;
      }
    }
    
    if (finalTranscript) {
      const command: VoiceCommand = {
        id: crypto.randomUUID(),
        transcript: finalTranscript.trim(),
        confidence: event.results[event.results.length - 1][0].confidence,
        language: this.currentLanguage,
        timestamp: new Date().toISOString(),
      };
      
      this.processVoiceCommand(command);
    }
  }
  
  private async processVoiceCommand(command: VoiceCommand): Promise<void> {
    if (this.isProcessing) return;
    
    this.isProcessing = true;
    
    try {
      // Add to context buffer
      this.contextBuffer.push(command);
      if (this.contextBuffer.length > this.maxContextSize) {
        this.contextBuffer.shift();
      }
      
      // Enhance command with intent and entities
      const enhancedCommand = await this.enhanceCommand(command);
      
      // Notify listeners
      this.listeners.forEach(listener => listener(enhancedCommand));
      
      // Process the command
      await this.executeVoiceCommand(enhancedCommand);
      
    } catch (error) {
      console.error('Error processing voice command:', error);
    } finally {
      this.isProcessing = false;
    }
  }
  
  private async enhanceCommand(command: VoiceCommand): Promise<VoiceCommand> {
    // Analyze intent and extract entities
    const intent = this.analyzeIntent(command.transcript);
    const entities = this.extractEntities(command.transcript);
    
    return {
      ...command,
      intent,
      entities,
    };
  }
  
  private analyzeIntent(transcript: string): VoiceCommand['intent'] {
    const lowerTranscript = transcript.toLowerCase();
    
    // Intent classification based on keywords
    if (lowerTranscript.includes('create') || lowerTranscript.includes('generate') || lowerTranscript.includes('write')) {
      return 'code_generation';
    }
    
    if (lowerTranscript.includes('explain') || lowerTranscript.includes('what does') || lowerTranscript.includes('how does')) {
      return 'code_explanation';
    }
    
    if (lowerTranscript.includes('modify') || lowerTranscript.includes('change') || lowerTranscript.includes('update')) {
      return 'code_modification';
    }
    
    if (lowerTranscript.includes('navigate') || lowerTranscript.includes('go to') || lowerTranscript.includes('open')) {
      return 'navigation';
    }
    
    if (lowerTranscript.includes('debug') || lowerTranscript.includes('fix') || lowerTranscript.includes('error')) {
      return 'debugging';
    }
    
    if (lowerTranscript.includes('test') || lowerTranscript.includes('unit test') || lowerTranscript.includes('testing')) {
      return 'testing';
    }
    
    if (lowerTranscript.includes('deploy') || lowerTranscript.includes('build') || lowerTranscript.includes('release')) {
      return 'deployment';
    }
    
    return 'code_generation'; // Default intent
  }
  
  private extractEntities(transcript: string): VoiceCommand['entities'] {
    const entities: VoiceCommand['entities'] = [];
    
    // Extract programming languages
    const languages = ['javascript', 'typescript', 'python', 'java', 'react', 'vue', 'angular'];
    languages.forEach(lang => {
      if (transcript.toLowerCase().includes(lang)) {
        entities?.push({
          type: 'programming_language',
          value: lang,
          confidence: 0.9,
        });
      }
    });
    
    // Extract file types
    const fileTypes = ['component', 'function', 'class', 'interface', 'api', 'route', 'model'];
    fileTypes.forEach(type => {
      if (transcript.toLowerCase().includes(type)) {
        entities?.push({
          type: 'file_type',
          value: type,
          confidence: 0.8,
        });
      }
    });
    
    // Extract function names (simple pattern matching)
    const functionPattern = /(?:function|method|procedure)\s+(\w+)/gi;
    let match;
    while ((match = functionPattern.exec(transcript)) !== null) {
      entities?.push({
        type: 'function_name',
        value: match[1],
        confidence: 0.7,
      });
    }
    
    return entities;
  }
  
  private async executeVoiceCommand(command: VoiceCommand): Promise<void> {
    try {
      // Send command to backend for processing
      const response = await fetch('/api/voice/process', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          command,
          context: this.contextBuffer.slice(-5), // Send last 5 commands for context
        }),
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result = await response.json();
      
      // Create voice response
      const voiceResponse: VoiceResponse = {
        id: crypto.randomUUID(),
        text: result.response,
        actions: result.actions,
        timestamp: new Date().toISOString(),
      };
      
      // Notify response listeners
      this.responseListeners.forEach(listener => listener(voiceResponse));
      
      // Speak the response if enabled
      if (result.shouldSpeak) {
        await this.speak(result.response);
      }
      
    } catch (error) {
      console.error('Error executing voice command:', error);
      
      const errorResponse: VoiceResponse = {
        id: crypto.randomUUID(),
        text: 'Sorry, I encountered an error processing your request.',
        timestamp: new Date().toISOString(),
      };
      
      this.responseListeners.forEach(listener => listener(errorResponse));
    }
  }
  
  // Public API methods
  async startListening(): Promise<void> {
    if (!this.recognition) {
      throw new Error('Speech recognition not available');
    }
    
    if (this.isListening) {
      return;
    }
    
    try {
      this.recognition.start();
    } catch (error) {
      console.error('Error starting speech recognition:', error);
      throw error;
    }
  }
  
  async stopListening(): Promise<void> {
    if (!this.recognition || !this.isListening) {
      return;
    }
    
    this.recognition.stop();
  }
  
  async speak(text: string, options?: {
    voice?: string;
    rate?: number;
    pitch?: number;
    volume?: number;
  }): Promise<void> {
    if (!this.synthesis) {
      console.warn('Speech synthesis not available');
      return;
    }
    
    return new Promise((resolve, reject) => {
      const utterance = new SpeechSynthesisUtterance(text);
      
      if (options) {
        if (options.rate) utterance.rate = options.rate;
        if (options.pitch) utterance.pitch = options.pitch;
        if (options.volume) utterance.volume = options.volume;
        
        if (options.voice) {
          const voices = this.synthesis!.getVoices();
          const selectedVoice = voices.find(voice => voice.name === options.voice);
          if (selectedVoice) {
            utterance.voice = selectedVoice;
          }
        }
      }
      
      utterance.onend = () => resolve();
      utterance.onerror = (event) => reject(event.error);
      
      this.synthesis!.speak(utterance);
    });
  }
  
  setLanguage(language: string): void {
    this.currentLanguage = language;
    if (this.recognition) {
      this.recognition.lang = language;
    }
  }
  
  getAvailableVoices(): SpeechSynthesisVoice[] {
    if (!this.synthesis) return [];
    return this.synthesis.getVoices();
  }
  
  isSupported(): boolean {
    return !!(this.recognition && this.synthesis);
  }
  
  isCurrentlyListening(): boolean {
    return this.isListening;
  }
  
  isCurrentlyProcessing(): boolean {
    return this.isProcessing;
  }
  
  // Event listeners
  onVoiceCommand(listener: (command: VoiceCommand) => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }
  
  onVoiceResponse(listener: (response: VoiceResponse) => void): () => void {
    this.responseListeners.add(listener);
    return () => this.responseListeners.delete(listener);
  }
  
  // Context management
  getContext(): VoiceCommand[] {
    return [...this.contextBuffer];
  }
  
  clearContext(): void {
    this.contextBuffer = [];
  }
  
  // Advanced features
  async processTextCommand(text: string): Promise<void> {
    const command: VoiceCommand = {
      id: crypto.randomUUID(),
      transcript: text,
      confidence: 1.0,
      language: this.currentLanguage,
      timestamp: new Date().toISOString(),
    };
    
    await this.processVoiceCommand(command);
  }
  
  async enableContinuousMode(): Promise<void> {
    // Enable continuous listening with wake word detection
    await this.startListening();
    
    // In a real implementation, this would include wake word detection
    console.log('Continuous mode enabled - say "Hey Floraa" to activate');
  }
  
  async disableContinuousMode(): Promise<void> {
    await this.stopListening();
    console.log('Continuous mode disabled');
  }
}

// Voice Command Patterns for better recognition
export const VoiceCommandPatterns = {
  codeGeneration: [
    'create a {type} called {name}',
    'generate a {language} {type}',
    'write a function that {description}',
    'implement {feature}',
    'build a {component} with {properties}',
  ],
  
  codeModification: [
    'add {feature} to {target}',
    'modify {target} to {description}',
    'update the {property} in {target}',
    'refactor {target}',
    'optimize {target} for {criteria}',
  ],
  
  navigation: [
    'open {file}',
    'go to {location}',
    'navigate to {path}',
    'show me {target}',
    'switch to {tab}',
  ],
  
  debugging: [
    'debug {target}',
    'fix the error in {location}',
    'check {target} for issues',
    'analyze {problem}',
    'troubleshoot {issue}',
  ],
  
  explanation: [
    'explain {target}',
    'what does {target} do',
    'how does {target} work',
    'describe {target}',
    'tell me about {target}',
  ],
};

// Export singleton instance
export const voiceToCode = VoiceToCodeSystem.getInstance();

// Type declarations for browser APIs
declare global {
  interface Window {
    SpeechRecognition: typeof SpeechRecognition;
    webkitSpeechRecognition: typeof SpeechRecognition;
  }
}

interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start(): void;
  stop(): void;
  onstart: ((this: SpeechRecognition, ev: Event) => any) | null;
  onend: ((this: SpeechRecognition, ev: Event) => any) | null;
  onresult: ((this: SpeechRecognition, ev: SpeechRecognitionEvent) => any) | null;
  onerror: ((this: SpeechRecognition, ev: SpeechRecognitionErrorEvent) => any) | null;
}

interface SpeechRecognitionEvent extends Event {
  resultIndex: number;
  results: SpeechRecognitionResultList;
}

interface SpeechRecognitionErrorEvent extends Event {
  error: string;
}

interface SpeechRecognitionResultList {
  length: number;
  item(index: number): SpeechRecognitionResult;
  [index: number]: SpeechRecognitionResult;
}

interface SpeechRecognitionResult {
  length: number;
  item(index: number): SpeechRecognitionAlternative;
  [index: number]: SpeechRecognitionAlternative;
  isFinal: boolean;
}

interface SpeechRecognitionAlternative {
  transcript: string;
  confidence: number;
}