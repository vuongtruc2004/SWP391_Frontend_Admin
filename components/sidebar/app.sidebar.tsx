'use client'
import { Avatar, Menu } from 'antd';
import Sider from 'antd/es/layout/Sider';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useCollapseContext } from '../../wrapper/collapse-sidebar/collapse.sidebar.wrapper';
import { sidebarItems, sidebarItemsAdmin, sidebarItemsExpert, sidebarItemsMarketing } from './app.sidebar.properties';
import './overwrite.style.scss';

const AppSidebar = () => {
    const { collapsed } = useCollapseContext();
    const pathname = usePathname();
    const { data: session } = useSession();

    return (
        <Sider
            width={280}
            style={{ boxShadow: '2px 0 5px rgba(0,0,0,0.2)', zIndex: 20, transition: 'all 0.3s' }}
            theme="light"
            collapsed={collapsed}
            collapsedWidth={80}
        >
            <div className='flex items-center justify-center gap-x-3 p-3 h-16 mb-5'>
                <Link href={"/dashboard"} className="items-center flex justify-center cursor-pointer gap-x-2 mr-3">
                    <Avatar size={50} style={{ backgroundColor: '#f0f0f0 ' }}>
                        <img src={`/logo.webp`} alt="Logo" width={50} height={50} />
                    </Avatar>
                </Link>
                {!collapsed && <p className='text-lg font-semibold'>LearnGo</p>}
            </div>
            <Menu
                style={{ width: '100%' }}
                selectedKeys={[pathname.split('/')[1]]}
                mode="inline"
                items={
                    session?.user.roleName === "ADMIN"
                        ? sidebarItemsAdmin
                        : session?.user.roleName === "EXPERT"
                            ? sidebarItemsExpert
                            : session?.user.roleName === "MARKETING"
                                ? sidebarItemsMarketing
                                : sidebarItems
                }


                theme="light"
            />
        </Sider>
    )
}

export default AppSidebar