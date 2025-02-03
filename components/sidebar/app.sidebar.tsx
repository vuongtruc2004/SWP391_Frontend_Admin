'use client'
import { Avatar, Menu } from 'antd';
import { sidebarItems } from './app.sidebar.properties'
import Sider from 'antd/es/layout/Sider';
import { useCollapseContext } from '../wrapper/collapse-sidebar/collapse.sidebar.wrapper';
import './overwrite.style.scss';
import { usePathname } from 'next/navigation';

const AppSidebar = () => {
    const { collapsed } = useCollapseContext();
    const pathname = usePathname();

    return (
        <Sider
            width={280}
            style={{ boxShadow: '2px 0 5px rgba(0,0,0,0.2)', zIndex: 10, transition: 'all 0.3s' }}
            theme="light"
            collapsed={collapsed}
            collapsedWidth={80}
        >
            <div className='flex items-center justify-center gap-x-3 p-3 h-16 mb-5'>
                <Avatar size={40} style={{ backgroundColor: '#60a5fa' }}>
                    Logo
                </Avatar>
                {!collapsed && <p className='text-lg font-semibold'>E-Learning</p>}
            </div>
            <Menu
                style={{ width: '100%' }}
                selectedKeys={[pathname.split('/')[1]]}
                mode="inline"
                items={sidebarItems}
                theme="light"
            />
        </Sider>
    )
}

export default AppSidebar