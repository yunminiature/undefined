import { useCallback } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth, useTheme } from '@/providers';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Trophy, MessageSquare, UserRound, Sun, Moon } from 'lucide-react';

function IconNavLink({ to, label, children }: { to: string; label: string; children: React.ReactNode }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        [
          'inline-flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors',
          'hover:text-primary',
          isActive ? 'text-primary' : 'text-muted-foreground',
        ].join(' ')
      }
    >
      {children}
      {label}
    </NavLink>
  );
}

function ProfileDropdown() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = useCallback(() => {
    logout();
    navigate('/sign-in');
  }, [navigate]);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant='ghost' size='icon' className='h-9 w-9 rounded-full p-0 hover:text-primary'>
          <Avatar className='h-9 w-9'>
            <AvatarImage src='/me.png' alt='Profile' />
            <AvatarFallback>
              <UserRound size={18} />
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align='end'>
        <DropdownMenuLabel>Account</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <NavLink to='/profile'>Profile</NavLink>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className='text-red-600 focus:text-red-600'
          onSelect={(e) => {
            e.preventDefault();
            handleLogout();
          }}
        >
          Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default function MainLayout() {
  const { theme, toggleTheme } = useTheme();
  const themeTitle = theme === 'light' ? 'dark' : 'light';
  return (
    <div className='flex min-h-screen flex-col'>
      <header className='border-b px-6 py-3'>
        <div className='mx-auto flex max-w-7xl items-center justify-between gap-4'>
          <div className='flex items-center gap-4'>
            <NavLink to='/' className='text-xl font-extrabold leading-none tracking-tight'>
              2048
            </NavLink>

            <nav className='flex items-center gap-2 pl-4'>
              <IconNavLink to='/leaderboard' label='Leaderboard'>
                <Trophy size={18} />
              </IconNavLink>
              <IconNavLink to='/forum' label='Forum'>
                <MessageSquare size={18} />
              </IconNavLink>
            </nav>
          </div>

          <div className='flex items-center gap-2'>
            <Button
              variant='ghost'
              size='icon'
              aria-label='Toggle theme'
              onClick={toggleTheme}
              title={theme === 'light' ? 'Switch to dark theme' : 'Switch to light theme'}
            >
              {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
            </Button>
            <ProfileDropdown />
          </div>
        </div>
      </header>

      <main className='flex flex-1 justify-center p-6'>
        <Outlet />
      </main>

      <footer className='border-t px-6 py-4 text-center text-sm text-muted-foreground'>© 2025 undefined team</footer>
    </div>
  );
}
