export function Panel(props: { children: React.ReactNode }) {
  return (
    <div className="bg-surface-100 border-default overflow-hidden  rounded-md border shadow">
      {props.children}
    </div>
  );
}

Panel.Divider = function PanelDivider() {
  return <div className="border-b border-border" />;
};
