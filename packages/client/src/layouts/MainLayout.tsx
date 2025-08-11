import {
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenu,
  NavigationMenuList,
} from '@/components/ui/navigation-menu';
import { NavLink, Outlet } from 'react-router-dom';

const links = [
  { to: '/register', label: 'Register' },
  { to: '/login', label: 'Login' },
  { to: '/profile', label: 'Profile' },
  { to: '/', label: 'Home' },
  { to: '/game', label: 'Game' },
  { to: '/leaderboard', label: 'Leaderboard' },
  { to: '/forum', label: 'Forum' },
  { to: '/forum/topicId', label: 'ForumTopic' },
  { to: '/error/400', label: '400' },
  { to: '/error/500', label: '500' },
];

export default function MainLayout() {
  return (
    <div className='flex flex-col min-h-screen'>
      <header className='border-b px-6 py-4'>
        <NavigationMenu>
          <NavigationMenuList className='flex gap-4'>
            {links.map(({ to, label }) => (
              <NavigationMenuItem key={to}>
                <NavigationMenuLink asChild>
                  <NavLink
                    to={to}
                    className={({ isActive }) =>
                      `transition-colors hover:text-primary ${
                        isActive ? 'text-primary font-semibold' : 'text-muted-foreground'
                      }`
                    }
                  >
                    {label}
                  </NavLink>
                </NavigationMenuLink>
              </NavigationMenuItem>
            ))}
          </NavigationMenuList>
        </NavigationMenu>
      </header>
      <main className='flex-1 p-6'>
        <Outlet />
      </main>
      <footer className='border-t px-6 py-4 text-center text-sm text-muted-foreground'>© 2025 undefined team</footer>
    </div>
  );
}
