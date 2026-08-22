import React, { useState, useRef, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import {
  Bot,
  X,
  Send,
  Sparkles,
  AlertTriangle,
  ShieldAlert,
  RotateCcw,
  User,
  ExternalLink,
  ChevronDown,
  ArrowUpRight,
  Copy,
  Check,
  MessageSquareQuote
} from 'lucide-react';
import { askLegalAI, ChatMessage, DEFAULT_SUGGESTIONS, LEGAL_DISCLAIMER, PDN_WARNING } from '../utils/aiLegalAssistant';

interface AiChatWidgetProps {
  onOpenConsultation: (topic?: string, message?: string) => void;
}

export const AiChatWidget: React.FC<AiChatWidgetProps> = ({ onOpenConsultation }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const initialGreeting: ChatMessage = {
    id: 'welcome-msg',
    role: 'assistant',
    content: `Здравствуйте! Я виртуальный **AI-помощник** на сайте юриста Мирошина Константина Алексеевича.

Я могу подсказать первичный порядок действий по распространенным юридическим вопросам (защита прав потребителей, претензии, сроки давности, арбитраж, споры по недвижимости).

> ⚠️ **Важно:** Я являюсь искусственным интеллектом. Мои ответы носят ознакомительный характер и не заменяют официальную консультацию юриста. Не вводите в чат паспортные данные, номера личных документов и адреса.`,
    timestamp: new Date().toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' }),
    source: 'system'
  };

  const [messages, setMessages] = useState<ChatMessage[]>([initialGreeting]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen && !isMinimized) {
      scrollToBottom();
      inputRef.current?.focus();
    }
  }, [messages, isOpen, isMinimized]);

  const handleSendMessage = async (textToSend?: string) => {
    const query = (textToSend || inputMessage).trim();
    if (!query || isLoading) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: query,
      timestamp: new Date().toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputMessage('');
    setIsLoading(true);

    try {
      const history = messages
        .filter((m) => m.role !== 'system')
        .map((m) => ({ role: m.role as 'user' | 'assistant', content: m.content }));

      const res = await askLegalAI(query, history);

      const botMsg: ChatMessage = {
        id: `bot-${Date.now()}`,
        role: 'assistant',
        content: res.text,
        timestamp: new Date().toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' }),
        source: res.source
      };

      setMessages((prev) => [...prev, botMsg]);
    } catch (_err) {
      const errorMsg: ChatMessage = {
        id: `err-${Date.now()}`,
        role: 'assistant',
        content: `Произошла ошибка при получении ответа. Пожалуйста, попробуйте сформулировать вопрос иначе или свяжитесь с юристом напрямую: **+7 (910) 700-08-01**.`,
        timestamp: new Date().toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' }),
        source: 'system'
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetChat = () => {
    setMessages([initialGreeting]);
    setInputMessage('');
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleBookConsultationFromChat = (userContext?: string) => {
    const topic = userContext ? `Вопрос из AI-чата: ${userContext.slice(0, 45)}...` : 'Консультация после общения с AI-ботом';
    onOpenConsultation(topic, userContext || '');
  };

  return (
    <>
      {/* Floating Toggle Button (Bottom Right) */}
      <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end">
        {!isOpen && (
          <div className="relative group">
            {/* Pop-up Hint Balloon on Desktop */}
            <div className="hidden sm:block absolute bottom-full right-0 mb-3 w-64 p-3 bg-slate-900/95 backdrop-blur-md border border-amber-500/30 rounded-2xl shadow-xl shadow-black/50 text-xs text-slate-200 pointer-events-none transition-all duration-300 transform translate-y-2 opacity-0 group-hover:opacity-100 group-hover:translate-y-0">
              <div className="flex items-center space-x-2 text-amber-400 font-semibold mb-1">
                <Sparkles className="w-3.5 h-3.5" />
                <span>AI-Помощник онлайн</span>
              </div>
              <p className="text-slate-300 text-[11px] leading-relaxed">
                Задайте вопрос и получите мгновенный правовой алгоритм по законам РФ.
              </p>
              <div className="absolute right-6 top-full w-0 h-0 border-x-6 border-x-transparent border-t-6 border-t-slate-900" />
            </div>

            {/* Main Trigger Button */}
            <button
              onClick={() => {
                setIsOpen(true);
                setIsMinimized(false);
              }}
              aria-label="Открыть AI чат-помощник"
              className="px-4 py-3.5 rounded-full btn-amber-glow text-slate-950 font-bold text-sm shadow-2xl shadow-amber-500/25 flex items-center space-x-2.5 group cursor-pointer border border-amber-300/40"
            >
              <div className="relative flex items-center justify-center">
                <Bot className="w-5 h-5" />
                <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-slate-950 animate-pulse" />
              </div>
              <span className="hidden sm:inline font-bold tracking-tight">Задать вопрос ИИ</span>
              <span className="sm:hidden font-bold">ИИ-Чат</span>
            </button>
          </div>
        )}
      </div>

      {/* Main Chat Drawer / Modal */}
      {isOpen && (
        <div
          className={`fixed z-50 transition-all duration-300 ease-in-out ${
            isMinimized
              ? 'bottom-6 right-6 w-80 sm:w-96 rounded-2xl shadow-2xl bg-slate-900 border border-slate-700'
              : 'bottom-4 right-4 sm:bottom-6 sm:right-6 w-[calc(100vw-2rem)] sm:w-[460px] h-[640px] max-h-[90vh] rounded-3xl shadow-2xl bg-[#0d1527] border border-slate-800 flex flex-col overflow-hidden backdrop-blur-xl'
          }`}
        >
          {/* Header */}
          <div className="px-4 py-3.5 bg-gradient-to-r from-slate-900 via-[#111c33] to-slate-900 border-b border-slate-800 flex items-center justify-between shrink-0">
            <div className="flex items-center space-x-2.5">
              <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
                <Bot className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <h3 className="text-sm font-bold text-white leading-tight">AI-Юрист Консультант</h3>
                  <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    Онлайн
                  </span>
                </div>
                <p className="text-[11px] text-slate-400">
                  Первичные разъяснения по праву РФ
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-1">
              <button
                onClick={handleResetChat}
                title="Очистить диалог"
                className="p-1.5 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-lg transition-colors"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
              <button
                onClick={() => setIsMinimized(!isMinimized)}
                title={isMinimized ? 'Развернуть' : 'Свернуть'}
                className="p-1.5 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-lg transition-colors"
              >
                <ChevronDown
                  className={`w-4 h-4 transition-transform duration-200 ${
                    isMinimized ? 'rotate-180' : ''
                  }`}
                />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                title="Закрыть чат"
                className="p-1.5 text-slate-400 hover:text-white hover:bg-red-500/20 rounded-lg transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {!isMinimized && (
            <>
              {/* Mandatory Legal & Personal Data Disclaimer Banner */}
              <div className="bg-amber-950/40 border-b border-amber-500/20 px-3.5 py-2 text-[11px] text-amber-200/90 flex items-start space-x-2 shrink-0">
                <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <div className="space-y-0.5 leading-tight">
                  <p className="font-semibold text-amber-300">
                    {LEGAL_DISCLAIMER}
                  </p>
                  <p className="text-[10px] text-amber-200/70">
                    🔒 <strong className="font-medium text-amber-200">152-ФЗ:</strong> Не вводите паспортные данные, номера документов, СНИЛС и домашние адреса.
                  </p>
                </div>
              </div>

              {/* Messages Area */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4 text-sm scrollbar-thin scrollbar-thumb-slate-800">
                {messages.map((msg) => {
                  const isBot = msg.role === 'assistant' || msg.role === 'system';

                  return (
                    <div
                      key={msg.id}
                      className={`flex flex-col ${isBot ? 'items-start' : 'items-end'}`}
                    >
                      <div className="flex items-end space-x-2 max-w-[90%] sm:max-w-[85%]">
                        {isBot && (
                          <div className="w-6 h-6 rounded-lg bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0 mb-1">
                            <Bot className="w-3.5 h-3.5" />
                          </div>
                        )}

                        <div
                          className={`rounded-2xl px-4 py-3 shadow-md ${
                            isBot
                              ? 'bg-slate-900/90 border border-slate-800 text-slate-200 rounded-bl-sm'
                              : 'bg-amber-500 text-slate-950 font-medium rounded-br-sm'
                          }`}
                        >
                          {isBot ? (
                            <div className="prose prose-invert prose-sm max-w-none text-slate-200 text-xs sm:text-[13px] leading-relaxed space-y-2">
                              <ReactMarkdown
                                components={{
                                  h3: ({ children }) => (
                                    <h4 className="font-bold text-amber-300 text-sm mt-2 mb-1">
                                      {children}
                                    </h4>
                                  ),
                                  strong: ({ children }) => (
                                    <strong className="font-semibold text-amber-200">
                                      {children}
                                    </strong>
                                  ),
                                  ul: ({ children }) => (
                                    <ul className="list-disc pl-4 space-y-1 my-1">
                                      {children}
                                    </ul>
                                  ),
                                  ol: ({ children }) => (
                                    <ol className="list-decimal pl-4 space-y-1 my-1">
                                      {children}
                                    </ol>
                                  ),
                                  blockquote: ({ children }) => (
                                    <blockquote className="border-l-2 border-amber-500/50 pl-2.5 py-1 text-slate-300 text-[11px] bg-slate-950/40 rounded-r my-1">
                                      {children}
                                    </blockquote>
                                  ),
                                  p: ({ children }) => (
                                    <p className="my-1 leading-relaxed">{children}</p>
                                  )
                                }}
                              >
                                {msg.content}
                              </ReactMarkdown>
                            </div>
                          ) : (
                            <p className="text-xs sm:text-[13px] leading-relaxed whitespace-pre-wrap">
                              {msg.content}
                            </p>
                          )}
                        </div>

                        {!isBot && (
                          <div className="w-6 h-6 rounded-lg bg-slate-800 flex items-center justify-center text-slate-300 shrink-0 mb-1">
                            <User className="w-3.5 h-3.5" />
                          </div>
                        )}
                      </div>

                      {/* Footer Info for Message */}
                      <div
                        className={`flex items-center space-x-2 mt-1 px-1 text-[10px] text-slate-500 ${
                          isBot ? 'pl-8' : 'pr-8'
                        }`}
                      >
                        <span>{msg.timestamp}</span>
                        {isBot && (
                          <>
                            <span>•</span>
                            <button
                              onClick={() => handleCopy(msg.id, msg.content)}
                              className="hover:text-slate-300 flex items-center space-x-1"
                              title="Скопировать ответ"
                            >
                              {copiedId === msg.id ? (
                                <>
                                  <Check className="w-3 h-3 text-emerald-400" />
                                  <span className="text-emerald-400">Скопировано</span>
                                </>
                              ) : (
                                <>
                                  <Copy className="w-3 h-3" />
                                  <span>Копировать</span>
                                </>
                              )}
                            </button>
                            <span>•</span>
                            <button
                              onClick={() => handleBookConsultationFromChat(msg.content)}
                              className="text-amber-400 hover:text-amber-300 flex items-center space-x-0.5 font-medium"
                            >
                              <span>К юристу</span>
                              <ArrowUpRight className="w-2.5 h-2.5" />
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  );
                })}

                {/* Loading indicator */}
                {isLoading && (
                  <div className="flex items-center space-x-2 pl-2">
                    <div className="w-6 h-6 rounded-lg bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400">
                      <Bot className="w-3.5 h-3.5" />
                    </div>
                    <div className="bg-slate-900 border border-slate-800 rounded-2xl rounded-bl-sm px-4 py-2.5 flex items-center space-x-1.5">
                      <span className="text-xs text-amber-400 font-medium">ИИ анализирует нормы права</span>
                      <span className="w-1.5 h-1.5 bg-amber-400 rounded-full animate-bounce" />
                      <span className="w-1.5 h-1.5 bg-amber-400 rounded-full animate-bounce [animation-delay:0.2s]" />
                      <span className="w-1.5 h-1.5 bg-amber-400 rounded-full animate-bounce [animation-delay:0.4s]" />
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* Quick Suggestions Chips */}
              <div className="px-3 pt-2 pb-1 border-t border-slate-800/80 bg-slate-950/60 overflow-x-auto whitespace-nowrap scrollbar-none flex items-center space-x-1.5 shrink-0">
                <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider pl-1 shrink-0">
                  Примеры:
                </span>
                {DEFAULT_SUGGESTIONS.map((suggestion, idx) => (
                  <button
                    key={idx}
                    disabled={isLoading}
                    onClick={() => handleSendMessage(suggestion)}
                    className="px-2.5 py-1 rounded-full text-[11px] bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:border-amber-500/40 hover:bg-slate-800 transition-colors shrink-0 disabled:opacity-50"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>

              {/* Chat Input Bar */}
              <div className="p-3 bg-slate-900 border-t border-slate-800 shrink-0 space-y-2">
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleSendMessage();
                  }}
                  className="flex items-center space-x-2"
                >
                  <input
                    ref={inputRef}
                    type="text"
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    placeholder="Опишите ситуацию (без паспортных данных)..."
                    disabled={isLoading}
                    maxLength={300}
                    className="flex-1 bg-slate-950 border border-slate-700 focus:border-amber-400 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-white placeholder-slate-500 outline-none transition-colors"
                  />
                  <button
                    type="submit"
                    disabled={!inputMessage.trim() || isLoading}
                    className="p-2.5 rounded-xl btn-amber-glow text-slate-950 font-bold disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition-all shadow-md"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </form>

                {/* Direct CTA to Human Lawyer */}
                <div className="flex items-center justify-between text-[11px] pt-1">
                  <span className="text-slate-400">Нужен детальный анализ дела?</span>
                  <button
                    onClick={() => handleBookConsultationFromChat(inputMessage)}
                    className="text-amber-400 hover:text-amber-300 font-semibold flex items-center space-x-1 group"
                  >
                    <span>Записаться к Мирошину К.А.</span>
                    <ArrowUpRight className="w-3 h-3 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      )}
    </>
  );
};
