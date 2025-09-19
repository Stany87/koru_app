"use client"

import { Button } from "@/components/ui/button"
import { ArrowLeft, Home, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"

interface NavigationItem {
  label: string
  icon?: React.ComponentType<any>
  onClick?: () => void
}

interface EnhancedNavigationProps {
  title: string
  subtitle?: string
  icon: React.ComponentType<any>
  iconColor?: string
  onBack: () => void
  showHomeButton?: boolean
  onHome?: () => void
  breadcrumbs?: NavigationItem[]
  className?: string
}

export default function EnhancedNavigation({
  title,
  subtitle,
  icon: Icon,
  iconColor = "text-primary",
  onBack,
  showHomeButton = false,
  onHome,
  breadcrumbs = [],
  className
}: EnhancedNavigationProps) {
  return (
    <header className={cn("glass border-b border-white/10 p-4", className)}>
      <div className="flex items-center gap-4 max-w-6xl mx-auto">
        {/* Back Button */}
        <Button 
          variant="ghost" 
          size="icon" 
          className="glass-strong hover:scale-105 transition-transform duration-200" 
          onClick={onBack}
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>

        {/* Main Title Section */}
        <div className="flex items-center gap-3 flex-1">
          <div className={cn("w-10 h-10 rounded-full glass flex items-center justify-center", 
            showHomeButton && "transition-transform duration-200 hover:scale-110"
          )}>
            <Icon className={cn("h-5 w-5", iconColor)} />
          </div>
          <div className="flex-1">
            {/* Breadcrumbs */}
            {breadcrumbs.length > 0 && (
              <div className="flex items-center gap-1 text-sm text-muted-foreground mb-1">
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-auto p-0 hover:text-primary transition-colors"
                  onClick={onHome}
                >
                  <Home className="h-3 w-3 mr-1" />
                  Home
                </Button>
                {breadcrumbs.map((item, index) => (
                  <div key={index} className="flex items-center gap-1">
                    <ChevronRight className="h-3 w-3" />
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-auto p-0 hover:text-primary transition-colors"
                      onClick={item.onClick}
                    >
                      {item.icon && <item.icon className="h-3 w-3 mr-1" />}
                      {item.label}
                    </Button>
                  </div>
                ))}
                <ChevronRight className="h-3 w-3" />
                <span className="text-primary font-medium">{title}</span>
              </div>
            )}
            
            {/* Title and Subtitle */}
            <h1 className="text-xl font-semibold">{title}</h1>
            {subtitle && (
              <p className="text-sm text-muted-foreground">{subtitle}</p>
            )}
          </div>
        </div>

        {/* Home Button (if enabled) */}
        {showHomeButton && onHome && (
          <Button
            variant="ghost"
            size="sm"
            className="glass-strong hover:scale-105 transition-transform duration-200"
            onClick={onHome}
          >
            <Home className="h-4 w-4 mr-2" />
            Home
          </Button>
        )}
      </div>
    </header>
  )
}