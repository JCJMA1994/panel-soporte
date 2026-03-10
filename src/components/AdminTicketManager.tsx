import { useState } from 'react';
import { supabase } from '@/lib/supabase/client';
import { Input } from '@/components/ui/input';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Search, Settings2 } from 'lucide-react';

export interface AdminTicket {
    id: number;
    created_at: string;
    title: string;
    status: string;
    priority: string;
    technician_id?: string | null;
    solution?: string | null;
    profiles: {
        full_name: string | null;
        email: string;
    } | {
        full_name: string | null;
        email: string;
    }[];
    technician?: {
        full_name: string | null;
        email: string;
    } | {
        full_name: string | null;
        email: string;
    }[];
}

interface AdminTicketManagerProps {
    initialTickets: AdminTicket[];
    technicians: { id: string, full_name: string | null, email: string }[];
}

const statusColors: Record<string, string> = {
    'Abierto': 'bg-orange-50 text-orange-600 border-orange-100',
    'En Proceso': 'bg-blue-50 text-blue-600 border-blue-100',
    'Resuelto': 'bg-green-50 text-green-600 border-green-100',
    'Cerrado': 'bg-slate-50 text-slate-500 border-slate-100',
    'Open': 'bg-orange-50 text-orange-600 border-orange-100',
    'In Progress': 'bg-blue-50 text-blue-600 border-blue-100',
    'Resolved': 'bg-green-50 text-green-600 border-green-100',
};

const priorityColors: Record<string, string> = {
    'Alta': 'bg-red-50 text-red-600 border-red-100',
    'Media': 'bg-blue-50 text-blue-600 border-blue-100',
    'Baja': 'bg-slate-50 text-slate-500 border-slate-100',
    'Urgent': 'bg-red-50 text-red-600 border-red-100',
    'High': 'bg-orange-50 text-orange-600 border-orange-100',
    'Low': 'bg-slate-50 text-slate-500 border-slate-100',
    'Medium': 'bg-blue-50 text-blue-600 border-blue-100',
};

export default function AdminTicketManager({ initialTickets, technicians }: AdminTicketManagerProps) {
    const [tickets, setTickets] = useState(initialTickets);
    const [updatingId, setUpdatingId] = useState<number | null>(null);
    const [updatingTechId, setUpdatingTechId] = useState<number | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    // Modal State
    const [selectedTicket, setSelectedTicket] = useState<AdminTicket | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalStatus, setModalStatus] = useState('');
    const [modalSolution, setModalSolution] = useState('');
    const [isSavingModal, setIsSavingModal] = useState(false);

    const getProfileInfo = (ticket: AdminTicket) => {
        const p = ticket.profiles;
        if (!p) return { name: 'N/A', email: '', initials: 'CU' };
        
        const profile = Array.isArray(p) ? p[0] : p;
        if (!profile) return { name: 'N/A', email: '', initials: 'CU' };

        return {
            name: profile.full_name || profile.email || 'N/A',
            email: profile.email || '',
            initials: profile.full_name?.substring(0, 2).toUpperCase() || 'CU'
        };
    };

    const getTechnicianInfo = (ticket: AdminTicket) => {
        const t = ticket.technician;
        if (!t) return 'Unassigned';
        const technician = Array.isArray(t) ? t[0] : t;
        return technician?.full_name || technician?.email || 'Unassigned';
    };

    const filteredTickets = tickets.filter(ticket => {
        const term = searchTerm.toLowerCase();
        const profile = getProfileInfo(ticket);
        const techName = getTechnicianInfo(ticket).toLowerCase();
        return (
            ticket.id.toString().includes(term) ||
            ticket.title.toLowerCase().includes(term) ||
            profile.name.toLowerCase().includes(term) ||
            techName.includes(term)
        );
    });

    const totalPages = Math.ceil(filteredTickets.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginatedTickets = filteredTickets.slice(startIndex, startIndex + itemsPerPage);

    const handleStatusChange = async (ticketId: number, newStatus: string) => {
        setUpdatingId(ticketId);
        const { error } = await supabase
            .from('tickets')
            .update({ status: newStatus })
            .eq('id', ticketId);
        if (error) {
            console.error("Error al actualizar el estado:", error);
        } else {
            setTickets(currentTickets =>
                currentTickets.map(ticket =>
                    ticket.id === ticketId ? { ...ticket, status: newStatus } : ticket
                )
            );
        }
        setUpdatingId(null);
    };

    const handleTechnicianChange = async (ticketId: number, techId: string) => {
        setUpdatingTechId(ticketId);
        const { error } = await supabase
            .from('tickets')
            .update({ technician_id: techId === 'unassigned' ? null : techId })
            .eq('id', ticketId);
        
        if (error) {
            console.error("Error al asignar técnico:", error);
        } else {
            const selectedTech = technicians.find(t => t.id === techId);
            setTickets(currentTickets =>
                currentTickets.map(ticket =>
                    ticket.id === ticketId ? { 
                        ...ticket, 
                        technician_id: techId === 'unassigned' ? null : techId,
                        technician: techId === 'unassigned' ? undefined : {
                            full_name: selectedTech?.full_name || null,
                            email: selectedTech?.email || ''
                        }
                    } : ticket
                )
            );
        }
        setUpdatingTechId(null);
    };

    const openManageModal = (ticket: AdminTicket) => {
        setSelectedTicket(ticket);
        setModalStatus(ticket.status);
        setModalSolution(ticket.solution || '');
        setIsModalOpen(true);
    };

    const handleSaveModalUpdates = async () => {
        if (!selectedTicket) return;
        setIsSavingModal(true);

        const { error } = await supabase
            .from('tickets')
            .update({ 
                status: modalStatus,
                solution: modalSolution 
            })
            .eq('id', selectedTicket.id);

        if (error) {
            console.error("Error saving ticket updates:", error);
        } else {
            setTickets(currentTickets =>
                currentTickets.map(t =>
                    t.id === selectedTicket.id 
                        ? { ...t, status: modalStatus, solution: modalSolution } 
                        : t
                )
            );
            setIsModalOpen(false);
        }
        setIsSavingModal(false);
    };

    return (
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm mt-6">
            <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50">
                <div className="relative max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <Input 
                        placeholder="Search by ticket ID, title, customer or technician..." 
                        value={searchTerm}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                            setSearchTerm(e.target.value);
                            setCurrentPage(1); // Reset to page 1 on search
                        }}
                        className="pl-10 h-10 bg-white border-slate-200 rounded-lg text-sm focus:ring-[#1D7AFC] transition-all"
                    />
                </div>
            </div>

            <Table>
                <TableHeader className="bg-slate-50/30">
                    <TableRow className="hover:bg-transparent border-slate-100">
                        <TableHead className="w-[120px] font-bold text-slate-400 text-[10px] uppercase tracking-wider">Ticket ID</TableHead>
                        <TableHead className="font-bold text-slate-400 text-[10px] uppercase tracking-wider">Customer</TableHead>
                        <TableHead className="font-bold text-slate-400 text-[10px] uppercase tracking-wider">Issue Summary</TableHead>
                        <TableHead className="font-bold text-slate-400 text-[10px] uppercase tracking-wider">Priority</TableHead>
                        <TableHead className="font-bold text-slate-400 text-[10px] uppercase tracking-wider">Status</TableHead>
                        <TableHead className="w-[150px] font-bold text-slate-400 text-[10px] uppercase tracking-wider">Technician</TableHead>
                        <TableHead className="w-[100px] font-bold text-slate-400 text-[10px] uppercase tracking-wider">Manage</TableHead>
                        <TableHead className="font-bold text-slate-400 text-[10px] uppercase tracking-wider">Date Created</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {paginatedTickets.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={8} className="h-24 text-center text-slate-500 italic">
                                No tickets found matching your search.
                            </TableCell>
                        </TableRow>
                    ) : paginatedTickets.map((ticket) => {
                        const { name, initials } = getProfileInfo(ticket);
                        return (
                            <TableRow key={ticket.id} className="border-slate-100 hover:bg-slate-50/50">
                                <TableCell className="font-bold text-[#1D7AFC] text-sm">#{ticket.id}</TableCell>
                                <TableCell>
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-[10px] font-bold text-slate-600">
                                            {initials}
                                        </div>
                                        <span className="font-medium text-slate-900 text-sm">
                                            {name}
                                        </span>
                                    </div>
                                </TableCell>
                                <TableCell className="max-w-[200px] truncate text-slate-600 text-sm">{ticket.title}</TableCell>
                                <TableCell>
                                    <span className={cn(
                                        "px-2 py-0.5 rounded-full text-[10px] font-bold border",
                                        priorityColors[ticket.priority] || 'bg-slate-50 text-slate-600'
                                    )}>
                                        {ticket.priority}
                                    </span>
                                </TableCell>
                                <TableCell>
                                    <div className={cn(
                                        "flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-[10px] font-bold w-fit",
                                        statusColors[ticket.status] || 'bg-slate-50 text-slate-600'
                                    )}>
                                        <div className={cn("w-1.5 h-1.5 rounded-full",
                                            ticket.status === 'Abierto' ? "bg-orange-500" :
                                                ticket.status === 'En Proceso' ? "bg-blue-500" :
                                                    ticket.status === 'Resuelto' ? "bg-green-500" : "bg-slate-400"
                                        )}></div>
                                        {ticket.status}
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <Select
                                        defaultValue={ticket.technician_id || 'unassigned'}
                                        onValueChange={(techId) => handleTechnicianChange(ticket.id, techId)}
                                        disabled={updatingTechId === ticket.id}
                                    >
                                        <SelectTrigger className="h-7 w-[130px] border-none font-medium text-[10px] px-2 rounded-full bg-slate-50 text-slate-600 hover:bg-slate-100">
                                            <div className="flex-1 truncate text-left">
                                                <SelectValue placeholder="Assign Tech" />
                                            </div>
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="unassigned">Unassigned</SelectItem>
                                            {technicians.map(tech => (
                                                <SelectItem key={tech.id} value={tech.id}>
                                                    {tech.full_name || tech.email}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </TableCell>
                                <TableCell>
                                    <Button 
                                        variant="ghost" 
                                        size="sm" 
                                        className="h-8 w-8 p-0 text-slate-400 hover:text-[#1D7AFC] hover:bg-blue-50 transition-colors"
                                        onClick={() => openManageModal(ticket)}
                                    >
                                        <Settings2 className="h-4 w-4" />
                                    </Button>
                                </TableCell>
                                <TableCell className="text-slate-500 text-sm font-medium">
                                    {new Date(ticket.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                </TableCell>
                            </TableRow>
                        );
                    })}
                </TableBody>
            </Table>

            {/* Manage Ticket Modal */}
            <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle className="text-xl font-bold text-slate-900">
                            Ticket Management #{selectedTicket?.id}
                        </DialogTitle>
                    </DialogHeader>
                    
                    <div className="grid gap-6 py-4">
                        <div className="space-y-4">
                            <div className="grid gap-2">
                                <Label className="text-sm font-bold text-slate-700">Ticket Status</Label>
                                <Select value={modalStatus} onValueChange={setModalStatus}>
                                    <SelectTrigger className="w-full h-11 border-slate-200">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Abierto">Open</SelectItem>
                                        <SelectItem value="En Proceso">In Progress</SelectItem>
                                        <SelectItem value="Resuelto">Resolved</SelectItem>
                                        <SelectItem value="Cerrado">Closed</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="grid gap-2">
                                <Label className="text-sm font-bold text-slate-700">Solution Description</Label>
                                <Textarea 
                                    placeholder="Describe the solution provided..." 
                                    className="min-h-[150px] border-slate-200 focus-visible:ring-[#1D7AFC] transition-all text-sm leading-relaxed"
                                    value={modalSolution}
                                    onChange={(e) => setModalSolution(e.target.value)}
                                />
                                <p className="text-[10px] text-slate-400 italic">This solution will be visible to the customer.</p>
                            </div>
                        </div>
                    </div>

                    <DialogFooter className="flex gap-3 sm:justify-end mt-2">
                        <Button 
                            variant="outline" 
                            onClick={() => setIsModalOpen(false)}
                            className="px-6 h-10 text-slate-600"
                        >
                            Cancel
                        </Button>
                        <Button 
                            className="bg-[#1D7AFC] hover:bg-[#1565D8] px-8 h-10 text-white font-bold transition-all shadow-md"
                            onClick={handleSaveModalUpdates}
                            disabled={isSavingModal}
                        >
                            {isSavingModal ? 'Saving...' : 'Save Changes'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <div className="px-6 py-4 border-t border-slate-100 flex items-center justify-between text-xs font-medium text-slate-500">
                <p>
                    Showing {filteredTickets.length > 0 ? startIndex + 1 : 0} to {Math.min(startIndex + itemsPerPage, filteredTickets.length)} of {filteredTickets.length} tickets
                </p>
                <div className="flex gap-1">
                    <button 
                        onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                        disabled={currentPage === 1}
                        className="w-8 h-8 flex items-center justify-center border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors disabled:opacity-50"
                    >
                        <ChevronLeft className="h-4 w-4" />
                    </button>
                    
                    {[...Array(totalPages)].map((_, i) => (
                        <button
                            key={i + 1}
                            onClick={() => setCurrentPage(i + 1)}
                            className={cn(
                                "w-8 h-8 flex items-center justify-center rounded-lg transition-colors border",
                                currentPage === i + 1 
                                    ? "bg-[#1D7AFC] text-white border-[#1D7AFC]" 
                                    : "border-slate-200 hover:bg-slate-50 text-slate-600"
                            )}
                        >
                            {i + 1}
                        </button>
                    )).slice(Math.max(0, currentPage - 3), Math.min(totalPages, currentPage + 2))}

                    <button 
                        onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                        disabled={currentPage === totalPages || totalPages === 0}
                        className="w-8 h-8 flex items-center justify-center border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors disabled:opacity-50"
                    >
                        <ChevronRight className="h-4 w-4" />
                    </button>
                </div>
            </div>
        </div>
    );
}

function ChevronDown(props: any) {
    return <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6" /></svg>
}

function ChevronLeft(props: any) {
    return <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6" /></svg>
}

function ChevronRight(props: any) {
    return <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6" /></svg>
}