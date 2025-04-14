
import { Separator } from '@/components/ui/separator';

export const AuthSeparator = () => {
  return (
    <div className="relative my-4">
      <div className="absolute inset-0 flex items-center">
        <Separator />
      </div>
      <div className="relative flex justify-center text-xs uppercase">
        <span className="bg-background px-2 text-muted-foreground">
          Ou continue com
        </span>
      </div>
    </div>
  );
};
