import { useState, useEffect, forwardRef, useImperativeHandle } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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
  Plus, 
  Search, 
  MoreHorizontal, 
  Edit,
  Trash2,
  Tag
} from 'lucide-react';
import { 
  searchPropertyStatusesEndpoint,
  deletePropertyStatusEndpoint,
  PropertyStatusResponse
} from '@/api/homemapapi';
import { useToast } from '@/hooks/use-toast';
import LookupFormModal from '@/components/LookupFormModal';

interface PropertyStatusesTableProps {
  onDeleteConfirm: (item: PropertyStatusResponse, type: 'status') => void;
}

export interface PropertyStatusesTableRef {
  refresh: () => void;
}

const PropertyStatusesTable = forwardRef<PropertyStatusesTableRef, PropertyStatusesTableProps>(({ onDeleteConfirm }, ref) => {
  const { toast } = useToast();
  
  const [propertyStatuses, setPropertyStatuses] = useState<PropertyStatusResponse[]>([]);
  const [filteredStatuses, setFilteredStatuses] = useState<PropertyStatusResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  
  const [formModalOpen, setFormModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<PropertyStatusResponse | null>(null);

  const fetchPropertyStatuses = async () => {
    try {
      setLoading(true);
      const response = await searchPropertyStatusesEndpoint({ pageNumber: 1, pageSize: 100 }, '1');
      setPropertyStatuses(response.items || []);
      setFilteredStatuses(response.items || []);
    } catch (error) {
      toast({
        title: 'שגיאה',
        description: 'טעינת סטטוסי הנכסים נכשלה',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };  useEffect(() => {
    fetchPropertyStatuses();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Expose refresh method to parent component
  useImperativeHandle(ref, () => ({
    refresh: fetchPropertyStatuses
  }));

  // Filter property statuses
  useEffect(() => {
    if (searchTerm) {
      const filtered = propertyStatuses.filter(status =>
        status.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        status.description?.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredStatuses(filtered);
    } else {
      setFilteredStatuses(propertyStatuses);
    }
  }, [searchTerm, propertyStatuses]);

  const handleCreate = () => {
    setEditingItem(null);
    setFormModalOpen(true);
  };

  const handleEdit = (status: PropertyStatusResponse) => {
    setEditingItem(status);
    setFormModalOpen(true);
  };

  const handleDelete = (status: PropertyStatusResponse) => {
    onDeleteConfirm(status, 'status');
  };

  const handleFormSuccess = () => {
    fetchPropertyStatuses();
  };

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>סטטוסי נכסים ({filteredStatuses.length})</CardTitle>
            <div className="flex items-center space-x-2 mt-4">
              <Search className="h-4 w-4 text-gray-400" />
              <Input
                placeholder="חפש סטטוסים..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="max-w-sm"
              />
            </div>
          </div>
          <Button onClick={handleCreate}>
            <Plus className="h-4 w-4 mr-2" />
            הוסף סטטוס
          </Button>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>פעולות</TableHead>
                  <TableHead className="text-right">תיאור</TableHead>
                  <TableHead className="text-right">שם הסטטוס</TableHead>
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
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={() => handleEdit(status)}>
                            <Edit className="h-4 w-4 mr-2" />
                            ערוך סטטוס
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            className="text-red-600"
                            onClick={() => handleDelete(status)}
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
          {filteredStatuses.length === 0 && !loading && (
            <div className="text-center py-8">
              <p className="text-gray-500">לא נמצאו סטטוסי נכסים</p>
            </div>
          )}
        </CardContent>
      </Card>

      <LookupFormModal
        open={formModalOpen}
        onOpenChange={(open) => {
          setFormModalOpen(open);
          if (!open) {
            setEditingItem(null);          }
        }}
        type="status"
        editingItem={editingItem}
        onSuccess={handleFormSuccess}
      />
    </>
  );
});

PropertyStatusesTable.displayName = 'PropertyStatusesTable';

export default PropertyStatusesTable;
