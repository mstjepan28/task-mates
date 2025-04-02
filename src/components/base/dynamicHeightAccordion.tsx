/**
 * This component enables us to use a animated accordion menu without having to specify any fixed heights
 */
export const DynamicHeightAccordion = ({
  isOpen,
  children,
}: {
  isOpen: boolean;
  children: React.ReactNode;
}) => {
  return (
    <div style={{ gridTemplateRows: isOpen ? "1fr" : "0fr" }} className="overflow-hidden transition-all grid">
      <div className="overflow-hidden">{children}</div>
    </div>
  );
};
