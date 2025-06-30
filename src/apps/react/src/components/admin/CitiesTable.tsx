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
  Building
} from 'lucide-react';
import { 
  searchCitiesEndpoint,
  CityResponse
} from '@/api/homemapapi';
import { useToast } from '@/hooks/use-toast';
import RegionCityFormModal from '@/components/RegionCityFormModal';

interface CitiesTableProps {
  onDeleteConfirm: (item: CityResponse, type: 'city') => void;
}

export interface CitiesTableRef {
  refresh: () => void;
}

const CitiesTable = forwardRef<CitiesTableRef, CitiesTableProps>(({ onDeleteConfirm }, ref) => {
  const { toast } = useToast();
  
  const [cities, setCities] = useState<CityResponse[]>([]);
  const [filteredCities, setFilteredCities] = useState<CityResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  
  const [formModalOpen, setFormModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<CityResponse | null>(null);

  const fetchCities = async () => {
    try {
      setLoading(true);
      const response = await searchCitiesEndpoint({ pageNumber: 1, pageSize: 100 }, '1');
      setCities(response.items || []);
      setFilteredCities(response.items || []);
    } catch (error) {
      toast({
        title: 'שגיאה',
        description: 'טעינת הערים נכשלה',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchCities();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Expose refresh method to parent component
  useImperativeHandle(ref, () => ({
    refresh: fetchCities
  }));

  // Filter cities
  useEffect(() => {
    if (searchTerm) {
      const filtered = cities.filter(city =>
        city.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        city.description?.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredCities(filtered);
    } else {
      setFilteredCities(cities);
    }
  }, [searchTerm, cities]);

  const handleCreate = () => {
    setEditingItem(null);
    setFormModalOpen(true);
  };

  const handleEdit = (city: CityResponse) => {
    setEditingItem(city);
    setFormModalOpen(true);
  };

  const handleDelete = (city: CityResponse) => {
    onDeleteConfirm(city, 'city');
  };

  const handleFormSuccess = () => {
    fetchCities();
  };

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>ערים ({filteredCities.length})</CardTitle>
            <div className="flex items-center space-x-2 mt-4">
              <Search className="h-4 w-4 text-gray-400" />
              <Input
                placeholder="חפש ערים..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="max-w-sm"
              />
            </div>
          </div>
          <Button onClick={handleCreate}>
            <Plus className="h-4 w-4 mr-2" />
            הוסף עיר
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
                  <TableHead className="text-right">שם העיר</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCities.map((city) => (
                  <TableRow key={city.id}>
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
                          <DropdownMenuItem onClick={() => handleEdit(city)}>
                            <Edit className="h-4 w-4 mr-2" />
                            ערוך עיר
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            className="text-red-600"
                            onClick={() => handleDelete(city)}
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            מחק עיר
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="text-gray-600">
                        {city.description || 'אין תיאור'}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end">
                        <span className="font-medium">{city.name}</span>
                        <Building className="h-4 w-4 ml-2 text-gray-400" />
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
          {filteredCities.length === 0 && !loading && (
            <div className="text-center py-8">
              <p className="text-gray-500">לא נמצאו ערים</p>
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
        type="city"
        editingItem={editingItem}
        onSuccess={handleFormSuccess}
      />
    </>
  );
});

CitiesTable.displayName = 'CitiesTable';

export default CitiesTable;
