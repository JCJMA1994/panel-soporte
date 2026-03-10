import { useState, useEffect } from 'react';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { cn } from "@/lib/utils";

export interface Ticket {
    id: number;
    created_at: string;
    title: string;
    status: string;
    priority: string;
}

const statusRowColors: Record<string, string> = {
    'Abierto': 'bg-orange-200/80 hover:bg-orange-300 text-orange-900',
    'En Proceso': 'bg-blue-200/80 hover:bg-blue-300 text-blue-900',
    'Resuelto': 'bg-green-200/80 hover:bg-green-300 text-green-900',
    'Cerrado': 'bg-slate-200/80 hover:bg-slate-300 text-slate-800',
};

interface TicketListProps {
    tickets: Ticket[];
}

export default function TicketList({ tickets }: TicketListProps) {
    // Estado de columnas para redimensionamiento
    const [columns, setColumns] = useState([
        { key: 'id', label: 'ID', width: 80 },
        { key: 'title', label: 'Título', width: 300 },
        { key: 'priority', label: 'Prioridad', width: 120 },
        { key: 'status', label: 'Estado', width: 120 },
        { key: 'date', label: 'Fecha', width: 120 },
    ]);

    const [resizingCol, setResizingCol] = useState<string | null>(null);
    const [startX, setStartX] = useState(0);
    const [startWidth, setStartWidth] = useState(0);

    const handleResizeStart = (e: React.MouseEvent, colKey: string, currentWidth: number) => {
        e.preventDefault();
        setResizingCol(colKey);
        setStartX(e.clientX);
        setStartWidth(currentWidth);
    };

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            if (!resizingCol) return;
            const diff = e.clientX - startX;
            setColumns(cols => cols.map(c => 
                c.key === resizingCol ? { ...c, width: Math.max(50, startWidth + diff) } : c
            ));
        };
        
        const handleMouseUp = () => {
            setResizingCol(null);
        };

        if (resizingCol) {
            window.addEventListener('mousemove', handleMouseMove);
            window.addEventListener('mouseup', handleMouseUp);
        }

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', handleMouseUp);
        };
    }, [resizingCol, startX, startWidth]);

    if (!tickets || tickets.length === 0) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle>Mis Tickets</CardTitle>
                </CardHeader>
                <CardContent>
                    <p>Aún no has creado ningún ticket.</p>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card className="flex flex-col max-h-[600px]">
            <CardHeader className="shrink-0">
                <CardTitle>Mis Tickets</CardTitle>
            </CardHeader>
            <CardContent className="flex-1 overflow-auto pr-2">
                <div className="min-w-full overflow-x-auto">
                    <Table style={{ tableLayout: 'fixed', width: 'max-content', minWidth: '100%' }}>
                    <TableHeader>
                        <TableRow>
                            {columns.map(col => (
                                <TableHead 
                                    key={col.key} 
                                    style={{ width: col.width, position: 'relative' }}
                                >
                                    {col.label}
                                    <div 
                                        onMouseDown={(e) => handleResizeStart(e, col.key, col.width)}
                                        className="absolute right-0 top-0 h-full w-2 cursor-col-resize hover:bg-slate-300 active:bg-slate-400 z-10 transition-colors"
                                        style={{ transform: 'translateX(50%)' }}
                                    />
                                </TableHead>
                            ))}
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {tickets.map((ticket) => (
                            <TableRow 
                                key={ticket.id}
                                className={cn(
                                    "transition-colors",
                                    statusRowColors[ticket.status] || ""
                                )}
                            >
                                <TableCell className="font-bold text-[#1D7AFC] overflow-hidden text-ellipsis whitespace-nowrap">
                                    #{ticket.id}
                                </TableCell>
                                <TableCell className="font-medium overflow-hidden text-ellipsis whitespace-nowrap" title={ticket.title}>
                                    {ticket.title}
                                </TableCell>
                                <TableCell className="overflow-hidden text-ellipsis whitespace-nowrap">
                                    {ticket.priority}
                                </TableCell>
                                <TableCell className="overflow-hidden text-ellipsis whitespace-nowrap">
                                    {ticket.status}
                                </TableCell>
                                <TableCell className="overflow-hidden text-ellipsis whitespace-nowrap">
                                    {new Date(ticket.created_at).toLocaleDateString()}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
                </div>
            </CardContent>
        </Card>
    );
}