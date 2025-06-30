import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminLayout from '@/components/AdminLayout';
import NeighborhoodFormModal from '@/components/NeighborhoodFormModal';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
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
  Star
} from 'lucide-react';
import { 
  searchNeighborhoodsEndpoint,
  deleteNeighborhoodEndpoint,
  NeighborhoodResponse,
  SearchNeighborhoodsCommand
} from '@/api/homemapapi';
import { useToast } from '@/hooks/use-toast';

const NeighborhoodsPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [neighborhoods, setNeighborhoods] = useState<NeighborhoodResponse[]>([]);
  const [filteredNeighborhoods, setFilteredNeighborhoods] = useState<NeighborhoodResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  
  const [formModalOpen, setFormModalOpen] = useState(false);
  const [editingNeighborhood, setEditingNeighborhood] = useState<NeighborhoodResponse | null>(null);
  
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedNeighborhood, setSelectedNeighborhood] = useState<NeighborhoodResponse | null>(null);

  const fetchNeighborhoods = async () => {
    try {
      setLoading(true);
      const searchCommand: SearchNeighborhoodsCommand = {
        pageNumber: 1,
        pageSize: 100
      };
      const response = await searchNeighborhoodsEndpoint(searchCommand, '1');
      setNeighborhoods(response.items || []);
      setFilteredNeighborhoods(response.items || []);
    } catch (error) {
      toast({
        title: 'שגיאה',
        description: 'טעינת השכונות נכשלה',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNeighborhoods();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Filter neighborhoods
  useEffect(() => {
    if (searchTerm) {
      const filtered = neighborhoods.filter(neighborhood =>
        neighborhood.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        neighborhood.description?.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredNeighborhoods(filtered);
    } else {
      setFilteredNeighborhoods(neighborhoods);
    }
  }, [searchTerm, neighborhoods]);

  const handleCreate = () => {
    setEditingNeighborhood(null);
    setFormModalOpen(true);
  };

  const handleEdit = (neighborhood: NeighborhoodResponse) => {
    setEditingNeighborhood(neighborhood);
    setFormModalOpen(true);
  };

  const handleDelete = (neighborhood: NeighborhoodResponse) => {
    setSelectedNeighborhood(neighborhood);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!selectedNeighborhood?.id) return;

    try {
      await deleteNeighborhoodEndpoint(selectedNeighborhood.id, '1');
      await fetchNeighborhoods();
      toast({
        title: 'הצלחה',
        description: 'השכונה נמחקה בהצלחה',
      });
    } catch (error) {
      toast({
        title: 'שגיאה',
        description: 'מחיקת השכונה נכשלה',
        variant: 'destructive',
      });
    } finally {
      setDeleteDialogOpen(false);
      setSelectedNeighborhood(null);
    }
  };

  const handleFormSuccess = () => {
    fetchNeighborhoods();
  };

  const getScoreBadge = (score?: number) => {
    if (!score) return null;
    
    let variant: "default" | "secondary" | "destructive" | "outline" = "secondary";
    let color = "text-gray-600";
    
    if (score >= 8) {
      variant = "default";
      color = "text-green-600";
    } else if (score >= 6) {
      variant = "outline"; 
      color = "text-blue-600";
    } else if (score >= 4) {
      variant = "secondary";
      color = "text-yellow-600";
    } else {
      variant = "destructive";
      color = "text-red-600";
    }

    return (
      <Badge variant={variant} className={`${color} flex items-center space-x-1`}>
        <Star className="h-3 w-3" />
        <span>{score.toFixed(1)}</span>
      </Badge>
    );
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h2 className="text-lg font-medium text-gray-900">ניהול שכונות</h2>
          <p className="text-gray-600">נהל שכונות, ציונים ותמונות פנורמיות</p>
        </div>

        {/* Content */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>שכונות ({filteredNeighborhoods.length})</CardTitle>
              <div className="flex items-center space-x-2 mt-4">
                <Search className="h-4 w-4 text-gray-400" />
                <Input
                  placeholder="חפש שכונות..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="max-w-sm"
                />
              </div>
            </div>
            <Button onClick={handleCreate}>
              <Plus className="h-4 w-4 mr-2" />
              הוסף שכונה
            </Button>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              </div>
            ) : (              <Table className="rtl">                <TableHeader>
                  <TableRow>
                    <TableHead className="text-right">שם השכונה</TableHead>
                    <TableHead className="text-right">תיאור</TableHead>
                    <TableHead className="text-right">ציון</TableHead>
                    <TableHead className="text-center">אייקון</TableHead>
                    <TableHead className="text-left">פעולות</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredNeighborhoods.map((neighborhood) => (
                    <TableRow key={neighborhood.id}>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-start">
                          <MapPin className="h-4 w-4 mr-2 text-gray-400" />
                          <span className="font-medium">{neighborhood.name}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="text-gray-600">
                          {neighborhood.description || 'אין תיאור'}
                        </div>
                      </TableCell>                      <TableCell className="text-right">
                        {getScoreBadge(neighborhood.score)}
                      </TableCell>
                      <TableCell className="text-center">
                        <div className="flex justify-center">
                          <Avatar className="w-8 h-8">
                            {neighborhood.iconURL ? (
                              <AvatarImage 
                                src={neighborhood.iconURL} 
                                alt={`אייקון של ${neighborhood.name}`}
                              />
                            ) : null}
                            <AvatarFallback className="text-xs bg-gray-100">
                              <MapPin className="h-4 w-4 text-gray-400" />
                            </AvatarFallback>
                          </Avatar>
                        </div>
                      </TableCell>
                      <TableCell className="text-left">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>פעולות</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => handleEdit(neighborhood)}>
                              <Edit className="h-4 w-4 mr-2" />
                              ערוך שכונה
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              className="text-red-600"
                              onClick={() => handleDelete(neighborhood)}
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              מחק שכונה
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
            {filteredNeighborhoods.length === 0 && !loading && (
              <div className="text-center py-8">
                <p className="text-gray-500">לא נמצאו שכונות</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Delete Confirmation Dialog */}
        <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>האם אתה בטוח?</AlertDialogTitle>
              <AlertDialogDescription>
                פעולה זו לא ניתנת לביטול. זה ימחק לצמיתות את השכונה
                "{selectedNeighborhood?.name}" ועלול להשפיע על נכסים קיימים.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>בטל</AlertDialogCancel>
              <AlertDialogAction
                className="bg-red-600 hover:bg-red-700"
                onClick={handleDeleteConfirm}
              >
                מחק שכונה
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        {/* Add/Edit Neighborhood Modal */}
        <NeighborhoodFormModal
          open={formModalOpen}
          onOpenChange={(open) => {
            setFormModalOpen(open);
            if (!open) {
              setEditingNeighborhood(null);
            }
          }}
          editingNeighborhood={editingNeighborhood}
          onSuccess={handleFormSuccess}
        />
      </div>
    </AdminLayout>
  );
};

export default NeighborhoodsPage;
