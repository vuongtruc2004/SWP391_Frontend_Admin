'use client'
import { Avatar, Menu } from 'antd';
import { sidebarItems } from './app.sidebar.properties'
import Sider from 'antd/es/layout/Sider';
import { useCollapseContext } from '../../wrapper/collapse-sidebar/collapse.sidebar.wrapper';
import './overwrite.style.scss';
import { usePathname } from 'next/navigation';
import Link from 'next/link';

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
                items={sidebarItems}
                theme="light"
            />
        </Sider>
    )
}

export default AppSidebar