import * as React from 'react'
import {
  NavigationMenu as NavigationMenuPrimitive,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuContent,
  NavigationMenuTrigger,
} from '@radix-ui/react-navigation-menu'
import { cn } from '@/lib/utils'

const NavigationMenu = React.forwardRef<
  React.ElementRef<typeof NavigationMenuPrimitive>,
  React.ComponentPropsWithoutRef<typeof NavigationMenuPrimitive>
>(({ className, ...props }, ref) => (
  <NavigationMenuPrimitive
    ref={ref}
    className={cn('relative z-10', className)}
    {...props}
  />
))
NavigationMenu.displayName = 'NavigationMenu'

export {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuContent,
  NavigationMenuTrigger,
}
