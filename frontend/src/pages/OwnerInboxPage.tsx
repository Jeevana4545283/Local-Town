import { useState, useEffect, useRef } from 'react'
import { Card } from '../components/ui/Card'
import { MessageSquare, Send, CheckCircle2, User } from 'lucide-react'

export function OwnerInboxPage() {
  const [conversations, setConversations] = useState<any[]>([])
  const [activeConv, setActiveConv] = useState<any>(null)
  const [messages, setMessages] = useState<any[]>([])
  const [newMessage, setNewMessage] = useState('')
  const [loading, setLoading] = useState(true)
  
  const ownerId = localStorage.getItem('lt_user') ? JSON.parse(localStorage.getItem('lt_user')!).id : ''
  const token = localStorage.getItem('lt_token') || ''
  const scrollRef = useRef<HTMLDivElement>(null)

  // Polling Conversations
  useEffect(() => {
    fetchConversations()
    const interval = setInterval(fetchConversations, 3000)
    return () => clearInterval(interval)
  }, [])

  // Polling Messages
  useEffect(() => {
    if (activeConv) {
      fetchMessages()
      markAsRead(activeConv.id)
      const interval = setInterval(() => {
        fetchMessages()
        fetchConversations() // update unread badges
      }, 3000)
      return () => clearInterval(interval)
    }
  }, [activeConv])

  // Scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages])

  const fetchConversations = async () => {
    try {
      const res = await fetch('http://localhost:4000/api/conversations/owner', {
        headers: { Authorization: `Bearer ${token}` }
      })
      if (res.ok) {
        const data = await res.json()
        setConversations(data.items || [])
        setLoading(false)
      }
    } catch (err) {
      console.error(err)
    }
  }

  const fetchMessages = async () => {
    if (!activeConv) return
    try {
      const res = await fetch(`http://localhost:4000/api/conversations/${activeConv.id}`)
      if (res.ok) {
        const data = await res.json()
        setMessages(data.items || [])
      }
    } catch (err) {
      console.error(err)
    }
  }

  const markAsRead = async (convId: string) => {
    try {
      await fetch(`http://localhost:4000/api/conversations/messages/read/${convId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ readerId: ownerId })
      })
    } catch (err) {
      console.error(err)
    }
  }

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newMessage.trim() || !activeConv) return

    try {
      const res = await fetch('http://localhost:4000/api/conversations/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          conversationId: activeConv.id,
          senderId: ownerId,
          message: newMessage.trim()
        })
      })
      if (res.ok) {
        setNewMessage('')
        fetchMessages()
      }
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <div className="flex h-[calc(100vh-6rem)] overflow-hidden rounded-[2rem] border border-zinc-200 dark:border-white/10 bg-white dark:bg-zinc-900 shadow-2xl">
      
      {/* LEFT PANE: Conversations List */}
      <div className="w-1/3 border-r border-zinc-200 dark:border-white/10 flex flex-col bg-zinc-50 dark:bg-zinc-900/50">
        <div className="p-6 border-b border-zinc-200 dark:border-white/10">
          <h2 className="text-2xl font-black text-zinc-900 dark:text-white flex items-center gap-2">
            <MessageSquare size={24} className="text-indigo-500" /> Inbox
          </h2>
          <p className="text-sm font-medium text-zinc-500 mt-1">Chat with your guests</p>
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar p-4 space-y-2">
          {loading ? (
            <div className="text-center p-8 text-zinc-500">Loading...</div>
          ) : conversations.length === 0 ? (
            <div className="text-center p-8 text-zinc-500">No conversations yet.</div>
          ) : (
            conversations.map(c => (
              <button 
                key={c.id} 
                onClick={() => setActiveConv(c)}
                className={`w-full text-left p-4 rounded-2xl transition-all border ${activeConv?.id === c.id ? 'bg-white dark:bg-zinc-800 border-indigo-200 dark:border-indigo-500/30 shadow-sm' : 'bg-transparent border-transparent hover:bg-white/50 dark:hover:bg-white/5'}`}
              >
                <div className="flex justify-between items-start mb-1">
                  <div className="font-bold text-zinc-900 dark:text-white flex items-center gap-2">
                    <User size={16} className="text-zinc-400" /> {c.userName}
                  </div>
                  {c.unreadCount > 0 && (
                    <span className="bg-indigo-500 text-white text-[10px] font-black px-2 py-0.5 rounded-full">
                      {c.unreadCount} NEW
                    </span>
                  )}
                </div>
                <div className="text-xs font-bold text-indigo-500 dark:text-indigo-400 mb-2 truncate">
                  {c.rental?.title}
                </div>
                <div className="text-xs text-zinc-500 truncate">
                  {c.messages?.[0]?.message || 'No messages yet...'}
                </div>
              </button>
            ))
          )}
        </div>
      </div>

      {/* RIGHT PANE: Active Chat Window */}
      <div className="flex-1 flex flex-col bg-white dark:bg-zinc-950 relative">
        {activeConv ? (
          <>
            {/* Chat Header */}
            <div className="h-20 border-b border-zinc-200 dark:border-white/10 px-8 flex items-center justify-between bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md sticky top-0 z-10">
              <div className="flex items-center gap-4">
                <img src={activeConv.rental?.imageUrls?.[0] || 'https://via.placeholder.com/100'} className="size-12 rounded-xl object-cover" />
                <div>
                  <h3 className="text-lg font-black text-zinc-900 dark:text-white">{activeConv.userName}</h3>
                  <p className="text-xs font-bold text-indigo-500">{activeConv.rental?.title}</p>
                </div>
              </div>
            </div>

            {/* Messages Area */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto custom-scrollbar p-8 space-y-6">
              {messages.map((m, i) => {
                const isMine = m.senderId === ownerId
                return (
                  <div key={m.id} className={`flex flex-col ${isMine ? 'items-end' : 'items-start'}`}>
                    <div className={`max-w-[70%] rounded-2xl px-5 py-3 text-sm font-medium shadow-sm ${
                      isMine 
                        ? 'bg-gradient-to-br from-indigo-500 to-purple-600 text-white rounded-br-sm' 
                        : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 rounded-bl-sm border border-zinc-200 dark:border-white/5'
                    }`}>
                      {m.message}
                    </div>
                    <div className="text-[10px] font-bold text-zinc-400 mt-1 flex items-center gap-1">
                      {new Date(m.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      {isMine && m.isRead && <CheckCircle2 size={10} className="text-emerald-500" />}
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Input Area */}
            <div className="p-6 bg-zinc-50 dark:bg-zinc-900 border-t border-zinc-200 dark:border-white/10">
              <form onSubmit={sendMessage} className="flex items-center gap-3 bg-white dark:bg-zinc-950 p-2 rounded-2xl border border-zinc-200 dark:border-white/10 shadow-inner">
                <input 
                  type="text" 
                  value={newMessage}
                  onChange={e => setNewMessage(e.target.value)}
                  placeholder="Type a message..." 
                  className="flex-1 bg-transparent border-none outline-none px-4 text-sm font-medium dark:text-white"
                />
                <button type="submit" disabled={!newMessage.trim()} className="grid size-10 place-items-center rounded-xl bg-indigo-600 text-white disabled:opacity-50 hover:bg-indigo-700 transition-colors">
                  <Send size={18} />
                </button>
              </form>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-zinc-400">
            <MessageSquare size={64} className="mb-4 opacity-20" />
            <h3 className="text-xl font-bold text-zinc-500">No Chat Selected</h3>
            <p className="text-sm">Select a conversation from the sidebar to start chatting.</p>
          </div>
        )}
      </div>

    </div>
  )
}
