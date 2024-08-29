import { cn } from "@/lib/utils";
export function Panel(props: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "bg-surface-100 border-default overflow-hidden  rounded-md border shadow",
        props.className
      )}
    >
      {props.children}
    </div>
  );
}
Panel.Divider = function PanelDivider() {
  return <div className="border-b border-border" />;
};
