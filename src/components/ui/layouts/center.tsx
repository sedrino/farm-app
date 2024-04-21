export const Center = (props: { children?: React.ReactNode }) => {
  return (
    <div className="mx-auto max-w-7xl px-6 lg:px-14 xl:px-28 2xl:px-32">
      {props.children}
    </div>
  );
};
