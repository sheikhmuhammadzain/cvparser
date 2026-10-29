import { NavLink, useNavigate } from 'react-router-dom';
import { Upload, FileText, Filter, BarChart3, FileStack } from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
  { to: '/upload', icon: Upload, label: 'Upload CVs' },
  { to: '/cvs', icon: FileText, label: 'CV List' },
  { to: '/filter', icon: Filter, label: 'Filter & Rank' },
  { to: '/stats', icon: BarChart3, label: 'Statistics' },
];

export function Sidebar() {
  const navigate = useNavigate();
  return (
    <aside className="w-64 border-r bg-card flex flex-col">
      <div className="p-6 border-b">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-lg bg-gradient-primary flex items-center justify-center">
            <FileStack className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 onClick={() => navigate('/')} className="text-xl cursor-pointer font-bold">CV Shortlister</h1>
            <p className="text-xs text-muted-foreground">Resume Management</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 p-4 space-y-2">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-3 px-4 py-3 rounded-lg transition-colors',
                isActive
                  ? 'bg-primary text-primary-foreground'
                  : 'hover:bg-muted text-foreground'
              )
            }
          >
            <item.icon className="h-5 w-5" />
            <span className="font-medium">{item.label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t">
        <div className="p-4 rounded-lg bg-muted">
          <p className="text-sm font-medium mb-1">Quick Stats</p>
          <p className="text-xs text-muted-foreground">
            Connected to Django API
          </p>
        </div>
      </div>
    </aside>
  );
}
