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
  Trash2,
  CheckCircle,
  XCircle
} from 'lucide-react';
import { 
  getTenantsEndpoint, 
  activateTenantEndpoint,
  disableTenantEndpoint,
  TenantDetail 
} from '@/api/homemapapi';
import { useToast } from '@/hooks/use-toast';

const TenantsPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [tenants, setTenants] = useState<TenantDetail[]>([]);
  const [filteredTenants, setFilteredTenants] = useState<TenantDetail[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedTenant, setSelectedTenant] = useState<TenantDetail | null>(null);

  const fetchTenants = async () => {
    try {
      setLoading(true);
      const tenantsList = await getTenantsEndpoint();
      setTenants(tenantsList);
      setFilteredTenants(tenantsList);    } catch (error) {      toast({
        title: 'שגיאה',
        description: 'טעינת הדיירים נכשלה',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTenants();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  useEffect(() => {
    if (searchTerm) {
      const filtered = tenants.filter(tenant =>
        tenant.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tenant.adminEmail?.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredTenants(filtered);
    } else {
      setFilteredTenants(tenants);
    }
  }, [searchTerm, tenants]);

  const handleToggleTenantStatus = async (tenantId: string, isActive: boolean) => {
    try {      if (isActive) {
        await disableTenantEndpoint(tenantId);        toast({
          title: 'הצלחה',
          description: 'הדייר הושבת בהצלחה',
        });      } else {
        await activateTenantEndpoint(tenantId);        toast({
          title: 'הצלחה',
          description: 'הדייר הופעל בהצלחה',
        });
      }
      await fetchTenants(); // Refresh the list
    } catch (error) {      toast({
        title: 'שגיאה',
        description: 'עדכון סטטוס הדייר נכשל',
        variant: 'destructive',
      });
    }
  };

  const getStatusBadge = (isActive: boolean) => {
    return (
      <Badge variant={isActive ? 'default' : 'secondary'}>
        {isActive ? 'פעיל' : 'לא פעיל'}
      </Badge>
    );
  };
  const isRootTenant = (tenantId: string) => {
    return tenantId === 'root';
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-2 text-gray-600">טוען דיירים...</p>
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
          <div>            <h2 className="text-lg font-medium text-gray-900">ניהול דיירים</h2>
            <p className="text-gray-600">נהל ארגונים של דיירים והגדרות שלהם</p>
          </div>
          <Button onClick={() => navigate('/admin/tenants/new')}>
            <Plus className="h-4 w-4 mr-2" />
            הוסף דייר
          </Button>
        </div>

        {/* Search and Filters */}
        <Card>
          <CardHeader>
            <CardTitle>חיפוש דיירים</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              <Search className="h-4 w-4 text-gray-400" />              <Input
                placeholder="חפש לפי שם או אימייל מנהל..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="max-w-sm"
              />
            </div>
          </CardContent>
        </Card>

        {/* Tenants Table */}
        <Card>
          <CardHeader>
            <CardTitle>דיירים ({filteredTenants.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>                <TableRow>                  <TableHead>שם</TableHead>
                  <TableHead>אימייל מנהל</TableHead>
                  <TableHead>מחרוזת חיבור</TableHead>
                  <TableHead>סטטוס</TableHead>
                  <TableHead>פעולות</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTenants.map((tenant) => (
                  <TableRow key={tenant.id}>                    <TableCell>
                      <div className="font-medium">{tenant.name}</div>
                      {isRootTenant(tenant.id || '') && (
                        <Badge variant="outline" className="mt-1">דייר ראשי</Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="text-sm text-gray-600">
                        {tenant.adminEmail || 'לא זמין'}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-gray-600 max-w-xs truncate text-xs">
                        {tenant.connectionString ? '***מוגדר***' : 'לא מוגדר'}
                      </div>
                    </TableCell>
                    <TableCell>{getStatusBadge(tenant.isActive || false)}</TableCell>
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
                            onClick={() => handleToggleTenantStatus(tenant.id!, tenant.isActive || false)}
                            disabled={isRootTenant(tenant.id || '')}
                          >
                            {tenant.isActive ? (
                              <>
                                <XCircle className="h-4 w-4 mr-2" />
                                השבת דייר
                              </>
                            ) : (
                              <>
                                <CheckCircle className="h-4 w-4 mr-2" />
                                הפעל דייר
                              </>
                            )}
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem 
                            className="text-red-600"
                            disabled={isRootTenant(tenant.id || '')}
                            onClick={() => {
                              setSelectedTenant(tenant);
                              setDeleteDialogOpen(true);
                            }}
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            מחק דייר
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            {filteredTenants.length === 0 && (
              <div className="text-center py-8">
                <p className="text-gray-500">לא נמצאו דיירים</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Delete Confirmation Dialog */}
        <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>              <AlertDialogTitle>האם אתה בטוח?</AlertDialogTitle>
              <AlertDialogDescription>
                פעולה זו לא ניתנת לביטול. זה ימחק לצמיתות את הדייר
                "{selectedTenant?.name}" ואת כל הנתונים הקשורים כולל משתמשים, תפקידים והגדרות.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>בטל</AlertDialogCancel>              <AlertDialogAction
                className="bg-red-600 hover:bg-red-700"                onClick={() => {
                  // TODO: Implement delete tenant functionality
                  toast({
                    title: 'לא מיושם',
                    description: 'פונקציונליות מחיקת הדייר עדיין לא מיושמת',
                    variant: 'destructive',
                  });
                  setDeleteDialogOpen(false);
                  setSelectedTenant(null);
                }}
              >
                מחק דייר
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </AdminLayout>
  );
};

export default TenantsPage;
