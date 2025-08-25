import { ReactNode } from "react";

import ResponsiveDrawer from "./ResponsiveDrawer";

type AddAccountHeaderProps = {
  title: string;
  drawerTitle: string;
  triggerLabel: string;
  drawerContent: ReactNode;
};

const AddAccountHeader = ({
  title,
  drawerTitle,
  triggerLabel,
  drawerContent,
}: AddAccountHeaderProps) => {
  return (
    <header className="flex items-center justify-between">
      <h1 className="text-14-medium md:text-20-medium">{title}</h1>

      <ResponsiveDrawer
        title={drawerTitle}
        triggerLabel={triggerLabel}
        content={drawerContent}
      />
    </header>
  );
};

export default AddAccountHeader;
