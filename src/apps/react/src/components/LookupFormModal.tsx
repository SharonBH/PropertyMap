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
  createPropertyStatusEndpoint, 
  createPropertyTypeEndpoint,
  updatePropertyStatusEndpoint,
  updatePropertyTypeEndpoint,
  CreatePropertyStatusCommand, 
  CreatePropertyTypeCommand,
  UpdatePropertyStatusCommand,
  UpdatePropertyTypeCommand,
  PropertyStatusResponse,
  PropertyTypeResponse
} from '@/api/homemapapi';
import { useToast } from '@/hooks/use-toast';

interface LookupFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  type: 'status' | 'type';
  editingItem?: PropertyStatusResponse | PropertyTypeResponse | null;
  onSuccess: () => void;
}

const LookupFormModal = ({ open, onOpenChange, type, editingItem, onSuccess }: LookupFormModalProps) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const isEditing = !!editingItem;

  // Populate form when editing
  useEffect(() => {
    if (editingItem) {
      setFormData({
        name: editingItem.name || '',
        description: editingItem.description || '',
      });
    } else {
      setFormData({ name: '', description: '' });
    }
    setErrors({});
  }, [editingItem, open]);
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name?.trim()) {
      newErrors.name = `${type === 'status' ? 'שם הסטטוס' : 'שם הסוג'} הוא שדה חובה`;
    }

    if (!formData.description?.trim()) {
      newErrors.description = `${type === 'status' ? 'תיאור הסטטוס' : 'תיאור הסוג'} הוא שדה חובה`;
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
    }    try {
      setLoading(true);      if (isEditing && editingItem?.id) {
        // Update existing item
        if (type === 'status') {
          const command: UpdatePropertyStatusCommand = {
            id: editingItem.id,
            name: formData.name,
            description: formData.description,
          };
          await updatePropertyStatusEndpoint(editingItem.id, command);
        } else {
          const command: UpdatePropertyTypeCommand = {
            id: editingItem.id,
            name: formData.name,
            description: formData.description,
          };
          await updatePropertyTypeEndpoint(editingItem.id, command);
        }
        
        toast({
          title: 'הצלחת!',
          description: `סוג נכס עודכן בהצלחה`,
        });
      } else {        // Create new item
        if (type === 'status') {
          const command: CreatePropertyStatusCommand = {
            name: formData.name,
            description: formData.description,
          };
          await createPropertyStatusEndpoint(command);
        } else {
          const command: CreatePropertyTypeCommand = {
            name: formData.name,
            description: formData.description,
          };
          await createPropertyTypeEndpoint(command);
        }
        
        toast({
          title: 'הצלחת',
          description: `סוג נכס נוצר בהצלחה`,
        });
      }

      // Reset form
      setFormData({ name: '', description: '' });
      setErrors({});
      onOpenChange(false);
      onSuccess();
    } catch (error) {
      toast({        title: 'תקלה',
        description: `העדכון נכשל, נסה שוב מאוחר יותר`,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData({ name: '', description: '' });
    setErrors({});
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]" dir="rtl">        <DialogHeader>
          <DialogTitle>
            {isEditing ? 'ערוך' : 'הוסף'} {type === 'status' ? 'סטטוס נכס' : 'סוג נכס'} {isEditing ? '' : 'חדש'}
          </DialogTitle>
          <DialogDescription>
            {isEditing ? 'ערוך את' : 'צור'} {type === 'status' ? 'סטטוס הנכס' : 'סוג הנכס'} {isEditing ? 'הקיים' : 'החדש שיכול לשמש בעת ניהול נכסים'}.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name */}
          <div className="space-y-2">            <Label htmlFor="name">
              שם <span className="text-red-500">*</span>
            </Label>
            <Input
              id="name"
              type="text"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              className={errors.name ? 'border-red-500' : ''}
              disabled={loading}
              placeholder={`הכנס שם ${type === 'status' ? 'הסטטוס' : 'הסוג'}`}
            />
            {errors.name && (
              <p className="text-sm text-red-500">{errors.name}</p>
            )}
          </div>          {/* Description */}
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
              placeholder={`הכנס תיאור ${type === 'status' ? 'הסטטוס' : 'הסוג'}`}
              rows={3}
            />
            {errors.description && (
              <p className="text-sm text-red-500">{errors.description}</p>
            )}
          </div>

          <DialogFooter>            <Button
              type="button"
              variant="outline"
              onClick={handleCancel}
              disabled={loading}
            >
              בטל
            </Button>            <Button type="submit" disabled={loading}>
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  {isEditing ? 'מעדכן...' : 'יוצר...'}
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  {isEditing ? 'עדכן' : 'צור'} {type === 'status' ? 'סטטוס' : 'סוג'}
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default LookupFormModal;
