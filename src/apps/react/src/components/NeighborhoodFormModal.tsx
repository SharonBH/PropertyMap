import { useState, useEffect } from 'react';
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Upload, X } from 'lucide-react';
import { 
  createNeighborhoodEndpoint,
  updateNeighborhoodEndpoint,
  searchCitiesEndpoint,
  fileUpload,
  NeighborhoodResponse,
  CreateNeighborhoodCommand,
  UpdateNeighborhoodCommand,
  CityResponse
} from '@/api/homemapapi';
import { useToast } from '@/hooks/use-toast';

interface NeighborhoodFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editingNeighborhood: NeighborhoodResponse | null;
  onSuccess: () => void;
}

const NeighborhoodFormModal = ({ 
  open, 
  onOpenChange, 
  editingNeighborhood, 
  onSuccess 
}: NeighborhoodFormModalProps) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [cities, setCities] = useState<CityResponse[]>([]);
  const [citiesLoading, setCitiesLoading] = useState(false);
    // Image upload states
  const [sphereImageFile, setSphereImageFile] = useState<File | null>(null);
  const [iconImageFile, setIconImageFile] = useState<File | null>(null);
  const [spherePreviewUrl, setSpherePreviewUrl] = useState<string>('');
  const [iconPreviewUrl, setIconPreviewUrl] = useState<string>('');
  const [uploadingSphere, setUploadingSphere] = useState(false);
  const [uploadingIcon, setUploadingIcon] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    cityId: '',
    sphereImgURL: '',
    iconURL: '',
    score: ''
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});

  const allowedExtensions = ['.jpeg', '.jpg', '.png'];
  // Handle image file selection
  const handleSphereImageChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      const ext = '.' + file.name.split('.').pop()?.toLowerCase();
      if (!allowedExtensions.includes(ext)) {
        toast({
          title: 'שגיאה',
          description: 'רק קבצי תמונה מסוג JPG, JPEG או PNG נתמכים',
          variant: 'destructive',
        });
        return;
      }
      setSphereImageFile(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setSpherePreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
      
      // Upload the image
      await uploadSphereImage(file);
    }
  };

  const handleIconImageChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      const ext = '.' + file.name.split('.').pop()?.toLowerCase();
      if (!allowedExtensions.includes(ext)) {
        toast({
          title: 'שגיאה',
          description: 'רק קבצי תמונה מסוג JPG, JPEG או PNG נתמכים',
          variant: 'destructive',
        });
        return;
      }
      setIconImageFile(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setIconPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
      
      // Upload the image
      await uploadIconImage(file);
    }
  };

  // Upload sphere image to server
  const uploadSphereImage = async (file: File) => {
    try {
      setUploadingSphere(true);
      
      const formData = new FormData();
      formData.append("file", file);
      formData.append("subfolder", "neighborhoods/spheres");
      
      const response = await fileUpload("1", { data: formData }) as unknown as { url?: string };
      
      if (response && typeof response.url === "string" && response.url.length > 0) {
        setFormData(prev => ({ ...prev, sphereImgURL: response.url }));
        toast({
          title: "הצלחה",
          description: "התמונה הפנורמית הועלתה בהצלחה",
        });
      } else {
        toast({
          title: 'שגיאה',
          description: 'העלאת התמונה הפנורמית נכשלה',
          variant: 'destructive',
        });
      }
    } catch (error) {
      toast({
        title: 'שגיאה',
        description: 'העלאת התמונה הפנורמית נכשלה',
        variant: 'destructive',
      });
    } finally {
      setUploadingSphere(false);
    }
  };

  // Upload icon image to server
  const uploadIconImage = async (file: File) => {
    try {
      setUploadingIcon(true);
      
      const formData = new FormData();
      formData.append("file", file);
      formData.append("subfolder", "neighborhoods/icons");
      
      const response = await fileUpload("1", { data: formData }) as unknown as { url?: string };
      
      if (response && typeof response.url === "string" && response.url.length > 0) {
        setFormData(prev => ({ ...prev, iconURL: response.url }));
        toast({
          title: "הצלחה",
          description: "האייקון הועלה בהצלחה",
        });
      } else {
        toast({
          title: 'שגיאה',
          description: 'העלאת האייקון נכשלה',
          variant: 'destructive',
        });
      }
    } catch (error) {
      toast({
        title: 'שגיאה',
        description: 'העלאת האייקון נכשלה',
        variant: 'destructive',
      });
    } finally {
      setUploadingIcon(false);
    }
  };
  const handleRemoveSphereImage = () => {
    setSphereImageFile(null);
    setSpherePreviewUrl('');
    setFormData(prev => ({ ...prev, sphereImgURL: '' }));
  };

  const handleRemoveIconImage = () => {
    setIconImageFile(null);
    setIconPreviewUrl('');
    setFormData(prev => ({ ...prev, iconURL: '' }));  };

  // Fetch cities when modal opens
  useEffect(() => {
    if (open) {
      fetchCities();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);
  // Reset form when modal opens/closes or editing item changes
  useEffect(() => {
    if (open) {
      if (editingNeighborhood) {
        setFormData({
          name: editingNeighborhood.name || '',
          description: editingNeighborhood.description || '',
          cityId: editingNeighborhood.cityId || '',
          sphereImgURL: editingNeighborhood.sphereImgURL || '',
          iconURL: editingNeighborhood.iconURL || '',
          score: editingNeighborhood.score?.toString() || ''
        });
        
        // Set preview URLs from existing data
        setSpherePreviewUrl(editingNeighborhood.sphereImgURL || '');
        setIconPreviewUrl(editingNeighborhood.iconURL || '');
      } else {
        setFormData({
          name: '',
          description: '',
          cityId: '',
          sphereImgURL: '',
          iconURL: '',
          score: ''
        });
        
        // Reset image states
        setSpherePreviewUrl('');
        setIconPreviewUrl('');
      }
        // Reset file states
      setSphereImageFile(null);
      setIconImageFile(null);
      setUploadingSphere(false);
      setUploadingIcon(false);
      setErrors({});
    }
  }, [open, editingNeighborhood]);

  const fetchCities = async () => {
    try {
      setCitiesLoading(true);
      const response = await searchCitiesEndpoint({ pageNumber: 1, pageSize: 100 }, '1');
      setCities(response.items || []);
    } catch (error) {
      toast({
        title: 'שגיאה',
        description: 'טעינת הערים נכשלה',
        variant: 'destructive',
      });
    } finally {
      setCitiesLoading(false);
    }
  };
  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name?.trim()) {
      newErrors.name = 'שם השכונה נדרש';
    }

    if (!formData.cityId) {
      newErrors.cityId = 'יש לבחור עיר';
    }

    if (formData.score && (isNaN(Number(formData.score)) || Number(formData.score) < 0 || Number(formData.score) > 10)) {
      newErrors.score = 'הציון חייב להיות מספר בין 0 ל-10';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: keyof typeof formData, value: string) => {
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
  };  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);
      
      if (editingNeighborhood) {
        // Update existing neighborhood
        const updateCommand: UpdateNeighborhoodCommand = {
          id: editingNeighborhood.id || '',
          name: formData.name,
          description: formData.description || null,
          cityId: formData.cityId || null,
          sphereImgURL: formData.sphereImgURL || null,
          iconURL: formData.iconURL || null,
          score: formData.score ? Number(formData.score) : null
        };
        
        await updateNeighborhoodEndpoint(editingNeighborhood.id || '', updateCommand, '1');
        
        toast({
          title: 'הצלחה',
          description: 'השכונה עודכנה בהצלחה',
        });
      } else {
        // Create new neighborhood
        const createCommand: CreateNeighborhoodCommand = {
          name: formData.name,
          description: formData.description || null,
          cityId: formData.cityId,
          sphereImgURL: formData.sphereImgURL || null,
          iconURL: formData.iconURL || null,
          score: formData.score ? Number(formData.score) : undefined
        };
        
        await createNeighborhoodEndpoint(createCommand, '1');
        
        toast({
          title: 'הצלחה',
          description: 'השכונה נוצרה בהצלחה',
        });
      }

      onSuccess();
      onOpenChange(false);
    } catch (error) {
      toast({
        title: 'שגיאה',
        description: editingNeighborhood ? 'עדכון השכונה נכשל' : 'יצירת השכונה נכשלה',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {editingNeighborhood ? 'ערוך שכונה' : 'הוסף שכונה חדשה'}
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name */}
          <div className="space-y-2">
            <Label htmlFor="name">שם השכונה *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              placeholder="הזן שם השכונה"
              className={errors.name ? 'border-red-500' : ''}
            />
            {errors.name && (
              <p className="text-sm text-red-600">{errors.name}</p>
            )}
          </div>

          {/* City */}
          <div className="space-y-2">
            <Label htmlFor="cityId">עיר *</Label>
            <Select
              value={formData.cityId}
              onValueChange={(value) => handleInputChange('cityId', value)}
            >
              <SelectTrigger className={errors.cityId ? 'border-red-500' : ''}>
                <SelectValue placeholder={citiesLoading ? "טוען ערים..." : "בחר עיר"} />
              </SelectTrigger>
              <SelectContent>
                {cities.map((city) => (
                  <SelectItem key={city.id} value={city.id || ''}>
                    {city.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.cityId && (
              <p className="text-sm text-red-600">{errors.cityId}</p>
            )}
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">תיאור</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              placeholder="הזן תיאור השכונה"
              rows={3}
            />
          </div>

          {/* Score */}
          <div className="space-y-2">
            <Label htmlFor="score">ציון (0-10)</Label>
            <Input
              id="score"
              type="number"
              min="0"
              max="10"
              step="0.1"
              value={formData.score}
              onChange={(e) => handleInputChange('score', e.target.value)}
              placeholder="הזן ציון לשכונה"
              className={errors.score ? 'border-red-500' : ''}
            />
            {errors.score && (
              <p className="text-sm text-red-600">{errors.score}</p>
            )}
          </div>          {/* Sphere Image Upload */}
          <div className="space-y-2">
            <Label>תמונה פנורמית</Label>
            <div className="flex flex-col items-center space-y-3">
              {spherePreviewUrl && (
                <div className="relative">
                  <img 
                    src={spherePreviewUrl} 
                    alt="תמונה פנורמית" 
                    className="w-full h-32 object-cover rounded-md border"
                  />
                  <div className="absolute bottom-1 left-1 bg-black bg-opacity-70 text-white text-xs px-2 py-1 rounded">
                    {sphereImageFile ? 'הועלה זה עתה' : 'תמונה קיימת'}
                  </div>
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    className="absolute top-1 right-1"
                    onClick={handleRemoveSphereImage}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              )}<label htmlFor="sphere-image" className="cursor-pointer w-full">
                <div className="border-2 border-dashed border-gray-300 rounded-md p-4 text-center hover:border-gray-400 transition">
                  {uploadingSphere ? (
                    <>
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto mb-2"></div>
                      <p className="text-sm text-gray-600">מעלה תמונה פנורמית...</p>
                    </>                  ) : (
                    <>
                      <Upload className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                      <p className="text-sm text-gray-600">
                        {spherePreviewUrl ? 'לחץ להחלפת התמונה הפנורמית' : 'לחץ להעלות תמונה פנורמית'}
                      </p>
                    </>
                  )}
                </div>
                <input
                  id="sphere-image"
                  type="file"
                  accept="image/*"
                  onChange={handleSphereImageChange}
                  className="hidden"
                  disabled={uploadingSphere}
                />
              </label>
            </div>
          </div>          {/* Icon Image Upload */}
          <div className="space-y-2">
            <Label>אייקון שכונה</Label>
            <div className="flex flex-col items-center space-y-3">
              {iconPreviewUrl && (
                <div className="relative">
                  <Avatar className="w-16 h-16">
                    <AvatarImage src={iconPreviewUrl} alt="אייקון שכונה" />
                    <AvatarFallback>אייקון</AvatarFallback>
                  </Avatar>
                  <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1 bg-black bg-opacity-70 text-white text-xs px-2 py-1 rounded whitespace-nowrap">
                    {iconImageFile ? 'הועלה זה עתה' : 'אייקון קיים'}
                  </div>
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    className="absolute -top-1 -right-1"
                    onClick={handleRemoveIconImage}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              )}<label htmlFor="icon-image" className="cursor-pointer w-full">
                <div className="border-2 border-dashed border-gray-300 rounded-md p-4 text-center hover:border-gray-400 transition">
                  {uploadingIcon ? (
                    <>
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto mb-2"></div>
                      <p className="text-sm text-gray-600">מעלה אייקון...</p>
                    </>                  ) : (
                    <>
                      <Upload className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                      <p className="text-sm text-gray-600">
                        {iconPreviewUrl ? 'לחץ להחלפת האייקון' : 'לחץ להעלות אייקון'}
                      </p>
                    </>
                  )}
                </div>
                <input
                  id="icon-image"
                  type="file"
                  accept="image/*"
                  onChange={handleIconImageChange}
                  className="hidden"
                  disabled={uploadingIcon}
                />
              </label>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex justify-end space-x-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={loading}
            >
              בטל
            </Button>            <Button type="submit" disabled={loading || uploadingSphere || uploadingIcon}>
              {loading ? 'שומר...' : editingNeighborhood ? 'עדכן שכונה' : 'צור שכונה'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default NeighborhoodFormModal;
