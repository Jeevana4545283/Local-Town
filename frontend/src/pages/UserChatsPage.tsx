import { useState, useEffect, useRef } from 'react'
import { MessageSquare, Send, CheckCircle2, ChevronLeft, Building2 } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { NotificationsDropdown } from '../components/ui/NotificationsDropdown'

export function UserChatsPage() {
  const [conversations, setConversations] = useState<any[]>([])
  const [activeConv, setActiveConv] = useState<any>(null)
  const [messages, setMessages] = useState<any[]>([])
  const [newMessage, setNewMessage] = useState('')
  const [loading, setLoading] = useState(true)
  
  // Use existing generated guest ID from local storage, or create one if somehow empty
  const getUserId = () => {
    let id = localStorage.getItem('lt_guest_id')
    if (!id) {
      id = 'guest-' + Math.random().toString(36).substr(2, 9)
      localStorage.setItem('lt_guest_id', id)
    }
    return id
  }
  
  const userId = getUserId()
  const scrollRef = useRef<HTMLDivElement>(null)
  const navigate = useNavigate()

  useEffect(() => {
    fetchConversations()
    const interval = setInterval(fetchConversations, 3000)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    if (activeConv) {
      fetchMessages()
      markAsRead(activeConv.id)
      const interval = setInterval(() => {
        fetchMessages()
        fetchConversations()
      }, 3000)
      return () => clearInterval(interval)
    }
  }, [activeConv])

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages])

  const fetchConversations = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE || 'http://localhost:4000'}/api/conversations/user/${userId}`)
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
      const res = await fetch(`${import.meta.env.VITE_API_BASE || 'http://localhost:4000'}/api/conversations/${activeConv.id}`)
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
      await fetch(`${import.meta.env.VITE_API_BASE || 'http://localhost:4000'}/api/conversations/messages/read/${convId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ readerId: userId })
      })
    } catch (err) {
      console.error(err)
    }
  }

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newMessage.trim() || !activeConv) return

    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE || 'http://localhost:4000'}/api/conversations/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          conversationId: activeConv.id,
          senderId: userId,
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
    <div className="relative h-screen w-screen overflow-hidden bg-zinc-950 font-sans text-white">
      {/* PREMIUM BACKGROUND */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-950 via-purple-900 to-slate-900" />
        <div className="absolute -left-32 -top-32 size-[40rem] rounded-full bg-cyan-500/20 blur-[100px]" />
        <div className="absolute -right-32 bottom-0 size-[40rem] rounded-full bg-purple-500/20 blur-[100px]" />
        <div className="absolute left-1/3 top-1/2 size-[30rem] -translate-y-1/2 rounded-full bg-indigo-500/10 blur-[100px]" />
      </div>

      <div className="relative z-10 flex h-[calc(100vh-2rem)] w-[calc(100vw-2rem)] m-4 overflow-hidden rounded-[2.5rem] border border-white/10 bg-white/10 shadow-[0_8px_32px_0_rgba(0,0,0,0.3)] backdrop-blur-2xl">
        
        {/* LEFT PANE */}
        <div className="w-1/3 border-r border-white/10 flex flex-col bg-black/20">
          <div className="p-6 border-b border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button onClick={() => navigate('/rentals')} className="grid size-8 place-items-center rounded-full bg-white/5 hover:bg-white/10 transition">
                <ChevronLeft size={18} className="text-zinc-300" />
              </button>
              <div>
                <h2 className="text-xl font-black text-white">My Chats</h2>
                <p className="text-xs text-zinc-400">Messages with property owners</p>
              </div>
            </div>
            <NotificationsDropdown userId={userId} />
          </div>

          <div className="flex-1 overflow-y-auto custom-scrollbar p-4 space-y-2">
            {loading ? (
              <div className="text-center p-8 text-zinc-500">Loading...</div>
            ) : conversations.length === 0 ? (
              <div className="text-center p-8 text-zinc-500">No chats found. <br/> Book a property to start chatting!</div>
            ) : (
              conversations.map(c => (
                <button 
                  key={c.id} 
                  onClick={() => setActiveConv(c)}
                  className={`w-full text-left p-4 rounded-2xl transition-all border ${activeConv?.id === c.id ? 'bg-white/10 border-cyan-500/50 shadow-sm' : 'bg-transparent border-transparent hover:bg-white/5'}`}
                >
                  <div className="flex justify-between items-start mb-1">
                    <div className="font-bold text-white flex items-center gap-2">
                      <Building2 size={16} className="text-cyan-400" /> {c.rental?.title}
                    </div>
                    {c.unreadCount > 0 && (
                      <span className="bg-cyan-500 text-black text-[10px] font-black px-2 py-0.5 rounded-full">
                        {c.unreadCount} NEW
                      </span>
                    )}
                  </div>
                  <div className="text-xs text-zinc-400 truncate">
                    {c.owner?.name ? `Owner: ${c.owner.name}` : 'Property Owner'}
                  </div>
                </button>
              ))
            )}
          </div>
        </div>

        {/* RIGHT PANE */}
        <div className="flex-1 flex flex-col relative bg-black/40">
          {activeConv ? (
            <>
              {/* Chat Header */}
              <div className="h-20 border-b border-white/10 px-8 flex items-center justify-between bg-black/20 backdrop-blur-md sticky top-0 z-10">
                <div className="flex items-center gap-4">
                  <img src={activeConv.rental?.imageUrls?.[0] || 'https://via.placeholder.com/100'} className="size-12 rounded-xl object-cover" />
                  <div>
                    <h3 className="text-lg font-black text-white">{activeConv.rental?.title}</h3>
                    <p className="text-xs font-bold text-cyan-400">Owner: {activeConv.owner?.name || 'Property Owner'}</p>
                  </div>
                </div>
              </div>

              {/* Messages */}
              <div ref={scrollRef} className="flex-1 overflow-y-auto custom-scrollbar p-8 space-y-6">
                {messages.map((m, i) => {
                  const isMine = m.senderId === userId
                  return (
                    <div key={m.id} className={`flex flex-col ${isMine ? 'items-end' : 'items-start'}`}>
                      <div className={`max-w-[70%] rounded-2xl px-5 py-3 text-sm font-medium shadow-sm ${
                        isMine 
                          ? 'bg-gradient-to-br from-cyan-500 to-indigo-500 text-white rounded-br-sm' 
                          : 'bg-white/10 text-white rounded-bl-sm border border-white/5'
                      }`}>
                        {m.message}
                      </div>
                      <div className="text-[10px] font-bold text-zinc-500 mt-1 flex items-center gap-1">
                        {new Date(m.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        {isMine && m.isRead && <CheckCircle2 size={10} className="text-cyan-400" />}
                      </div>
                    </div>
                  )
                })}
              </div>

              {/* Input Area */}
              <div className="p-6 bg-black/20 border-t border-white/10">
                <form onSubmit={sendMessage} className="flex items-center gap-3 bg-white/5 p-2 rounded-2xl border border-white/10">
                  <input 
                    type="text" 
                    value={newMessage}
                    onChange={e => setNewMessage(e.target.value)}
                    placeholder="Type a message..." 
                    className="flex-1 bg-transparent border-none outline-none px-4 text-sm font-medium text-white"
                  />
                  <button type="submit" disabled={!newMessage.trim()} className="grid size-10 place-items-center rounded-xl bg-cyan-500 text-black font-black disabled:opacity-50 hover:bg-cyan-400 transition-colors">
                    <Send size={18} />
                  </button>
                </form>
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-zinc-600">
              <MessageSquare size={64} className="mb-4 opacity-20" />
              <h3 className="text-xl font-bold text-zinc-500">No Chat Selected</h3>
              <p className="text-sm">Select a conversation from the sidebar to chat with the owner.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
