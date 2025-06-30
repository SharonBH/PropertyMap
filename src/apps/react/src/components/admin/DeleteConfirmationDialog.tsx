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
  PropertyStatusResponse,
  PropertyTypeResponse,
  RegionResponse,
  CityResponse
} from '@/api/homemapapi';

interface DeleteConfirmationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedItem: PropertyStatusResponse | PropertyTypeResponse | RegionResponse | CityResponse | null;
  deleteType: 'status' | 'type' | 'region' | 'city';
  onConfirm: () => void;
}

const DeleteConfirmationDialog = ({ 
  open, 
  onOpenChange, 
  selectedItem, 
  deleteType, 
  onConfirm 
}: DeleteConfirmationDialogProps) => {
  const getItemTypeName = () => {
    switch (deleteType) {
      case 'status': return 'סטטוס הנכס';
      case 'type': return 'סוג הנכס';
      case 'region': return 'האזור';
      case 'city': return 'העיר';
      default: return '';
    }
  };

  const getDeleteButtonText = () => {
    switch (deleteType) {
      case 'status': return 'סטטוס';
      case 'type': return 'סוג';
      case 'region': return 'אזור';
      case 'city': return 'עיר';
      default: return '';
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>האם אתה בטוח?</AlertDialogTitle>
          <AlertDialogDescription>
            פעולה זו לא ניתנת לביטול. זה ימחק לצמיתות את{' '}
            {getItemTypeName()}
            {' "'}{selectedItem?.name}{'" ועלול להשפיע על נכסים קיימים.'}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>בטל</AlertDialogCancel>
          <AlertDialogAction
            className="bg-red-600 hover:bg-red-700"
            onClick={onConfirm}
          >
            מחק {getDeleteButtonText()}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteConfirmationDialog;
