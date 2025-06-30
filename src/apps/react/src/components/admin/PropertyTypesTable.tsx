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
  Home
} from 'lucide-react';
import { 
  searchPropertyTypesEndpoint,
  PropertyTypeResponse
} from '@/api/homemapapi';
import { useToast } from '@/hooks/use-toast';
import LookupFormModal from '@/components/LookupFormModal';

interface PropertyTypesTableProps {
  onDeleteConfirm: (item: PropertyTypeResponse, type: 'type') => void;
}

export interface PropertyTypesTableRef {
  refresh: () => void;
}

const PropertyTypesTable = forwardRef<PropertyTypesTableRef, PropertyTypesTableProps>(({ onDeleteConfirm }, ref) => {
  const { toast } = useToast();
  
  const [propertyTypes, setPropertyTypes] = useState<PropertyTypeResponse[]>([]);
  const [filteredTypes, setFilteredTypes] = useState<PropertyTypeResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  
  const [formModalOpen, setFormModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<PropertyTypeResponse | null>(null);

  const fetchPropertyTypes = async () => {
    try {
      setLoading(true);
      const response = await searchPropertyTypesEndpoint({ pageNumber: 1, pageSize: 100 }, '1');
      setPropertyTypes(response.items || []);
      setFilteredTypes(response.items || []);
    } catch (error) {
      toast({
        title: 'שגיאה',
        description: 'טעינת סוגי הנכסים נכשלה',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchPropertyTypes();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Expose refresh method to parent component
  useImperativeHandle(ref, () => ({
    refresh: fetchPropertyTypes
  }));

  // Filter property types
  useEffect(() => {
    if (searchTerm) {
      const filtered = propertyTypes.filter(type =>
        type.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        type.description?.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredTypes(filtered);
    } else {
      setFilteredTypes(propertyTypes);
    }
  }, [searchTerm, propertyTypes]);

  const handleCreate = () => {
    setEditingItem(null);
    setFormModalOpen(true);
  };

  const handleEdit = (type: PropertyTypeResponse) => {
    setEditingItem(type);
    setFormModalOpen(true);
  };

  const handleDelete = (type: PropertyTypeResponse) => {
    onDeleteConfirm(type, 'type');
  };

  const handleFormSuccess = () => {
    fetchPropertyTypes();
  };

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>סוגי נכסים ({filteredTypes.length})</CardTitle>
            <div className="flex items-center space-x-2 mt-4">
              <Search className="h-4 w-4 text-gray-400" />
              <Input
                placeholder="חפש סוגי נכסים..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="max-w-sm"
              />
            </div>
          </div>
          <Button onClick={handleCreate}>
            <Plus className="h-4 w-4 mr-2" />
            הוסף סוג נכס
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
                  <TableHead className="text-right">שם סוג הנכס</TableHead>
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
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={() => handleEdit(type)}>
                            <Edit className="h-4 w-4 mr-2" />
                            ערוך סוג נכס
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            className="text-red-600"
                            onClick={() => handleDelete(type)}
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            מחק סוג נכס
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
          )}
          {filteredTypes.length === 0 && !loading && (
            <div className="text-center py-8">
              <p className="text-gray-500">לא נמצאו סוגי נכסים</p>
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
        type="type"
        editingItem={editingItem}
        onSuccess={handleFormSuccess}
      />
    </>
  );
});

PropertyTypesTable.displayName = 'PropertyTypesTable';

export default PropertyTypesTable;
