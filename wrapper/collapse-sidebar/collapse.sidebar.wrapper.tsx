'use client'
import { createContext, useContext, useState } from "react";

interface CollapseContextType {
    collapsed: boolean;
    setCollapsed: React.Dispatch<React.SetStateAction<boolean>>;
}

const CollapseContext = createContext<CollapseContextType | null>(null);
export const CollapseSidebarWrapper = ({ children }: { children: React.ReactNode }) => {
    const [collapsed, setCollapsed] = useState<boolean>(false);

    return (
        <CollapseContext.Provider value={{ collapsed, setCollapsed }}>
            {children}
        </CollapseContext.Provider>
    )
}

export const useCollapseContext = () => {
    const context = useContext(CollapseContext);
    if (!context) {
        throw new Error('Collapse context is not provided!');
    }
    return context;
}
