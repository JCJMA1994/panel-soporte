import { useState, useEffect } from 'react';
import { Bell, CheckCircle2, Clock } from 'lucide-react';
import { Button } from "@/components/ui/button";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { supabase } from '@/lib/supabase/client';

interface Notification {
    id: string;
    title: string;
    message: string;
    type: string;
    is_read: boolean;
    created_at: string;
}

export default function AdminHeader({ totalTickets = 0 }: { totalTickets?: number }) {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [unreadCount, setUnreadCount] = useState(0);

    const fetchNotifications = async () => {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        const { data, error } = await supabase
            .from('notifications')
            .select('*')
            .eq('user_id', user.id)
            .order('created_at', { ascending: false })
            .limit(10);

        if (error) {
            console.error('Error fetching notifications:', error);
        } else {
            setNotifications(data || []);
            setUnreadCount(data?.filter(n => !n.is_read).length || 0);
        }
    };

    const markAsRead = async (id: string) => {
        const { error } = await supabase
            .from('notifications')
            .update({ is_read: true })
            .eq('id', id);

        if (error) {
            console.error('Error marking notification as read:', error);
        } else {
            setNotifications(prev => 
                prev.map(n => n.id === id ? { ...n, is_read: true } : n)
            );
            setUnreadCount(prev => Math.max(0, prev - 1));
        }
    };

    useEffect(() => {
        fetchNotifications();

        // Subscribe to real-time notifications
        const setupSubscription = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;

            const subscription = supabase
                .channel('notifications_channel')
                .on(
                    'postgres_changes',
                    { 
                        event: 'INSERT', 
                        schema: 'public', 
                        table: 'notifications',
                        filter: `user_id=eq.${user.id}`
                    },
                    (payload) => {
                        const newNotification = payload.new as Notification;
                        setNotifications(prev => [newNotification, ...prev].slice(0, 10));
                        setUnreadCount(prev => prev + 1);
                    }
                )
                .subscribe();

            return subscription;
        };

        const subPromise = setupSubscription();

        return () => {
            subPromise.then(sub => sub?.unsubscribe());
        };
    }, []);

    return (
        <header className="flex items-center justify-between px-8 py-4 bg-white border-b border-slate-200">
            <div className="flex items-center gap-4">
                <h1 className="text-2xl font-semibold text-slate-900">Ticket Management</h1>
                <span className="px-2 py-0.5 text-xs font-medium text-slate-500 bg-slate-100 rounded-full transition-all">
                    {totalTickets.toLocaleString()} Total
                </span>
            </div>

            <div className="flex items-center gap-6">
                <div className="flex items-center gap-3">
                    <Popover>
                        <PopoverTrigger asChild>
                            <Button variant="ghost" size="icon" className="text-slate-500 hover:text-slate-900 overflow-visible relative">
                                <Bell className="h-5 w-5" />
                                {unreadCount > 0 && (
                                    <span className="absolute top-2 right-2.5 w-2.5 h-2.5 bg-red-500 border-2 border-white rounded-full animate-pulse"></span>
                                )}
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-80 p-0 overflow-hidden" align="end">
                            <div className="px-4 py-3 border-b border-slate-100 bg-slate-50/50">
                                <h3 className="text-sm font-bold text-slate-800">Notifications</h3>
                            </div>
                            <div className="max-h-[350px] overflow-y-auto">
                                {notifications.length === 0 ? (
                                    <div className="p-8 text-center">
                                        <Bell className="h-8 w-8 text-slate-200 mx-auto mb-2" />
                                        <p className="text-xs text-slate-500">No notifications yet</p>
                                    </div>
                                ) : (
                                    notifications.map((n) => (
                                        <div 
                                            key={n.id} 
                                            className={cn(
                                                "p-4 border-b border-slate-50 last:border-0 hover:bg-slate-50 transition-colors cursor-pointer relative group",
                                                !n.is_read && "bg-blue-50/30"
                                            )}
                                            onClick={() => !n.is_read && markAsRead(n.id)}
                                        >
                                            <div className="flex gap-3">
                                                <div className={cn(
                                                    "w-2 h-2 rounded-full mt-1.5 shrink-0",
                                                    !n.is_read ? "bg-[#1D7AFC]" : "bg-slate-200"
                                                )}></div>
                                                <div className="flex-1 space-y-1">
                                                    <p className="text-xs font-bold text-slate-900">{n.title}</p>
                                                    <p className="text-[11px] text-slate-600 leading-relaxed pr-4">{n.message}</p>
                                                    <div className="flex items-center gap-1.5 text-[10px] text-slate-400 mt-2">
                                                        <Clock className="h-3 w-3" />
                                                        <span>{new Date(n.created_at).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}</span>
                                                    </div>
                                                </div>
                                            </div>
                                            {!n.is_read && (
                                                <button 
                                                    className="absolute right-4 top-4 opacity-0 group-hover:opacity-100 transition-opacity"
                                                    title="Mark as read"
                                                >
                                                    <CheckCircle2 className="h-3.5 w-3.5 text-slate-400 hover:text-green-500" />
                                                </button>
                                            )}
                                        </div>
                                    ))
                                )}
                            </div>
                        </PopoverContent>
                    </Popover>
                </div>
            </div>
        </header>
    );
}
