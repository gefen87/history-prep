// components/Button.tsx
export const VoogButton = ({ children, onClick }: { children: React.ReactNode, onClick?: () => void }) => {
  return (
    <button 
      onClick={onClick}
      className="bg-brand hover:bg-brand-dark text-white font-bold py-3 px-6 rounded-voog transition-all shadow-sm active:scale-95"
    >
      {children}
    </button>
  );
};