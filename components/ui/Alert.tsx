import { AlertCircle, CheckCircle2, Info, TriangleAlert } from 'lucide-react'

type Variant = 'info' | 'success' | 'warning' | 'error'

interface AlertProps {
  variant?: Variant
  title?: string
  description?: string
  className?: string
}

const config: Record<Variant, { icon: React.ElementType; classes: string }> = {
  info: {
    icon: Info,
    classes: 'bg-blue-50 border-blue-200 text-blue-800',
  },
  success: {
    icon: CheckCircle2,
    classes: 'bg-emerald-50 border-emerald-200 text-emerald-800',
  },
  warning: {
    icon: TriangleAlert,
    classes: 'bg-amber-50 border-amber-200 text-amber-800',
  },
  error: {
    icon: AlertCircle,
    classes: 'bg-red-50 border-red-200 text-red-800',
  },
}

export function Alert({ variant = 'info', title, description, className = '' }: AlertProps) {
  const { icon: Icon, classes } = config[variant]

  return (
    <div className={`flex gap-3 rounded-xl border px-4 py-3.5 ${classes} ${className}`} role="alert">
      <Icon size={18} className="mt-0.5 flex-shrink-0" />
      <div className="flex-1 min-w-0">
        {title && <p className="font-semibold text-sm">{title}</p>}
        {description && <p className={`text-sm ${title ? 'mt-0.5 opacity-90' : ''}`}>{description}</p>}
      </div>
    </div>
  )
}
