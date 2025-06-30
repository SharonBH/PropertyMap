import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
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
  UserCheck,
  UserX
} from 'lucide-react';
import { getUsersListEndpoint, toggleUserStatusEndpoint, deleteUserEndpoint, UserDetail } from '@/api/homemapapi';
import { useToast } from '@/hooks/use-toast';

const UsersPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [users, setUsers] = useState<UserDetail[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<UserDetail[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserDetail | null>(null);
  const fetchUsers = async () => {
    try {
      setLoading(true);
      const usersList = await getUsersListEndpoint();
      setUsers(usersList);
      setFilteredUsers(usersList);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to fetch users',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchUsers();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const filtered = users.filter(user => 
      `${user.firstName} ${user.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.userName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.phoneNumber?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredUsers(filtered);
  }, [users, searchTerm]);
  const handleToggleUserStatus = async (userId: string, currentStatus: boolean) => {
    try {
      await toggleUserStatusEndpoint(userId, { activateUser: !currentStatus });
      await fetchUsers(); // Refresh the list
      toast({
        title: 'Success',
        description: `User ${!currentStatus ? 'activated' : 'deactivated'} successfully`,
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update user status',
        variant: 'destructive',
      });
    }
  };

  const handleDeleteUser = async () => {
    if (!selectedUser?.id) return;

    try {
      await deleteUserEndpoint(selectedUser.id);
      await fetchUsers(); // Refresh the list
      toast({
        title: 'Success',
        description: 'User deleted successfully',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete user',
        variant: 'destructive',
      });
    } finally {
      setDeleteDialogOpen(false);
      setSelectedUser(null);
    }
  };
  const getStatusBadge = (isActive: boolean) => {
    return (
      <Badge variant={isActive ? 'default' : 'secondary'}>
        {isActive ? 'פעיל' : 'לא פעיל'}
      </Badge>
    );
  };

  const getEmailConfirmedBadge = (emailConfirmed: boolean) => {
    return (
      <Badge variant={emailConfirmed ? 'default' : 'outline'}>
        {emailConfirmed ? 'מאומת' : 'לא מאומת'}
      </Badge>
    );
  };
  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-2 text-gray-600">טוען משתמשים...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-lg font-medium text-gray-900">ניהול משתמשים</h2>
            <p className="text-gray-600">נהלו חשבונות משתמשים והרשאות</p>
          </div>
          <Button onClick={() => navigate('/admin/users/new')}>
            <Plus className="h-4 w-4 mr-2" />
            הוסף משתמש
          </Button>
        </div>        {/* Search and Filters */}
        <Card>
          <CardHeader>
            <CardTitle>חיפוש משתמשים</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              <Search className="h-4 w-4 text-gray-400" />
              <Input
                placeholder="חפש לפי שם, אימייל או שם משתמש..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="max-w-sm"
              />
            </div>
          </CardContent>
        </Card>        {/* Users Table */}
        <Card>
          <CardHeader>
            <CardTitle>משתמשים ({filteredUsers.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>שם</TableHead>
                  <TableHead>אימייל</TableHead>
                  <TableHead>שם משתמש</TableHead>
                  <TableHead>טלפון</TableHead>
                  <TableHead>סטטוס</TableHead>
                  <TableHead>סטטוס אימייל</TableHead>
                  <TableHead>פעולות</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">
                          {user.firstName && user.lastName 
                            ? `${user.firstName} ${user.lastName}`
                            : user.userName
                          }
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>{user.userName}</TableCell>
                    <TableCell>{user.phoneNumber || 'לא זמין'}</TableCell>
                    <TableCell>{getStatusBadge(user.isActive || false)}</TableCell>
                    <TableCell>{getEmailConfirmedBadge(user.emailConfirmed || false)}</TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>פעולות</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem 
                            onClick={() => navigate(`/admin/users/${user.id}/edit`)}
                          >
                            <Edit className="h-4 w-4 mr-2" />
                            ערוך משתמש
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            onClick={() => navigate(`/admin/users/${user.id}/roles`)}
                          >
                            <Shield className="h-4 w-4 mr-2" />
                            נהל תפקידים
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem 
                            onClick={() => handleToggleUserStatus(user.id!, user.isActive || false)}
                          >
                            {user.isActive ? (
                              <>
                                <UserX className="h-4 w-4 mr-2" />
                                השבת
                              </>
                            ) : (
                              <>
                                <UserCheck className="h-4 w-4 mr-2" />
                                הפעל
                              </>
                            )}
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />                          <DropdownMenuItem 
                            className="text-red-600"
                            onClick={() => {
                              setSelectedUser(user);
                              setDeleteDialogOpen(true);
                            }}
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            מחק משתמש
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>            {filteredUsers.length === 0 && (
              <div className="text-center py-8">
                <p className="text-gray-500">לא נמצאו משתמשים</p>
              </div>
            )}
          </CardContent>
        </Card>        {/* Delete Confirmation Dialog */}
        <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <AlertDialogContent>            <AlertDialogHeader>
              <AlertDialogTitle>האם אתה בטוח?</AlertDialogTitle>
              <AlertDialogDescription>
                פעולה זו לא ניתנת לביטול. היא תמחק לצמיתות את המשתמש
                "{selectedUser?.firstName} {selectedUser?.lastName}" ואת כל הנתונים הקשורים אליו.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>ביטול</AlertDialogCancel>
              <AlertDialogAction
                className="bg-red-600 hover:bg-red-700"
                onClick={handleDeleteUser}
              >
                מחק משתמש
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </AdminLayout>
  );
};

export default UsersPage;
