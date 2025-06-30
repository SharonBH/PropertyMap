import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminLayout from '@/components/AdminLayout';
import LookupFormModal from '@/components/LookupFormModal';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
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
  Tag,
  Home
} from 'lucide-react';
import { 
  searchPropertyStatusesEndpoint,
  searchPropertyTypesEndpoint,
  deletePropertyStatusEndpoint,
  deletePropertyTypeEndpoint,
  PropertyStatusResponse,
  PropertyTypeResponse
} from '@/api/homemapapi';
import { useToast } from '@/hooks/use-toast';

const LookupsPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // Property Statuses
  const [propertyStatuses, setPropertyStatuses] = useState<PropertyStatusResponse[]>([]);
  const [filteredStatuses, setFilteredStatuses] = useState<PropertyStatusResponse[]>([]);
  const [statusesLoading, setStatusesLoading] = useState(true);
  const [statusSearchTerm, setStatusSearchTerm] = useState('');
  
  // Property Types
  const [propertyTypes, setPropertyTypes] = useState<PropertyTypeResponse[]>([]);
  const [filteredTypes, setFilteredTypes] = useState<PropertyTypeResponse[]>([]);
  const [typesLoading, setTypesLoading] = useState(true);
  const [typeSearchTerm, setTypeSearchTerm] = useState('');
    // Dialog states
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<PropertyStatusResponse | PropertyTypeResponse | null>(null);
  const [deleteType, setDeleteType] = useState<'status' | 'type'>('status');  const [formModalOpen, setFormModalOpen] = useState(false);
  const [formModalType, setFormModalType] = useState<'status' | 'type'>('status');
  const [editingItem, setEditingItem] = useState<PropertyStatusResponse | PropertyTypeResponse | null>(null);

  const fetchPropertyStatuses = async () => {
    try {
      setStatusesLoading(true);
      const response = await searchPropertyStatusesEndpoint({ pageNumber: 1, pageSize: 100 }, '1');
      setPropertyStatuses(response.items || []);
      setFilteredStatuses(response.items || []);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to fetch property statuses',
        variant: 'destructive',
      });
    } finally {
      setStatusesLoading(false);
    }
  };

  const fetchPropertyTypes = async () => {
    try {
      setTypesLoading(true);
      const response = await searchPropertyTypesEndpoint({ pageNumber: 1, pageSize: 100 }, '1');
      setPropertyTypes(response.items || []);
      setFilteredTypes(response.items || []);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to fetch property types',
        variant: 'destructive',
      });
    } finally {
      setTypesLoading(false);
    }
  };

  useEffect(() => {
    fetchPropertyStatuses();
    fetchPropertyTypes();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Filter property statuses
  useEffect(() => {
    if (statusSearchTerm) {
      const filtered = propertyStatuses.filter(status =>
        status.name?.toLowerCase().includes(statusSearchTerm.toLowerCase()) ||
        status.description?.toLowerCase().includes(statusSearchTerm.toLowerCase())
      );
      setFilteredStatuses(filtered);
    } else {
      setFilteredStatuses(propertyStatuses);
    }
  }, [statusSearchTerm, propertyStatuses]);

  // Filter property types
  useEffect(() => {
    if (typeSearchTerm) {
      const filtered = propertyTypes.filter(type =>
        type.name?.toLowerCase().includes(typeSearchTerm.toLowerCase()) ||
        type.description?.toLowerCase().includes(typeSearchTerm.toLowerCase())
      );
      setFilteredTypes(filtered);
    } else {
      setFilteredTypes(propertyTypes);
    }
  }, [typeSearchTerm, propertyTypes]);

  const handleDeleteStatus = async (statusId: string) => {
    try {
      await deletePropertyStatusEndpoint(statusId, '1');
      await fetchPropertyStatuses();
      toast({
        title: 'Success',
        description: 'Property status deleted successfully',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete property status',
        variant: 'destructive',
      });
    }
    setDeleteDialogOpen(false);
    setSelectedItem(null);
  };

  const handleDeleteType = async (typeId: string) => {
    try {
      await deletePropertyTypeEndpoint(typeId, '1');
      await fetchPropertyTypes();
      toast({
        title: 'Success',
        description: 'Property type deleted successfully',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete property type',
        variant: 'destructive',
      });
    }
    setDeleteDialogOpen(false);
    setSelectedItem(null);
  };

  const PropertyStatusesTable = () => (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">        <div>
          <CardTitle>סטטוסי נכסים ({filteredStatuses.length})</CardTitle>
          <div className="flex items-center space-x-2 mt-4">
            <Search className="h-4 w-4 text-gray-400" />
            <Input
              placeholder="חפש סטטוסים..."
              value={statusSearchTerm}
              onChange={(e) => setStatusSearchTerm(e.target.value)}
              className="max-w-sm"
            />
          </div>
        </div>        <Button onClick={() => {
          setEditingItem(null);
          setFormModalType('status');
          setFormModalOpen(true);
        }}>
          <Plus className="h-4 w-4 mr-2" />
          הוסף סטטוס
        </Button>
      </CardHeader>
      <CardContent>
        {statusesLoading ? (
          <div className="flex items-center justify-center h-32">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : (          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-right">פעולות</TableHead>
                <TableHead className="text-right">תיאור</TableHead>
                <TableHead className="text-right">שם</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredStatuses.map((status) => (
                <TableRow key={status.id}>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>פעולות</DropdownMenuLabel>
                        <DropdownMenuSeparator />                        <DropdownMenuItem 
                          onClick={() => {
                            setEditingItem(status);
                            setFormModalType('status');
                            setFormModalOpen(true);
                          }}
                        >
                          <Edit className="h-4 w-4 mr-2" />
                          ערוך סטטוס
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem 
                          className="text-red-600"
                          onClick={() => {
                            setSelectedItem(status);
                            setDeleteType('status');
                            setDeleteDialogOpen(true);
                          }}
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          מחק סטטוס
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="text-gray-600">
                      {status.description || 'אין תיאור'}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end">
                      <span className="font-medium">{status.name}</span>
                      <Tag className="h-4 w-4 ml-2 text-gray-400" />
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
          {filteredStatuses.length === 0 && !statusesLoading && (
          <div className="text-center py-8">
            <p className="text-gray-500">לא נמצאו סטטוסי נכסים</p>
          </div>
        )}
      </CardContent>
    </Card>
  );

  const PropertyTypesTable = () => (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">        <div>
          <CardTitle>סוגי נכסים ({filteredTypes.length})</CardTitle>
          <div className="flex items-center space-x-2 mt-4">
            <Search className="h-4 w-4 text-gray-400" />
            <Input
              placeholder="חפש סוגים..."
              value={typeSearchTerm}
              onChange={(e) => setTypeSearchTerm(e.target.value)}
              className="max-w-sm"
            />
          </div>
        </div>        <Button onClick={() => {
          setEditingItem(null);
          setFormModalType('type');
          setFormModalOpen(true);
        }}>
          <Plus className="h-4 w-4 mr-2" />
          הוסף סוג
        </Button>
      </CardHeader>
      <CardContent>
        {typesLoading ? (
          <div className="flex items-center justify-center h-32">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : (          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-right">פעולות</TableHead>
                <TableHead className="text-right">תיאור</TableHead>
                <TableHead className="text-right">שם</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTypes.map((type) => (
                <TableRow key={type.id}>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>פעולות</DropdownMenuLabel>
                        <DropdownMenuSeparator />                        <DropdownMenuItem 
                          onClick={() => {
                            setEditingItem(type);
                            setFormModalType('type');
                            setFormModalOpen(true);
                          }}
                        >
                          <Edit className="h-4 w-4 mr-2" />
                          ערוך סוג
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem 
                          className="text-red-600"
                          onClick={() => {
                            setSelectedItem(type);
                            setDeleteType('type');
                            setDeleteDialogOpen(true);
                          }}
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          מחק סוג
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="text-gray-600">
                      {type.description || 'אין תיאור'}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end">
                      <span className="font-medium">{type.name}</span>
                      <Home className="h-4 w-4 ml-2 text-gray-400" />
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}        {filteredTypes.length === 0 && !typesLoading && (
          <div className="text-center py-8">
            <p className="text-gray-500">לא נמצאו סוגי נכסים</p>
          </div>
        )}
      </CardContent>
    </Card>
  );

  return (
    <AdminLayout>
      <div className="space-y-6">        {/* Header */}
        <div>
          <h2 className="text-lg font-medium text-gray-900">ניהול רשימות מערכת</h2>
          <p className="text-gray-600">נהלו סטטוסי נכסים, סוגי נכסים ונתוני רשימה אחרים</p>
        </div>

        {/* Tabs for different lookup types */}
        <Tabs defaultValue="statuses" className="space-y-6">
          <TabsList>
            <TabsTrigger value="statuses">סטטוסי נכסים</TabsTrigger>
            <TabsTrigger value="types">סוגי נכסים</TabsTrigger>
          </TabsList>
          
          <TabsContent value="statuses">
            <PropertyStatusesTable />
          </TabsContent>
          
          <TabsContent value="types">
            <PropertyTypesTable />
          </TabsContent>
        </Tabs>

        {/* Delete Confirmation Dialog */}
        <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>האם אתה בטוח?</AlertDialogTitle>              <AlertDialogDescription>
                פעולה זו לא ניתנת לביטול. זה ימחק לצמיתות את {deleteType === 'status' ? 'סטטוס הנכס' : 'סוג הנכס'}
                "{selectedItem?.name}" ועלול להשפיע על נכסים קיימים.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>בטל</AlertDialogCancel>
              <AlertDialogAction                className="bg-red-600 hover:bg-red-700"
                onClick={() => {
                  if (selectedItem?.id) {
                    if (deleteType === 'status') {
                      handleDeleteStatus(selectedItem.id);
                    } else {
                      handleDeleteType(selectedItem.id);
                    }
                  }
                }}
              >
                מחק {deleteType === 'status' ? 'סטטוס' : 'סוג'}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        {/* Add Lookup Modal */}        <LookupFormModal
          open={formModalOpen}
          onOpenChange={(open) => {
            setFormModalOpen(open);
            if (!open) {
              setEditingItem(null);
            }
          }}
          type={formModalType}
          editingItem={editingItem}
          onSuccess={() => {
            if (formModalType === 'status') {
              fetchPropertyStatuses();
            } else {
              fetchPropertyTypes();
            }
          }}
        />
      </div>
    </AdminLayout>
  );
};

export default LookupsPage;
