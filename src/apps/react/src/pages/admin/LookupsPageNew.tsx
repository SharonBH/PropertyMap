import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminLayout from '@/components/AdminLayout';
import PropertyStatusesTable from '@/components/admin/PropertyStatusesTable';
import PropertyTypesTable from '@/components/admin/PropertyTypesTable';
import RegionsTable from '@/components/admin/RegionsTable';
import CitiesTable from '@/components/admin/CitiesTable';
import DeleteConfirmationDialog from '@/components/admin/DeleteConfirmationDialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Tag,
  Home,
  MapPin,
  Building
} from 'lucide-react';
import { 
  deletePropertyStatusEndpoint,
  deletePropertyTypeEndpoint,
  deleteRegionEndpoint,
  deleteCityEndpoint,
  PropertyStatusResponse,
  PropertyTypeResponse,
  RegionResponse,
  CityResponse
} from '@/api/homemapapi';
import { useToast } from '@/hooks/use-toast';

const LookupsPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // Delete dialog state
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<PropertyStatusResponse | PropertyTypeResponse | RegionResponse | CityResponse | null>(null);
  const [deleteType, setDeleteType] = useState<'status' | 'type' | 'region' | 'city'>('status');

  const handleDeleteConfirm = (item: PropertyStatusResponse | PropertyTypeResponse | RegionResponse | CityResponse, type: 'status' | 'type' | 'region' | 'city') => {
    setSelectedItem(item);
    setDeleteType(type);
    setDeleteDialogOpen(true);
  };

  const executeDelete = async () => {
    if (!selectedItem?.id) return;

    try {
      switch (deleteType) {
        case 'status':
          await deletePropertyStatusEndpoint(selectedItem.id, '1');
          toast({
            title: 'הצלחה',
            description: 'סטטוס הנכס נמחק בהצלחה',
          });
          break;
        case 'type':
          await deletePropertyTypeEndpoint(selectedItem.id, '1');
          toast({
            title: 'הצלחה',
            description: 'סוג הנכס נמחק בהצלחה',
          });
          break;
        case 'region':
          await deleteRegionEndpoint(selectedItem.id, '1');
          toast({
            title: 'הצלחה',
            description: 'האזור נמחק בהצלחה',
          });
          break;
        case 'city':
          await deleteCityEndpoint(selectedItem.id, '1');
          toast({
            title: 'הצלחה',
            description: 'העיר נמחקה בהצלחה',
          });
          break;
      }
    } catch (error) {
      const itemName = {
        status: 'סטטוס הנכס',
        type: 'סוג הנכס',
        region: 'האזור',
        city: 'העיר'
      }[deleteType];
      
      toast({
        title: 'שגיאה',
        description: `מחיקת ${itemName} נכשלה`,
        variant: 'destructive',
      });
    } finally {
      setDeleteDialogOpen(false);
      setSelectedItem(null);
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h2 className="text-lg font-medium text-gray-900">ניהול רשימות נתונים</h2>
          <p className="text-gray-600">נהל סטטוסי נכסים, סוגי נכסים, אזורים וערים</p>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="statuses" className="space-y-4">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="statuses" className="flex items-center space-x-2">
              <Tag className="h-4 w-4" />
              <span>סטטוסי נכסים</span>
            </TabsTrigger>
            <TabsTrigger value="types" className="flex items-center space-x-2">
              <Home className="h-4 w-4" />
              <span>סוגי נכסים</span>
            </TabsTrigger>
            <TabsTrigger value="regions" className="flex items-center space-x-2">
              <MapPin className="h-4 w-4" />
              <span>אזורים</span>
            </TabsTrigger>
            <TabsTrigger value="cities" className="flex items-center space-x-2">
              <Building className="h-4 w-4" />
              <span>ערים</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="statuses">
            <PropertyStatusesTable onDeleteConfirm={handleDeleteConfirm} />
          </TabsContent>

          <TabsContent value="types">
            <PropertyTypesTable onDeleteConfirm={handleDeleteConfirm} />
          </TabsContent>

          <TabsContent value="regions">
            <RegionsTable onDeleteConfirm={handleDeleteConfirm} />
          </TabsContent>

          <TabsContent value="cities">
            <CitiesTable onDeleteConfirm={handleDeleteConfirm} />
          </TabsContent>
        </Tabs>

        {/* Delete Confirmation Dialog */}
        <DeleteConfirmationDialog
          open={deleteDialogOpen}
          onOpenChange={setDeleteDialogOpen}
          selectedItem={selectedItem}
          deleteType={deleteType}
          onConfirm={executeDelete}
        />
      </div>
    </AdminLayout>
  );
};

export default LookupsPage;
