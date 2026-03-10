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
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover';

interface User {
    id: string;
    email: string;
    full_name: string | null;
    first_name: string | null;
    last_name: string | null;
    dni: string | null;
    area: string | null;
    role: string;
    created_at: string;
}

export default function UserManager() {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');

    // Formulario Nuevo Usuario
    const [newUserEmail, setNewUserEmail] = useState('');
    const [newUserPassword, setNewUserPassword] = useState('');
    const [newUserFirstName, setNewUserFirstName] = useState('');
    const [newUserLastName, setNewUserLastName] = useState('');
    const [newUserDni, setNewUserDni] = useState('');
    const [newUserArea, setNewUserArea] = useState('');
    const [newUserRole, setNewUserRole] = useState('cliente');
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Reset Password
    const [resetPasswords, setResetPasswords] = useState<Record<string, string>>({});

    // Areas fetch
    const [areasList, setAreasList] = useState<{id: number, nombre: string}[]>([]);

    // Columnas Dinámicas
    const defaultColumns = [
        { key: 'fullName', label: 'Nombre Completo', visible: true, width: 200 },
        { key: 'dni', label: 'DNI', visible: true, width: 120 },
        { key: 'area', label: 'Área', visible: true, width: 150 },
        { key: 'email', label: 'Email', visible: true, width: 220 },
        { key: 'role', label: 'Rol Actual', visible: true, width: 160 },
        { key: 'resetPass', label: 'Cambiar Contraseña', visible: true, width: 200 },
        { key: 'actions', label: 'Acciones', visible: true, width: 100 },
    ];
    const [columns, setColumns] = useState(defaultColumns);
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

    const fetchAreas = async () => {
        try {
            const res = await fetch('/api/admin/areas');
            if (res.ok) {
                const data = await res.json();
                setAreasList(data.areas || []);
            }
        } catch (err) {
            console.error('Error fetching areas:', err);
        }
    };

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/admin/users');
            const data = await res.json();
            if (res.ok) {
                setUsers(data.users);
            } else {
                setError(data.error);
            }
        } catch (err: any) {
            setError(err.message);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchUsers();
        fetchAreas();
    }, []);

    const handleCreateUser = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setMessage('');
        setError('');
        try {
            const res = await fetch('/api/admin/users', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email: newUserEmail,
                    password: newUserPassword,
                    first_name: newUserFirstName,
                    last_name: newUserLastName,
                    dni: newUserDni,
                    area: newUserArea,
                    role: newUserRole
                })
            });
            const data = await res.json();
            if (res.ok) {
                setMessage(`Usuario ${newUserEmail} creado con éxito.`);
                setNewUserEmail('');
                setNewUserPassword('');
                setNewUserFirstName('');
                setNewUserLastName('');
                setNewUserDni('');
                setNewUserArea('');
                fetchUsers();
            } else {
                setError(data.error);
            }
        } catch (err: any) {
            setError(err.message);
        }
        setIsSubmitting(false);
    };

    const handleDeleteUser = async (id: string) => {
        if (!confirm('¿Estás seguro de eliminar este usuario? Esa acción no se puede deshacer.')) return;
        try {
            const res = await fetch(`/api/admin/users?id=${id}`, { method: 'DELETE' });
            if (res.ok) {
                setMessage('Usuario eliminado');
                fetchUsers();
            } else {
                const data = await res.json();
                setError(data.error);
            }
        } catch (err: any) {
            setError(err.message);
        }
    };

    const handleRoleChange = async (id: string, newRole: string) => {
        try {
            const res = await fetch('/api/admin/update-role', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId: id, role: newRole })
            });
            if (res.ok) {
                setMessage('Rol actualizado');
                fetchUsers();
            } else {
                const data = await res.json();
                setError(data.error);
            }
        } catch (err: any) {
            setError(err.message);
        }
    };

    const handleResetPassword = async (id: string) => {
        const newPassword = resetPasswords[id];
        if (!newPassword || newPassword.length < 6) {
            alert("Introduce una contraseña de al menos 6 caracteres para este usuario.");
            return;
        }

        try {
            const res = await fetch('/api/admin/reset-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId: id, newPassword })
            });
            if (res.ok) {
                setMessage('Contraseña actualizada con éxito');
                setResetPasswords({ ...resetPasswords, [id]: '' });
            } else {
                const data = await res.json();
                setError(data.error);
            }
        } catch (err: any) {
            setError(err.message);
        }
    };

    const [searchTerm, setSearchTerm] = useState('');

    const filteredUsers = users.filter(u => {
        const term = searchTerm.toLowerCase();
        const fullName = (`${u.first_name || ''} ${u.last_name || ''}`).trim().toLowerCase() || (u.full_name || '').toLowerCase();
        const dni = u.dni || '';
        return fullName.includes(term) || dni.includes(term);
    });

    if (loading) return <p>Cargando usuarios...</p>;

    return (
        <div className="space-y-8">
            {error && <div className="bg-red-50 text-red-600 p-4 rounded-md">{error}</div>}
            {message && <div className="bg-green-50 text-green-600 p-4 rounded-md">{message}</div>}

            {/* Formulario Crear Usuario */}
            <Card>
                <CardHeader>
                    <CardTitle>Crear Nuevo Usuario</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleCreateUser} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        <div className="space-y-2">
                            <Label>Nombres</Label>
                            <Input 
                                value={newUserFirstName} 
                                onChange={e => setNewUserFirstName(e.target.value.toUpperCase())} 
                                required 
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Apellidos</Label>
                            <Input 
                                value={newUserLastName} 
                                onChange={e => setNewUserLastName(e.target.value.toUpperCase())} 
                                required 
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>DNI / Documento</Label>
                            <Input 
                                value={newUserDni} 
                                onChange={e => {
                                    const val = e.target.value;
                                    if (/^\d*$/.test(val) && val.length <= 8) {
                                        setNewUserDni(val);
                                    }
                                }} 
                                required 
                                minLength={8}
                                maxLength={8}
                                placeholder="8 dígitos"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Área / Departamento</Label>
                            <Select value={newUserArea} onValueChange={setNewUserArea}>
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Seleccione un área" />
                                </SelectTrigger>
                                <SelectContent className="max-h-60">
                                    {areasList.map(area => (
                                        <SelectItem key={area.id} value={area.nombre}>
                                            {area.nombre}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label>Email</Label>
                            <Input type="email" value={newUserEmail} onChange={e => setNewUserEmail(e.target.value)} required />
                        </div>
                        <div className="space-y-2">
                            <Label>Contraseña Inicial</Label>
                            <Input type="password" value={newUserPassword} onChange={e => setNewUserPassword(e.target.value)} required minLength={6} />
                        </div>
                        <div className="space-y-2 lg:col-span-3">
                            <Label>Rol</Label>
                            <Select value={newUserRole} onValueChange={setNewUserRole}>
                                <SelectTrigger className="w-full md:w-1/3">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="cliente">Cliente (Usuario Soporte)</SelectItem>
                                    <SelectItem value="administrador">Administrador (Técnico)</SelectItem>
                                    <SelectItem value="superadmin">Superadmin (Gestor)</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="lg:col-span-3 flex justify-end mt-2">
                            <Button type="submit" disabled={isSubmitting}>
                                {isSubmitting ? 'Creando...' : 'Crear Usuario'}
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>

            {/* Tabla de Usuarios */}
            <Card>
                <CardHeader className="flex flex-row items-start sm:items-center justify-between pb-2 gap-4 flex-wrap">
                    <CardTitle>Lista de Usuarios</CardTitle>
                    <div className="flex items-center gap-2 flex-1 max-w-sm justify-end">
                        <Input 
                            placeholder="Buscar por DNI o Nombre..." 
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="h-9"
                        />
                        <Popover>
                        <PopoverTrigger asChild>
                            <Button variant="outline" size="sm">
                                ⚙️ Columnas
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent align="end" className="w-56">
                            <div className="space-y-3">
                                <h4 className="font-medium text-sm">Mostrar u Ocultar Columnas</h4>
                                <div className="space-y-2">
                                    {columns.map(col => (
                                        <div key={col.key} className="flex items-center space-x-2">
                                            <input 
                                                type="checkbox" 
                                                id={`col-${col.key}`} 
                                                checked={col.visible}
                                                onChange={() => {
                                                    setColumns(cols => cols.map(c => 
                                                        c.key === col.key ? { ...c, visible: !c.visible } : c
                                                    ))
                                                }}
                                                className="w-4 h-4 rounded border-gray-300"
                                            />
                                            <label htmlFor={`col-${col.key}`} className="text-sm cursor-pointer select-none">{col.label}</label>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </PopoverContent>
                    </Popover>
                    </div>
                </CardHeader>
                <CardContent className="overflow-x-auto">
                    <Table style={{ tableLayout: 'fixed', minWidth: 'max-content' }}>
                        <TableHeader>
                            <TableRow>
                                {columns.filter(c => c.visible).map(col => (
                                    <TableHead 
                                        key={col.key} 
                                        style={{ width: col.width, position: 'relative' }}
                                        className={col.key === 'actions' ? 'text-right' : ''}
                                    >
                                        {col.label}
                                        {col.key !== 'actions' && (
                                            <div 
                                                onMouseDown={(e) => handleResizeStart(e, col.key, col.width)}
                                                className="absolute right-0 top-0 h-full w-2 cursor-col-resize hover:bg-slate-300 active:bg-slate-400 z-10 transition-colors"
                                                style={{ transform: 'translateX(50%)' }}
                                            />
                                        )}
                                    </TableHead>
                                ))}
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredUsers.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={columns.filter(c => c.visible).length} className="h-24 text-center">
                                        No se encontraron usuarios.
                                    </TableCell>
                                </TableRow>
                            ) : filteredUsers.map(u => (
                                <TableRow key={u.id}>
                                    {columns.find(c => c.key === 'fullName')?.visible && (
                                        <TableCell className="font-medium whitespace-nowrap overflow-hidden text-ellipsis">
                                            {u.first_name || u.last_name ? `${u.first_name || ''} ${u.last_name || ''}`.trim() : (u.full_name || 'Sin nombre')}
                                        </TableCell>
                                    )}
                                    {columns.find(c => c.key === 'dni')?.visible && (
                                        <TableCell className="overflow-hidden text-ellipsis">{u.dni || '-'}</TableCell>
                                    )}
                                    {columns.find(c => c.key === 'area')?.visible && (
                                        <TableCell className="overflow-hidden text-ellipsis" title={u.area || ''}>{u.area || '-'}</TableCell>
                                    )}
                                    {columns.find(c => c.key === 'email')?.visible && (
                                        <TableCell className="overflow-hidden text-ellipsis" title={u.email}>{u.email}</TableCell>
                                    )}
                                    {columns.find(c => c.key === 'role')?.visible && (
                                        <TableCell>
                                            <Select value={u.role} onValueChange={(val) => handleRoleChange(u.id, val)}>
                                                <SelectTrigger className="w-full h-8 text-xs">
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="cliente">Cliente</SelectItem>
                                                    <SelectItem value="administrador">Administrador</SelectItem>
                                                    <SelectItem value="superadmin">Superadmin</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </TableCell>
                                    )}
                                    {columns.find(c => c.key === 'resetPass')?.visible && (
                                        <TableCell>
                                            <div className="flex items-center gap-2">
                                                <Input 
                                                    type="password" 
                                                    placeholder="Nueva pass..." 
                                                    className="w-full h-8 text-xs" 
                                                    value={resetPasswords[u.id] || ''}
                                                    onChange={(e) => setResetPasswords({...resetPasswords, [u.id]: e.target.value})}
                                                />
                                                <Button size="sm" variant="outline" className="h-8 text-xs" onClick={() => handleResetPassword(u.id)}>
                                                    Guardar
                                                </Button>
                                            </div>
                                        </TableCell>
                                    )}
                                    {columns.find(c => c.key === 'actions')?.visible && (
                                        <TableCell className="text-right">
                                            <Button size="sm" variant="destructive" onClick={() => handleDeleteUser(u.id)}>
                                                Borrar
                                            </Button>
                                        </TableCell>
                                    )}
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
}
