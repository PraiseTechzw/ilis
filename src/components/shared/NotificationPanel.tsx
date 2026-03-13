'use client'

import { useState, useEffect } from 'react'
import { Bell, X, CheckCircle, Info, AlertTriangle, Zap, ExternalLink } from 'lucide-react'
import { cn } from '@/lib/utils'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'

interface Notification {
  id: string
  title: string
  message: string
  type: 'INFO' | 'SUCCESS' | 'WARNING' | 'ALERT'
  is_read: boolean
  link?: string
  created_at: string
}

export function NotificationPanel() {
  const [isOpen, setIsOpen] = useState(false)
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [unreadCount, setUnreadCount] = useState(0)
  const supabase = createClient()

  useEffect(() => {
    fetchNotifications()
    
    // Subscribe to new notifications
    const channel = supabase
      .channel('notifications_realtime')
      .on('postgres_changes', { 
        event: 'INSERT', 
        schema: 'public', 
        table: 'notifications' 
      }, (payload) => {
        setNotifications(prev => [payload.new as Notification, ...prev])
        setUnreadCount(prev => prev + 1)
      })
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [])

  const fetchNotifications = async () => {
    const { data } = await supabase
      .from('notifications')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(10)
    
    if (data) {
      setNotifications(data as Notification[])
      setUnreadCount(data.filter(n => !n.is_read).length)
    }
  }

  const markRead = async (id: string) => {
    const { error } = await supabase
      .from('notifications')
      .update({ is_read: true })
      .eq('id', id)
    
    if (!error) {
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, is_read: true } : n))
      setUnreadCount(prev => Math.max(0, prev - 1))
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'SUCCESS': return <CheckCircle size={14} className="text-signal-healthy" />
      case 'WARNING': return <AlertTriangle size={14} className="text-signal-stagnant" />
      case 'ALERT': return <Zap size={14} className="text-signal-intel" />
      default: return <Info size={14} className="text-signal-intel" />
    }
  }

  return (
    <div className="relative">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 hover:bg-white/5 rounded-lg transition-all relative group"
      >
        <Bell size={20} className={cn(
          "transition-colors",
          unreadCount > 0 ? "text-signal-intel" : "text-text-muted group-hover:text-text-primary"
        )} />
        {unreadCount > 0 && (
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-signal-intel rounded-full animate-pulse shadow-[0_0_8px_rgba(0,176,255,0.8)]" />
        )}
      </button>

      {isOpen && (
        <>
          <div 
            className="fixed inset-0 z-40 bg-black/20 backdrop-blur-[2px]" 
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 mt-4 w-80 bg-surface border border-white/10 rounded-2xl shadow-2xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-4 duration-300">
            <div className="p-4 border-b border-white/5 flex items-center justify-between bg-white/[0.02]">
               <h3 className="text-[10px] font-data font-black uppercase tracking-[0.2em] text-text-muted">
                 System_Bulletins
               </h3>
               <button onClick={() => setIsOpen(false)} className="text-text-dim hover:text-text-primary">
                 <X size={14} />
               </button>
            </div>

            <div className="max-h-96 overflow-y-auto custom-scrollbar">
              {notifications.length === 0 ? (
                <div className="p-8 text-center space-y-2">
                   <Bell size={24} className="mx-auto text-text-dim opacity-20" />
                   <p className="text-[10px] font-data text-text-dim uppercase">No_Active_Signals</p>
                </div>
              ) : (
                notifications.map((n) => (
                  <div 
                    key={n.id} 
                    className={cn(
                      "p-4 border-b border-white/5 transition-colors relative group",
                      !n.is_read ? "bg-signal-intel/5" : "hover:bg-white/[0.02]"
                    )}
                    onClick={() => !n.is_read && markRead(n.id)}
                  >
                    {!n.is_read && (
                      <div className="absolute left-0 top-0 bottom-0 w-1 bg-signal-intel" />
                    )}
                    <div className="flex gap-3">
                       <div className="mt-0.5">{getTypeIcon(n.type)}</div>
                       <div className="space-y-1 flex-1">
                          <div className="flex items-center justify-between">
                             <h4 className="text-[11px] font-interface font-black uppercase text-text-primary leading-tight">
                                {n.title}
                             </h4>
                             <span className="text-[8px] font-data text-text-dim uppercase">
                                {new Date(n.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                             </span>
                          </div>
                          <p className="text-[10px] font-interface text-text-muted leading-relaxed line-clamp-2">
                             {n.message}
                          </p>
                          {n.link && (
                            <Link 
                              href={n.link} 
                              onClick={() => setIsOpen(false)}
                              className="inline-flex items-center gap-1 text-[9px] font-data text-signal-intel uppercase hover:underline pt-1"
                            >
                              Connect_to_Node <ExternalLink size={8} />
                            </Link>
                          )}
                       </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="p-3 bg-white/[0.02] border-t border-white/5 text-center">
               <button className="text-[9px] font-data text-text-muted hover:text-signal-intel uppercase tracking-widest transition-colors">
                 Clear_Cache
               </button>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
