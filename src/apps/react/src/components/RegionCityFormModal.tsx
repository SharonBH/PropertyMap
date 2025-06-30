import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Save } from 'lucide-react';
import { 
  createRegionEndpoint, 
  createCityEndpoint,
  updateRegionEndpoint,
  updateCityEndpoint,
  searchRegionsEndpoint,
  CreateRegionCommand, 
  CreateCityCommand,
  UpdateRegionCommand,
  UpdateCityCommand,
  RegionResponse,
  CityResponse
} from '@/api/homemapapi';
import { useToast } from '@/hooks/use-toast';

interface RegionCityFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  type: 'region' | 'city';
  editingItem?: RegionResponse | CityResponse | null;
  onSuccess: () => void;
}

const RegionCityFormModal = ({ open, onOpenChange, type, editingItem, onSuccess }: RegionCityFormModalProps) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [regions, setRegions] = useState<RegionResponse[]>([]);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    regionId: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const isEditing = !!editingItem;

  // Fetch regions for city form
  const fetchRegions = async () => {
    if (type === 'city') {
      try {
        const response = await searchRegionsEndpoint({ pageNumber: 1, pageSize: 100 }, '1');
        setRegions(response.items || []);
      } catch (error) {
        console.error('Failed to fetch regions:', error);
      }
    }
  };

  // Populate form when editing
  useEffect(() => {
    if (editingItem) {
      setFormData({
        name: editingItem.name || '',
        description: editingItem.description || '',
        regionId: type === 'city' ? (editingItem as CityResponse).regionId || '' : '',
      });
    } else {
      // Reset form for new item
      setFormData({
        name: '',
        description: '',
        regionId: '',
      });
    }
    setErrors({});
  }, [editingItem, open, type]);
  useEffect(() => {
    if (type === 'city') {
      fetchRegions();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [type]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name?.trim()) {
      newErrors.name = type === 'region' ? 'שם האזור נדרש' : 'שם העיר נדרש';
    }

    if (!formData.description?.trim()) {
      newErrors.description = 'תיאור נדרש';
    }

    if (type === 'city' && !formData.regionId?.trim()) {
      newErrors.regionId = 'בחירת אזור נדרשת';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));

    // Clear error for this field when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);

      if (type === 'region') {
        if (isEditing && editingItem?.id) {
          // Update existing region
          const updateCommand: UpdateRegionCommand = {
            id: editingItem.id,
            name: formData.name,
            description: formData.description,
          };
          await updateRegionEndpoint(editingItem.id, updateCommand, '1');
          
          toast({
            title: 'הצלחה',
            description: 'האזור עודכן בהצלחה',
          });
        } else {
          // Create new region
          const createCommand: CreateRegionCommand = {
            name: formData.name,
            description: formData.description,
          };
          await createRegionEndpoint(createCommand, '1');
          
          toast({
            title: 'הצלחה',
            description: 'האזור נוצר בהצלחה',
          });
        }
      } else {
        // City operations
        if (isEditing && editingItem?.id) {
          // Update existing city
          const updateCommand: UpdateCityCommand = {
            id: editingItem.id,
            name: formData.name,
            description: formData.description,
            regionId: formData.regionId,
          };
          await updateCityEndpoint(editingItem.id, updateCommand, '1');
          
          toast({
            title: 'הצלחה',
            description: 'העיר עודכנה בהצלחה',
          });
        } else {
          // Create new city
          const createCommand: CreateCityCommand = {
            name: formData.name,
            description: formData.description,
            regionId: formData.regionId,
          };
          await createCityEndpoint(createCommand, '1');
          
          toast({
            title: 'הצלחה',
            description: 'העיר נוצרה בהצלחה',
          });
        }
      }

      onSuccess();
      onOpenChange(false);
    } catch (error) {
      toast({
        title: 'שגיאה',
        description: isEditing 
          ? (type === 'region' ? 'עדכון האזור נכשל' : 'עדכון העיר נכשל')
          : (type === 'region' ? 'יצירת האזור נכשלה' : 'יצירת העיר נכשלה'),
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const getTitle = () => {
    if (type === 'region') {
      return isEditing ? 'ערוך אזור' : 'הוסף אזור חדש';
    } else {
      return isEditing ? 'ערוך עיר' : 'הוסף עיר חדשה';
    }
  };

  const getDescription = () => {
    if (type === 'region') {
      return isEditing ? 'ערוך את פרטי האזור למטה' : 'מלא את פרטי האזור החדש למטה';
    } else {
      return isEditing ? 'ערוך את פרטי העיר למטה' : 'מלא את פרטי העיר החדשה למטה';
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{getTitle()}</DialogTitle>
          <DialogDescription>{getDescription()}</DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name */}
          <div className="space-y-2">
            <Label htmlFor="name">
              {type === 'region' ? 'שם האזור' : 'שם העיר'} <span className="text-red-500">*</span>
            </Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              className={errors.name ? 'border-red-500' : ''}
              disabled={loading}
              placeholder={type === 'region' ? 'הזן שם האזור' : 'הזן שם העיר'}
            />
            {errors.name && (
              <p className="text-sm text-red-500">{errors.name}</p>
            )}
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">
              תיאור <span className="text-red-500">*</span>
            </Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              className={errors.description ? 'border-red-500' : ''}
              disabled={loading}
              placeholder={type === 'region' ? 'הזן תיאור האזור' : 'הזן תיאור העיר'}
              rows={3}
            />
            {errors.description && (
              <p className="text-sm text-red-500">{errors.description}</p>
            )}
          </div>

          {/* Region Select for Cities */}
          {type === 'city' && (
            <div className="space-y-2">
              <Label htmlFor="regionId">
                אזור <span className="text-red-500">*</span>
              </Label>
              <Select
                value={formData.regionId}
                onValueChange={(value) => handleInputChange('regionId', value)}
                disabled={loading}
              >
                <SelectTrigger className={errors.regionId ? 'border-red-500' : ''}>
                  <SelectValue placeholder="בחר אזור" />
                </SelectTrigger>
                <SelectContent>
                  {regions.map((region) => (
                    <SelectItem key={region.id} value={region.id || ''}>
                      {region.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.regionId && (
                <p className="text-sm text-red-500">{errors.regionId}</p>
              )}
            </div>
          )}

          <DialogFooter>
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => onOpenChange(false)}
              disabled={loading}
            >
              בטל
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  {isEditing ? 'מעדכן...' : 'יוצר...'}
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  {isEditing 
                    ? (type === 'region' ? 'עדכן אזור' : 'עדכן עיר')
                    : (type === 'region' ? 'צור אזור' : 'צור עיר')
                  }
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default RegionCityFormModal;
