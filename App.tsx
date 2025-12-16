import React, { useState, useRef, useEffect } from 'react';
import { Header } from './components/Header';
import { ChatScreen } from './components/ChatScreen';
import { ResultScreen } from './components/ResultScreen';
import { SettingsModal } from './components/SettingsModal';
import { HistorySidebar } from './components/HistorySidebar';
import { OnboardingScreen } from './components/OnboardingScreen';
import { HomeScreen } from './components/HomeScreen';
import { BottomNav } from './components/BottomNav';
import { ProfileScreen } from './components/ProfileScreen';
import { SweetPotatoCalculator } from './components/SweetPotatoCalculator';
import { Message, Ingredient, Product, Store, BotConfig, ChatSession, AppView, UserProfile, AnalysisResult } from './types';
import { analyzeDisease, speakText } from './services/geminiService';

// Mock Data
const MOCK_STORES: Store[] = [
  { id: '1', name: 'Cửa hàng VTNN Ba Minh', distance: '1.2 km', tags: ['Gần bạn', 'Có thể có thuốc phù hợp'], phone: '0912345678', address: 'Ấp 3, Xã Tân Thạnh, Long An' },
  { id: '2', name: 'Đại lý Hai Lúa', distance: '3.5 km', tags: ['Chuyên BVTV', 'Uy tín'], phone: '0987654321', address: 'Thị trấn Bến Lức, Long An' },
];

const DEFAULT_WELCOME_MSG: Message = { 
  id: 'welcome', 
  role: 'bot', 
  type: 'text', 
  content: 'Chào bác. Tôi là trợ lý BVTV. Để hỗ trợ tốt nhất, bác cho tôi biết bác đang canh tác cây gì và đang gặp vấn đề gì ạ?' 
};

// Audio Helper Functions
const decodeBase64 = (base64: string) => {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
};

const arrayBufferToAudioBuffer = (
  data: Uint8Array,
  ctx: AudioContext,
  sampleRate: number = 24000,
  numChannels: number = 1
): AudioBuffer => {
  const dataInt16 = new Int16Array(data.buffer);
  const frameCount = dataInt16.length / numChannels;
  const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);

  for (let channel = 0; channel < numChannels; channel++) {
    const channelData = buffer.getChannelData(channel);
    for (let i = 0; i < frameCount; i++) {
      channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
    }
  }
  return buffer;
};

export default function App() {
  // Navigation State
  const [currentView, setCurrentView] = useState<AppView>('onboarding');
  
  // User State
  const [userProfile, setUserProfile] = useState<UserProfile>({ name: '' });

  // Chat Data State
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [currentSessionId, setCurrentSessionId] = useState<string>('');
  const [messages, setMessages] = useState<Message[]>([DEFAULT_WELCOME_MSG]);
  const [currentAnalysisResult, setCurrentAnalysisResult] = useState<AnalysisResult | null>(null);
  
  // UI State
  const [isLoading, setIsLoading] = useState(false);
  const [inputMode, setInputMode] = useState<'default' | 'actions'>('default');
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  
  const [botConfig, setBotConfig] = useState<BotConfig>({
    tone: 'friendly',
    length: 'concise',
    voice: 'Puck'
  });

  // Web Audio API refs
  const audioContextRef = useRef<AudioContext | null>(null);
  const sourceNodeRef = useRef<AudioBufferSourceNode | null>(null);

  // 1. Initial Load (Sessions, User, Onboarding status)
  useEffect(() => {
    // Check Onboarding
    const hasOnboarded = localStorage.getItem('bvtv_has_onboarded');
    if (hasOnboarded) {
      setCurrentView('home');
    }

    // Load Sessions
    const savedSessions = localStorage.getItem('bvtv_chat_history');
    if (savedSessions) {
      try {
        const parsed = JSON.parse(savedSessions);
        setSessions(parsed);
      } catch (e) {
        console.error("Failed to parse history", e);
      }
    }

    // Load User
    const savedUser = localStorage.getItem('bvtv_user_profile');
    if (savedUser) {
      try {
        setUserProfile(JSON.parse(savedUser));
      } catch (e) { console.error(e); }
    }

    // Ensure we have a current session ID even if empty (for when we create new)
    if (!currentSessionId) {
       createNewSession(false); // don't switch view yet
    }
  }, []);

  // 2. Persist Sessions
  useEffect(() => {
    if (!currentSessionId) return;

    setSessions(prevSessions => {
      const updatedSessions = prevSessions.map(session => {
        if (session.id === currentSessionId) {
          const lastMsg = messages[messages.length - 1];
          // Update preview text
          let preview = 'Đang chat...';
          if (lastMsg) {
             if (lastMsg.type === 'text' && lastMsg.content) preview = lastMsg.content.substring(0, 50);
             else if (lastMsg.type === 'analysis_result') preview = 'Kết quả phân tích';
          }
          
          return {
            ...session,
            messages: messages,
            timestamp: Date.now(),
            preview: preview
          };
        }
        return session;
      });

      localStorage.setItem('bvtv_chat_history', JSON.stringify(updatedSessions));
      return updatedSessions;
    });
    
  }, [messages, currentSessionId]);

  // 3. Persist User
  const updateUser = (newProfile: UserProfile) => {
    setUserProfile(newProfile);
    localStorage.setItem('bvtv_user_profile', JSON.stringify(newProfile));
  };

  // Onboarding Finish
  const handleStartOnboarding = (profile: UserProfile) => {
    updateUser(profile);
    localStorage.setItem('bvtv_has_onboarded', 'true');
    setCurrentView('home');
  };

  // Helper: Create New Session
  const createNewSession = (switchToChat = true) => {
    const newId = Date.now().toString();
    const newSession: ChatSession = {
      id: newId,
      title: 'Hội thoại mới',
      timestamp: Date.now(),
      messages: [DEFAULT_WELCOME_MSG],
      preview: 'Bắt đầu cuộc trò chuyện'
    };
    
    setSessions(prev => [newSession, ...prev]);
    setCurrentSessionId(newId);
    setMessages([DEFAULT_WELCOME_MSG]);
    setInputMode('default');
    setCurrentAnalysisResult(null);
    
    if (switchToChat) {
      setCurrentView('chat');
    }
  };

  // Helper: Load Session
  const loadSession = (session: ChatSession) => {
    setCurrentSessionId(session.id);
    setMessages(session.messages);
    
    // Find last analysis result if any
    const lastResultMsg = [...session.messages].reverse().find(m => m.type === 'analysis_result');
    if (lastResultMsg?.data) {
      setCurrentAnalysisResult(lastResultMsg.data);
      setCurrentView('result'); // Open result directly for completed sessions
    } else {
      setCurrentAnalysisResult(null);
      setCurrentView('chat');
    }
    
    setInputMode(session.messages.some(m => m.type === 'analysis_result') ? 'actions' : 'default');
    setIsHistoryOpen(false);
  };

  const handleDeleteSession = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const newSessions = sessions.filter(s => s.id !== id);
    setSessions(newSessions);
    localStorage.setItem('bvtv_chat_history', JSON.stringify(newSessions));

    if (id === currentSessionId) {
      if (newSessions.length > 0) {
        // Just load the data, don't necessarily switch view if we are on home
        const next = newSessions[0];
        setCurrentSessionId(next.id);
        setMessages(next.messages);
      } else {
        createNewSession(false);
      }
    }
  };

  const handleClearAllHistory = () => {
    if (sessions.length === 0) return;
    
    if (window.confirm('Bạn có chắc chắn muốn xóa toàn bộ lịch sử trò chuyện? Hành động này không thể hoàn tác.')) {
      setSessions([]);
      localStorage.removeItem('bvtv_chat_history');
      createNewSession(false);
      setIsHistoryOpen(false);
    }
  };

  const handleRateSession = (rating: number, feedback: string) => {
    console.log(`Rating for session ${currentSessionId}: ${rating} stars. Feedback: ${feedback}`);
  };

  // Chat Actions
  const handleSend = async (text: string) => {
    const isFirstUserMsg = messages.length === 1 && messages[0].id === 'welcome';
    if (isFirstUserMsg) {
      setSessions(prev => prev.map(s => 
        s.id === currentSessionId 
          ? { ...s, title: text.substring(0, 30) + (text.length > 30 ? '...' : '') } 
          : s
      ));
    }

    const userMsg: Message = { id: Date.now().toString(), role: 'user', type: 'text', content: text };
    const updatedMessages = [...messages, userMsg];
    setMessages(updatedMessages);
    setIsLoading(true);

    // Call API logic
    const response = await analyzeDisease(text, botConfig, updatedMessages);

    const newMessages: Message[] = [];
    
    // Always add the text response (question or confirmation)
    newMessages.push({
      id: (Date.now() + 1).toString(),
      role: 'bot',
      type: 'text',
      content: response.text
    });

    // If analysis is complete, add result message AND switch view
    if (response.isAnalysisComplete && response.analysisResult) {
       const resultMsg: Message = {
         id: (Date.now() + 2).toString(),
         role: 'bot',
         type: 'analysis_result',
         data: response.analysisResult
       };
       newMessages.push(resultMsg);

       // Update state
       setMessages(prev => [...prev, ...newMessages]);
       setCurrentAnalysisResult(response.analysisResult);
       
       // Switch to separate result screen
       setCurrentView('result');
       setInputMode('default');
    } else {
       // Normal chat continuation
       setMessages(prev => [...prev, ...newMessages]);
       setInputMode('default');
    }
    
    setIsLoading(false);
  };

  const handleAction = (action: 'ingredients' | 'products' | 'stores') => {
    const userActionText = 
      action === 'ingredients' ? 'Xem các hoạt chất trị bệnh' :
      action === 'products' ? 'Tham khảo một số thuốc' : 'Tìm cửa hàng gần đây';

    const userMsg: Message = { id: Date.now().toString(), role: 'user', type: 'text', content: userActionText };
    
    let botResponse: Message | null = null;
    
    if (action === 'stores') {
      botResponse = { id: (Date.now() + 1).toString(), role: 'bot', type: 'stores', data: MOCK_STORES };
    }
    
    setMessages(prev => botResponse ? [...prev, userMsg, botResponse] : [...prev, userMsg]);
  };

  const handleFindStoreForProduct = (productName: string) => {
    const text = `Tìm nơi bán thuốc ${productName} gần đây`;
    const userMsg: Message = { id: Date.now().toString(), role: 'user', type: 'text', content: text };
    const botMsg: Message = { 
      id: (Date.now() + 1).toString(), 
      role: 'bot', 
      type: 'stores', 
      data: MOCK_STORES 
    };
    setMessages(prev => [...prev, userMsg, botMsg]);
  };

  const playAudio = async (text: string) => {
    if (sourceNodeRef.current) {
      sourceNodeRef.current.stop();
      sourceNodeRef.current = null;
    }

    const base64Audio = await speakText(text, botConfig.voice);
    if (base64Audio) {
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
      }
      
      const ctx = audioContextRef.current;
      
      if (ctx.state === 'suspended') {
        await ctx.resume();
      }

      const bytes = decodeBase64(base64Audio);
      const buffer = arrayBufferToAudioBuffer(bytes, ctx);

      const source = ctx.createBufferSource();
      source.buffer = buffer;
      source.connect(ctx.destination);
      source.start(0);
      
      sourceNodeRef.current = source;
      
      return new Promise<void>((resolve) => {
        source.onended = () => {
          sourceNodeRef.current = null;
          resolve();
        };
      });
    }
  };

  // VIEW RENDERING
  if (currentView === 'onboarding') {
    return <OnboardingScreen onComplete={handleStartOnboarding} />;
  }

  // CALCULATOR VIEW
  if (currentView === 'calculator') {
    return <SweetPotatoCalculator onBack={() => setCurrentView('home')} />;
  }

  // RESULT VIEW
  if (currentView === 'result' && currentAnalysisResult) {
    return (
      <div className="min-h-screen bg-slate-50 flex justify-center">
        <div className="w-full max-w-md bg-white min-h-screen shadow-2xl overflow-hidden flex flex-col relative">
          <ResultScreen 
            result={currentAnalysisResult}
            stores={MOCK_STORES}
            onBack={() => setCurrentView('chat')} // Let user go back to chat history
            onNewCase={() => createNewSession(true)}
            onSaveAndExit={() => {
              alert('Đã lưu trường hợp vào lịch sử!');
              setCurrentView('home');
            }}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex justify-center">
      <div className="w-full max-w-md bg-white min-h-screen shadow-2xl overflow-hidden flex flex-col relative">
        
        {/* VIEW: CHAT */}
        {currentView === 'chat' && (
          <ChatScreen 
            messages={messages}
            onSend={handleSend}
            onAction={handleAction}
            onFindStoreForProduct={handleFindStoreForProduct}
            onPlayAudio={playAudio}
            onViewResult={(result) => {
              setCurrentAnalysisResult(result);
              setCurrentView('result');
            }}
            isLoading={isLoading}
            inputMode={inputMode}
            onBack={() => setCurrentView('home')}
            onOpenHistory={() => setIsHistoryOpen(true)}
            onOpenSettings={() => setIsSettingsOpen(true)}
            onRateSession={handleRateSession}
          />
        )}

        {/* VIEW: HOME */}
        {currentView === 'home' && (
          <HomeScreen 
            user={userProfile}
            recentSessions={[...sessions].sort((a,b) => b.timestamp - a.timestamp)}
            onOpenSession={(id) => loadSession(sessions.find(s => s.id === id)!)}
            onNewChat={() => createNewSession(true)}
            onFindStore={() => {
              createNewSession(true);
              handleSend('Tìm cửa hàng gần đây');
            }}
            onOpenCalculator={() => setCurrentView('calculator')}
            onDeleteSession={handleDeleteSession}
          />
        )}

        {/* VIEW: PROFILE */}
        {currentView === 'profile' && (
          <ProfileScreen 
            user={userProfile}
            onUpdateUser={updateUser}
            onOpenSettings={() => setIsSettingsOpen(true)}
          />
        )}

        {/* Global Modals */}
        <SettingsModal 
          isOpen={isSettingsOpen} 
          onClose={() => setIsSettingsOpen(false)}
          config={botConfig}
          onSave={(newConfig) => {
            setBotConfig(newConfig);
            setIsSettingsOpen(false);
          }}
        />

        <HistorySidebar 
          isOpen={isHistoryOpen}
          onClose={() => setIsHistoryOpen(false)}
          sessions={sessions}
          currentSessionId={currentSessionId}
          onSelectSession={(id) => loadSession(sessions.find(s => s.id === id)!)}
          onNewChat={() => createNewSession(true)}
          onDeleteSession={handleDeleteSession}
          onClearAll={handleClearAllHistory}
        />

        {/* Bottom Navigation (Hidden in Chat, Calculator, Result) */}
        {currentView !== 'chat' && currentView !== 'result' && (
          <BottomNav 
            currentView={currentView} 
            onChange={setCurrentView} 
            onNewChat={() => createNewSession(true)}
          />
        )}
      </div>
    </div>
  );
}