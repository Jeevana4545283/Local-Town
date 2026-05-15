import { AnimatePresence, motion } from 'framer-motion'
import { Bot, Sparkles, Send, X, Search, Zap } from 'lucide-react'
import { useMemo, useState, useRef, useEffect } from 'react'
import { api } from '../../lib/api'

type ChatMsg = {
  role: 'user' | 'assistant'
  text: string
}

export function ChatbotDock() {
  const [open, setOpen] = useState(false)
  const [text, setText] = useState('')
  const [isTyping, setIsTyping] = useState(false)

  const [msgs, setMsgs] = useState<ChatMsg[]>([
    {
      role: 'assistant',
      text:
        'Hi! 👋\n\nI can help you find rentals, workers, market prices, real-estate info, and services.\n\nHow can I help you today?',
    },
  ])

  const scrollRef = useRef<HTMLDivElement>(null)

  const canSend = useMemo(
    () => text.trim().length > 0 && !isTyping,
    [text, isTyping]
  )

  // Auto-scroll
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop =
        scrollRef.current.scrollHeight
    }
  }, [msgs, isTyping])

  async function send(overrideText?: string) {
    const message = overrideText || text.trim()

    if (!message || isTyping) return

    setText('')

    // Add user message
    setMsgs((m) => [
      ...m,
      {
        role: 'user',
        text: message,
      },
    ])

    setIsTyping(true)

    try {
      const r = await api.post('/ai/chat', {
        message,
      })

      const reply =
        r.data.reply ||
        'SmartTown AI could not generate a reply.'

      // Add assistant reply
      setMsgs((m) => [
        ...m,
        {
          role: 'assistant',
          text: reply,
        },
      ])
    } catch (error) {
      console.log(error)

      setMsgs((m) => [
        ...m,
        {
          role: 'assistant',
          text:
            '⚠️ AI service is temporarily unavailable.\n\nPlease try again shortly.',
        },
      ])
    } finally {
      setIsTyping(false)
    }
  }

  const suggestions = [
    {
      label: 'Rentals',
      icon: <Search className="size-3" />,
    },
    {
      label: 'Market Prices',
      icon: <Zap className="size-3" />,
    },
    {
      label: 'Book Cleaning',
      icon: <Sparkles className="size-3" />,
    },
  ]

  return (
    <div className="fixed bottom-6 right-6 z-[100]">
      <AnimatePresence>
        {open ? (
          <motion.div
            initial={{
              opacity: 0,
              y: 20,
              scale: 0.95,
              filter: 'blur(10px)',
            }}
            animate={{
              opacity: 1,
              y: 0,
              scale: 1,
              filter: 'blur(0px)',
            }}
            exit={{
              opacity: 0,
              y: 20,
              scale: 0.95,
              filter: 'blur(10px)',
            }}
            className="mb-4 w-[24rem] overflow-hidden rounded-[2.5rem] border border-white/20 bg-white/70 shadow-2xl backdrop-blur-3xl dark:border-zinc-800 dark:bg-zinc-900/80"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-zinc-200/50 px-6 py-4 dark:border-zinc-800/50">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="grid size-10 place-items-center rounded-2xl bg-zinc-900 text-white dark:bg-white dark:text-zinc-900">
                    <Bot className="size-5" />
                  </div>

                  <div className="absolute -bottom-1 -right-1 size-3 rounded-full border-2 border-white bg-emerald-500 dark:border-zinc-900" />
                </div>

                <div>
                  <h3 className="text-sm font-black text-zinc-900 dark:text-white">
                    Town AI
                  </h3>

                  <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">
                    Always Online
                  </p>
                </div>
              </div>

              <button
                onClick={() => setOpen(false)}
                className="rounded-full p-2 transition-colors hover:bg-zinc-100 dark:hover:bg-zinc-800"
              >
                <X className="size-4 text-zinc-500" />
              </button>
            </div>

            {/* Chat Area */}
            <div
              ref={scrollRef}
              className="h-96 space-y-4 overflow-y-auto px-6 py-4 scroll-smooth no-scrollbar"
            >
              {msgs.map((m, i) => (
                <motion.div
                  key={`${m.role}-${i}-${m.text}`}
                  initial={{
                    opacity: 0,
                    x: m.role === 'user' ? 10 : -10,
                  }}
                  animate={{
                    opacity: 1,
                    x: 0,
                  }}
                  className={`flex ${
                    m.role === 'user'
                      ? 'justify-end'
                      : 'justify-start'
                  }`}
                >
                  <div
                    className={`max-w-[85%] rounded-[1.5rem] px-4 py-3 text-sm font-medium leading-7 shadow-sm ${
                      m.role === 'user'
                        ? 'bg-zinc-900 text-white dark:bg-white dark:text-zinc-900'
                        : 'border border-zinc-100 bg-white text-zinc-700 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-200'
                    }`}
                  >
                    <div className="whitespace-pre-line">
                      {m.text}
                    </div>
                  </div>
                </motion.div>
              ))}

              {/* Typing Animation */}
              {isTyping && (
                <div className="flex justify-start">
                  <div className="flex gap-1 rounded-full bg-zinc-100 px-4 py-3 dark:bg-zinc-800">
                    <span className="size-1.5 animate-bounce rounded-full bg-zinc-400" />

                    <span className="size-1.5 animate-bounce rounded-full bg-zinc-400 [animation-delay:0.2s]" />

                    <span className="size-1.5 animate-bounce rounded-full bg-zinc-400 [animation-delay:0.4s]" />
                  </div>
                </div>
              )}
            </div>

            {/* Suggestions */}
            <div className="flex gap-2 px-6 pb-2">
              {suggestions.map((s) => (
                <button
                  key={s.label}
                  onClick={() => void send(s.label)}
                  className="flex items-center gap-1.5 rounded-full border border-zinc-200 bg-white px-3 py-1.5 text-[10px] font-bold text-zinc-600 transition-all hover:border-zinc-900 hover:text-zinc-900 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-400 dark:hover:border-white dark:hover:text-white"
                >
                  {s.icon}
                  {s.label}
                </button>
              ))}
            </div>

            {/* Input */}
            <div className="p-4">
              <div className="flex items-center gap-2 rounded-[1.5rem] border border-zinc-200 bg-zinc-50 p-2 focus-within:ring-4 focus-within:ring-zinc-900/5 dark:border-zinc-800 dark:bg-zinc-800/50">
                <input
                  className="flex-1 bg-transparent px-3 py-2 text-sm outline-none placeholder:text-zinc-400 dark:text-white"
                  placeholder="Type your message..."
                  value={text}
                  onChange={(e) =>
                    setText(e.target.value)
                  }
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault()
                      void send()
                    }
                  }}
                />

                <button
                  disabled={!canSend}
                  onClick={() => void send()}
                  className="flex size-10 items-center justify-center rounded-xl bg-zinc-900 text-white transition-all hover:scale-105 disabled:opacity-30 dark:bg-white dark:text-zinc-900"
                >
                  <Send className="size-4" />
                </button>
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.button
            layoutId="chat-dock"
            whileHover={{
              scale: 1.05,
              y: -2,
            }}
            whileTap={{
              scale: 0.95,
            }}
            onClick={() => setOpen(true)}
            className="flex h-14 items-center gap-3 rounded-full bg-zinc-900 px-6 text-white shadow-2xl dark:bg-white dark:text-zinc-900"
          >
            <div className="relative">
              <Sparkles className="size-5 text-amber-400" />

              <span className="absolute -right-1 -top-1 flex size-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-amber-400 opacity-75"></span>

                <span className="relative inline-flex size-2 rounded-full bg-amber-500"></span>
              </span>
            </div>

            <span className="font-bold tracking-tight">
              Ask Assistant
            </span>
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  )
}