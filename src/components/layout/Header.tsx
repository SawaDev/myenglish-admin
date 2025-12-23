import { useAuth } from '@/contexts/AuthContext';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { ArrowRightLeft } from 'lucide-react';

export function Header() {
  const { user, switchRole } = useAuth();

  const handleRoleSwitch = () => {
    switchRole(user?.role === 'admin' ? 'teacher' : 'admin');
  };

  return (
    <header className="h-16 border-b border-border bg-card px-6 flex items-center justify-between">
      <div>
        {/* Breadcrumb or page context can go here */}
      </div>
      
      <div className="flex items-center gap-4">
        {/* Demo: Role Switch Button */}
        <Button
          variant="outline"
          size="sm"
          onClick={handleRoleSwitch}
          className="gap-2"
        >
          <ArrowRightLeft className="w-4 h-4" />
          Switch to {user?.role === 'admin' ? 'Teacher' : 'Admin'}
        </Button>

        <div className="flex items-center gap-3">
          <div className="text-right">
            <p className="text-sm font-medium text-foreground">{user?.name}</p>
            <p className="text-xs text-muted-foreground capitalize">{user?.role}</p>
          </div>
          <Avatar className="w-9 h-9">
            <AvatarImage src={user?.avatar} alt={user?.name} />
            <AvatarFallback>{user?.name?.charAt(0)}</AvatarFallback>
          </Avatar>
        </div>
      </div>
    </header>
  );
}
