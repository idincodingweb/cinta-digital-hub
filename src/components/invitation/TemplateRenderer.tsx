import React from 'react';

interface TemplateRendererProps {
  templateId: number;
  brideName: string;
  groomName: string;
  children: React.ReactNode;
}

const TemplateRenderer = ({ templateId, brideName, groomName, children }: TemplateRendererProps) => {
  const getTemplateStyles = () => {
    switch (templateId) {
      case 1: // Klasik
        return {
          background: 'bg-gradient-to-b from-rose-50 to-pink-100',
          textColor: 'text-rose-900',
          accent: 'text-rose-600'
        };
      case 2: // Modern
        return {
          background: 'bg-gradient-to-b from-slate-50 to-gray-100',
          textColor: 'text-slate-900',
          accent: 'text-slate-600'
        };
      case 3: // Bunga
        return {
          background: 'bg-gradient-to-b from-green-50 to-emerald-100',
          textColor: 'text-green-900',
          accent: 'text-green-600'
        };
      case 4: // Vintage
        return {
          background: 'bg-gradient-to-b from-amber-50 to-yellow-100',
          textColor: 'text-amber-900',
          accent: 'text-amber-600'
        };
      case 5: // Minimalis
        return {
          background: 'bg-gradient-to-b from-white to-gray-50',
          textColor: 'text-gray-900',
          accent: 'text-gray-600'
        };
      default:
        return {
          background: 'bg-gradient-soft',
          textColor: 'text-foreground',
          accent: 'text-primary'
        };
    }
  };

  const styles = getTemplateStyles();

  return (
    <div className={`min-h-screen ${styles.background}`}>
      <style>
        {`
          .template-text { color: ${styles.textColor.replace('text-', '')} !important; }
          .template-accent { color: ${styles.accent.replace('text-', '')} !important; }
        `}
      </style>
      {children}
    </div>
  );
};

export default TemplateRenderer;