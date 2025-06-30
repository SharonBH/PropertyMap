import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminLayout from '@/components/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { 
  Plus, 
  Search, 
  MoreHorizontal, 
  Edit, 
  Shield, 
  Trash2,
  Settings
} from 'lucide-react';
import { getRolesEndpoint, deleteRoleEndpoint, RoleDto } from '@/api/homemapapi';
import { useToast } from '@/hooks/use-toast';

const RolesPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [roles, setRoles] = useState<RoleDto[]>([]);
  const [filteredRoles, setFilteredRoles] = useState<RoleDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState<RoleDto | null>(null);

  const fetchRoles = async () => {
    try {
      setLoading(true);
      const rolesList = await getRolesEndpoint();
      setRoles(rolesList);
      setFilteredRoles(rolesList);
    } catch (error) {      toast({
        title: 'Error',
        description: 'Failed to fetch roles',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRoles();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (searchTerm) {
      const filtered = roles.filter(role =>
        role.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        role.description?.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredRoles(filtered);
    } else {
      setFilteredRoles(roles);
    }
  }, [searchTerm, roles]);

  const handleDeleteRole = async (roleId: string) => {
    try {
      await deleteRoleEndpoint(roleId);      await fetchRoles(); // Refresh the list
      toast({
        title: 'Success',
        description: 'Role deleted successfully',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete role',
        variant: 'destructive',
      });
    }
    setDeleteDialogOpen(false);
    setSelectedRole(null);
  };

  const isSystemRole = (roleName: string) => {
    const systemRoles = ['Admin', 'Basic'];
    return systemRoles.includes(roleName);
  };

  const getRoleBadge = (roleName: string) => {
    if (isSystemRole(roleName)) {
      return <Badge variant="secondary">תפקיד מערכת</Badge>;
    }
    return <Badge variant="outline">תפקיד מותאם</Badge>;
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-2 text-gray-600">טוען תפקידים...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>            <h2 className="text-lg font-medium text-gray-900">ניהול תפקידים</h2>
            <p className="text-gray-600">נהל תפקידי משתמשים והרשאות</p>
          </div>
          <Button onClick={() => navigate('/admin/roles/new')}>
            <Plus className="h-4 w-4 mr-2" />
            הוסף תפקיד
          </Button>
        </div>

        {/* Search and Filters */}
        <Card>
          <CardHeader>
            <CardTitle>חיפוש תפקידים</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              <Search className="h-4 w-4 text-gray-400" />
              <Input
                placeholder="חפש לפי שם תפקיד או תיאור..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="max-w-sm"
              />
            </div>
          </CardContent>
        </Card>

        {/* Roles Table */}
        <Card>
          <CardHeader>
            <CardTitle>תפקידים ({filteredRoles.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>                  <TableHead>שם תפקיד</TableHead>
                  <TableHead>תיאור</TableHead>
                  <TableHead>סוג</TableHead>
                  <TableHead>פעולות</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredRoles.map((role) => (
                  <TableRow key={role.id}>
                    <TableCell>
                      <div className="font-medium">{role.name}</div>
                    </TableCell>
                    <TableCell>
                      <div className="text-gray-600">
                        {role.description || 'No description'}
                      </div>
                    </TableCell>
                    <TableCell>{getRoleBadge(role.name || '')}</TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem 
                            onClick={() => navigate(`/admin/roles/${role.id}/edit`)}
                            disabled={isSystemRole(role.name || '')}
                          >
                            <Edit className="h-4 w-4 mr-2" />
                            Edit Role
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            onClick={() => navigate(`/admin/roles/${role.id}/permissions`)}
                          >
                            <Shield className="h-4 w-4 mr-2" />
                            Manage Permissions
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem 
                            className="text-red-600"
                            disabled={isSystemRole(role.name || '')}
                            onClick={() => {
                              setSelectedRole(role);
                              setDeleteDialogOpen(true);
                            }}
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete Role
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            {filteredRoles.length === 0 && (
              <div className="text-center py-8">
                <p className="text-gray-500">No roles found</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Delete Confirmation Dialog */}
        <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete the role
                "{selectedRole?.name}" and remove all associated permissions.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                className="bg-red-600 hover:bg-red-700"
                onClick={() => selectedRole?.id && handleDeleteRole(selectedRole.id)}
              >
                Delete Role
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </AdminLayout>
  );
};

export default RolesPage;
