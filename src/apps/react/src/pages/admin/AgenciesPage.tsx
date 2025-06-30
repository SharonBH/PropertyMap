import { useState, useEffect } from 'react';
import AdminLayout from '@/components/AdminLayout';
import AgencyFormModal from '@/components/AgencyFormModal';
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
  Trash2,
  MapPin,
  Phone,
  Mail
} from 'lucide-react';
import { 
  searchAgenciesEndpoint, 
  deleteAgencyEndpoint,
  AgencyResponse 
} from '@/api/homemapapi';
import { useToast } from '@/hooks/use-toast';

const AgenciesPage = () => {
  const { toast } = useToast();
  const [agencies, setAgencies] = useState<AgencyResponse[]>([]);
  const [filteredAgencies, setFilteredAgencies] = useState<AgencyResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedAgency, setSelectedAgency] = useState<AgencyResponse | null>(null);
  const [agencyFormModalOpen, setAgencyFormModalOpen] = useState(false);
  const [editingAgency, setEditingAgency] = useState<AgencyResponse | null>(null);

  const fetchAgencies = async () => {
    try {
      setLoading(true);
      const response = await searchAgenciesEndpoint({ pageNumber: 1, pageSize: 100 }, '1');
      setAgencies(response.items || []);
      setFilteredAgencies(response.items || []);    } catch (error) {      toast({
        title: 'שגיאה',
        description: 'טעינת הסוכנויות נכשלה',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAgencies();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  useEffect(() => {
    if (searchTerm) {
      const filtered = agencies.filter(agency =>
        agency.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        agency.address?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        agency.telephone?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        agency.email?.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredAgencies(filtered);
    } else {
      setFilteredAgencies(agencies);
    }
  }, [searchTerm, agencies]);
  const handleDeleteAgency = async (agencyId: string) => {
    try {
      await deleteAgencyEndpoint(agencyId, '1');      await fetchAgencies(); // Refresh the list
      toast({
        title: 'הצלחה',
        description: 'הסוכנות נמחקה בהצלחה',
      });
    } catch (error) {      toast({
        title: 'שגיאה',
        description: 'מחיקת הסוכנות נכשלה',
        variant: 'destructive',
      });
    }
    setDeleteDialogOpen(false);
    setSelectedAgency(null);
  };

  const handleCreateAgency = () => {
    setEditingAgency(null);
    setAgencyFormModalOpen(true);
  };

  const handleEditAgency = (agency: AgencyResponse) => {
    setEditingAgency(agency);
    setAgencyFormModalOpen(true);
  };

  const handleAgencyFormSuccess = () => {
    fetchAgencies();
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-2 text-gray-600">טוען סוכנויות...</p>
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
          <div>            <h2 className="text-lg font-medium text-gray-900">ניהול סוכנויות</h2>
            <p className="text-gray-600">נהל סוכנויות נדל"ן והמידע שלהן</p>
          </div>          <Button onClick={handleCreateAgency}>
            <Plus className="h-4 w-4 mr-2" />
            הוסף סוכנות
          </Button>
        </div>

        {/* Search and Filters */}
        <Card>
          <CardHeader>
            <CardTitle>חיפוש סוכנויות</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              <Search className="h-4 w-4 text-gray-400" />
              <Input
                placeholder="חפש לפי שם, כתובת, טלפון או אימייל..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="max-w-sm"
              />
            </div>
          </CardContent>
        </Card>

        {/* Agencies Table */}
        <Card>
          <CardHeader>
            <CardTitle>סוכנויות ({filteredAgencies.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>                  <TableHead>שם הסוכנות</TableHead>
                  <TableHead>פרטי קשר</TableHead>
                  <TableHead>כתובת</TableHead>
                  <TableHead>סטטוס</TableHead>
                  <TableHead>פעולות</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAgencies.map((agency) => (
                  <TableRow key={agency.id}>
                    <TableCell>
                      <div className="font-medium">{agency.name}</div>
                      {agency.description && (
                        <div className="text-sm text-gray-500 mt-1">
                          {agency.description}
                        </div>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        {agency.email && (
                          <div className="flex items-center text-sm">
                            <Mail className="h-3 w-3 mr-1 text-gray-400" />
                            {agency.email}
                          </div>
                        )}                        {agency.telephone && (
                          <div className="flex items-center text-sm">
                            <Phone className="h-3 w-3 mr-1 text-gray-400" />
                            {agency.telephone}
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-start">
                        <MapPin className="h-3 w-3 mr-1 text-gray-400 mt-0.5 flex-shrink-0" />
                        <div className="text-sm text-gray-600 max-w-xs">
                          {agency.address || 'לא סופקה כתובת'}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="default">פעיל</Badge>
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">                          <DropdownMenuLabel>פעולות</DropdownMenuLabel>
                          <DropdownMenuSeparator />                          <DropdownMenuItem 
                            onClick={() => handleEditAgency(agency)}
                          >
                            <Edit className="h-4 w-4 mr-2" />
                            ערוך סוכנות
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem 
                            className="text-red-600"
                            onClick={() => {
                              setSelectedAgency(agency);
                              setDeleteDialogOpen(true);
                            }}
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            מחק סוכנות
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            {filteredAgencies.length === 0 && (
              <div className="text-center py-8">
                <p className="text-gray-500">לא נמצאו סוכנויות</p>
              </div>
            )}
          </CardContent>
        </Card>        {/* Delete Confirmation Dialog */}
        <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>              <AlertDialogTitle>האם אתה בטוח?</AlertDialogTitle>
              <AlertDialogDescription>
                פעולה זו לא ניתנת לביטול. זה ימחק לצמיתות את הסוכנות
                "{selectedAgency?.name}" ואת כל הנתונים הקשורים.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>              <AlertDialogCancel>בטל</AlertDialogCancel>
              <AlertDialogAction
                className="bg-red-600 hover:bg-red-700"
                onClick={() => selectedAgency?.id && handleDeleteAgency(selectedAgency.id)}
              >
                מחק סוכנות
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        {/* Agency Form Modal */}
        <AgencyFormModal
          open={agencyFormModalOpen}
          onOpenChange={setAgencyFormModalOpen}
          editingAgency={editingAgency}
          onSuccess={handleAgencyFormSuccess}
        />
      </div>
    </AdminLayout>
  );
};

export default AgenciesPage;
