'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { cn } from '@/lib/utils';
import ModalIcon, { type ModalIconVariant } from '@/components/ui/modal-icon';

interface PremiumModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  iconVariant?: ModalIconVariant;
  showIcon?: boolean;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  className?: string;
  hideClose?: boolean;
}

const SIZE_CLASS = {
  sm: 'sm:max-w-md',
  md: 'sm:max-w-lg',
  lg: 'sm:max-w-2xl',
  xl: 'sm:max-w-4xl',
  full: 'sm:max-w-[min(96vw,72rem)]',
};

export default function PremiumModal({
  open,
  onOpenChange,
  title,
  description,
  children,
  footer,
  iconVariant,
  showIcon = false,
  size = 'md',
  className,
  hideClose,
}: PremiumModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className={cn('gap-0 overflow-hidden p-0', SIZE_CLASS[size], className)} hideClose={hideClose}>
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
        >
          <DialogHeader className={cn('border-0 px-6 pt-6 sm:px-8 sm:pt-8', showIcon && 'text-center')}>
            {showIcon && iconVariant && <ModalIcon variant={iconVariant} className="mb-2" />}
            <DialogTitle>{title}</DialogTitle>
            {description && <DialogDescription>{description}</DialogDescription>}
          </DialogHeader>

          <div className="max-h-[min(70vh,640px)] overflow-y-auto px-6 py-4 sm:px-8">{children}</div>

          {footer && (
            <DialogFooter className="border-0 bg-slate-50/60 px-6 py-5 dark:bg-white/[0.02] sm:px-8">
              {footer}
            </DialogFooter>
          )}
        </motion.div>
      </DialogContent>
    </Dialog>
  );
}
