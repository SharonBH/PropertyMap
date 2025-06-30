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
  MapPin
} from 'lucide-react';
import { 
  searchRegionsEndpoint,
  RegionResponse
} from '@/api/homemapapi';
import { useToast } from '@/hooks/use-toast';
import RegionCityFormModal from '@/components/RegionCityFormModal';

interface RegionsTableProps {
  onDeleteConfirm: (item: RegionResponse, type: 'region') => void;
}

export interface RegionsTableRef {
  refresh: () => void;
}

const RegionsTable = forwardRef<RegionsTableRef, RegionsTableProps>(({ onDeleteConfirm }, ref) => {
  const { toast } = useToast();
  
  const [regions, setRegions] = useState<RegionResponse[]>([]);
  const [filteredRegions, setFilteredRegions] = useState<RegionResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  
  const [formModalOpen, setFormModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<RegionResponse | null>(null);

  const fetchRegions = async () => {
    try {
      setLoading(true);
      const response = await searchRegionsEndpoint({ pageNumber: 1, pageSize: 100 }, '1');
      setRegions(response.items || []);
      setFilteredRegions(response.items || []);
    } catch (error) {
      toast({
        title: 'שגיאה',
        description: 'טעינת האזורים נכשלה',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchRegions();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Expose refresh method to parent component
  useImperativeHandle(ref, () => ({
    refresh: fetchRegions
  }));

  // Filter regions
  useEffect(() => {
    if (searchTerm) {
      const filtered = regions.filter(region =>
        region.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        region.description?.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredRegions(filtered);
    } else {
      setFilteredRegions(regions);
    }
  }, [searchTerm, regions]);

  const handleCreate = () => {
    setEditingItem(null);
    setFormModalOpen(true);
  };

  const handleEdit = (region: RegionResponse) => {
    setEditingItem(region);
    setFormModalOpen(true);
  };

  const handleDelete = (region: RegionResponse) => {
    onDeleteConfirm(region, 'region');
  };

  const handleFormSuccess = () => {
    fetchRegions();
  };

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>אזורים ({filteredRegions.length})</CardTitle>
            <div className="flex items-center space-x-2 mt-4">
              <Search className="h-4 w-4 text-gray-400" />
              <Input
                placeholder="חפש אזורים..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="max-w-sm"
              />
            </div>
          </div>
          <Button onClick={handleCreate}>
            <Plus className="h-4 w-4 mr-2" />
            הוסף אזור
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
                  <TableHead className="text-right">שם האזור</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredRegions.map((region) => (
                  <TableRow key={region.id}>
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
                          <DropdownMenuItem onClick={() => handleEdit(region)}>
                            <Edit className="h-4 w-4 mr-2" />
                            ערוך אזור
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            className="text-red-600"
                            onClick={() => handleDelete(region)}
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            מחק אזור
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="text-gray-600">
                        {region.description || 'אין תיאור'}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end">
                        <span className="font-medium">{region.name}</span>
                        <MapPin className="h-4 w-4 ml-2 text-gray-400" />
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
          {filteredRegions.length === 0 && !loading && (
            <div className="text-center py-8">
              <p className="text-gray-500">לא נמצאו אזורים</p>
            </div>
          )}
        </CardContent>
      </Card>

      <RegionCityFormModal
        open={formModalOpen}
        onOpenChange={(open) => {
          setFormModalOpen(open);
          if (!open) {
            setEditingItem(null);          }
        }}
        type="region"
        editingItem={editingItem}
        onSuccess={handleFormSuccess}
      />
    </>
  );
});

RegionsTable.displayName = 'RegionsTable';

export default RegionsTable;
