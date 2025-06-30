import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
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
  createAgencyEndpoint, 
  updateAgencyEndpoint,
  getAgencyEndpoint,
  CreateAgencyCommand, 
  UpdateAgencyCommand,
  AgencyResponse
} from '@/api/homemapapi';
import { useToast } from '@/hooks/use-toast';

interface AgencyFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editingAgency?: AgencyResponse | null;
  onSuccess: () => void;
}

const AgencyFormModal = ({ open, onOpenChange, editingAgency, onSuccess }: AgencyFormModalProps) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    address: '',
    telephone: '',
    email: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const isEditing = !!editingAgency;

  // Populate form when editing
  useEffect(() => {
    if (editingAgency) {
      setFormData({
        name: editingAgency.name || '',
        description: editingAgency.description || '',
        address: editingAgency.address || '',
        telephone: editingAgency.telephone || '',
        email: editingAgency.email || '',
      });
    } else {
      // Reset form for new agency
      setFormData({
        name: '',
        description: '',
        address: '',
        telephone: '',
        email: '',
      });
    }
    setErrors({});
  }, [editingAgency, open]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name?.trim()) {
      newErrors.name = 'שם הסוכנות נדרש';
    }

    if (!formData.email?.trim()) {
      newErrors.email = 'אימייל נדרש';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'אנא הזן כתובת אימייל תקינה';
    }

    if (!formData.telephone?.trim()) {
      newErrors.telephone = 'מספר טלפון נדרש';
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

      if (isEditing && editingAgency?.id) {
        // Update existing agency
        const updateCommand: UpdateAgencyCommand = {
          id: editingAgency.id,
          name: formData.name,
          description: formData.description,
          address: formData.address,
          telephone: formData.telephone,
          email: formData.email,
        };
        await updateAgencyEndpoint(editingAgency.id, updateCommand, '1');
        
        toast({
          title: 'הצלחה',
          description: 'הסוכנות עודכנה בהצלחה',
        });
      } else {
        // Create new agency
        const createCommand: CreateAgencyCommand = {
          name: formData.name,
          description: formData.description,
          address: formData.address,
          telephone: formData.telephone,
          email: formData.email,
        };
        await createAgencyEndpoint(createCommand, '1');
        
        toast({
          title: 'הצלחה',
          description: 'הסוכנות נוצרה בהצלחה',
        });
      }

      onSuccess();
      onOpenChange(false);
    } catch (error) {
      toast({
        title: 'שגיאה',
        description: isEditing ? 'עדכון הסוכנות נכשל' : 'יצירת הסוכנות נכשלה',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? 'ערוך סוכנות' : 'הוסף סוכנות חדשה'}
          </DialogTitle>
          <DialogDescription>
            {isEditing 
              ? 'ערוך את פרטי הסוכנות למטה'
              : 'מלא את פרטי הסוכנות החדשה למטה'}
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Agency Name */}
          <div className="space-y-2">
            <Label htmlFor="name">
              שם הסוכנות <span className="text-red-500">*</span>
            </Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              className={errors.name ? 'border-red-500' : ''}
              disabled={loading}
              placeholder="הזן שם הסוכנות"
            />
            {errors.name && (
              <p className="text-sm text-red-500">{errors.name}</p>
            )}
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">תיאור</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              disabled={loading}
              placeholder="הזן תיאור הסוכנות (אופציונלי)"
              rows={3}
            />
          </div>

          {/* Email */}
          <div className="space-y-2">
            <Label htmlFor="email">
              אימייל <span className="text-red-500">*</span>
            </Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              className={errors.email ? 'border-red-500' : ''}
              disabled={loading}
              placeholder="agency@example.com"
            />
            {errors.email && (
              <p className="text-sm text-red-500">{errors.email}</p>
            )}
          </div>

          {/* Telephone */}
          <div className="space-y-2">
            <Label htmlFor="telephone">
              טלפון <span className="text-red-500">*</span>
            </Label>
            <Input
              id="telephone"
              value={formData.telephone}
              onChange={(e) => handleInputChange('telephone', e.target.value)}
              className={errors.telephone ? 'border-red-500' : ''}
              disabled={loading}
              placeholder="050-1234567"
            />
            {errors.telephone && (
              <p className="text-sm text-red-500">{errors.telephone}</p>
            )}
          </div>

          {/* Address */}
          <div className="space-y-2">
            <Label htmlFor="address">כתובת</Label>
            <Textarea
              id="address"
              value={formData.address}
              onChange={(e) => handleInputChange('address', e.target.value)}
              disabled={loading}
              placeholder="הזן כתובת הסוכנות (אופציונלי)"
              rows={2}
            />
          </div>

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
                  {isEditing ? 'עדכן סוכנות' : 'צור סוכנות'}
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AgencyFormModal;
