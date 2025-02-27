'use client'
import { sendRequest } from "@/utils/fetch.api";
import { apiUrl, storageUrl } from "@/utils/url";
import { AlignLeftOutlined } from "@ant-design/icons";
import '@ant-design/v5-patch-for-react-19';
import { Avatar, Button, Divider, Dropdown, theme } from "antd";
import { signOut, useSession } from "next-auth/react";
import React from "react";
import { MdLogout } from "react-icons/md";
import { useCollapseContext } from "../../wrapper/collapse-sidebar/collapse.sidebar.wrapper";
import { dropdownItems } from "./app.header.properties";

const { useToken } = theme;
const AppHeader = () => {
    const { collapsed, setCollapsed } = useCollapseContext();
    const { data: session } = useSession();
    const { token } = useToken();

    const avatarSrc = session?.user?.avatar?.startsWith("http") ? session?.user?.avatar : `${storageUrl}/avatar/${session?.user?.avatar}`

    const contentStyle: React.CSSProperties = {
        backgroundColor: token.colorBgElevated,
        borderRadius: token.borderRadiusLG,
        boxShadow: token.boxShadowSecondary,
        padding: '10px'
    }

    const handleLogout = async () => {
        await sendRequest({
            url: `${apiUrl}/auth/logout`,
            queryParams: {
                refresh_token: session?.refreshToken
            }
        })
        signOut();
    }

    return (
        <div className="flex justify-between items-center px-5 py-3 bg-white"
            style={{
                boxShadow: '3px 2px 5px rgba(0,0,0,0.2)',
                position: 'sticky',
                top: 0,
                left: 0,
                zIndex: 15
            }}>
            <Button type="text" onClick={() => setCollapsed(prev => !prev)} className={collapsed ? 'rotate-180' : ''}>
                <AlignLeftOutlined style={{ fontSize: '20px' }} />
            </Button>

            <Dropdown
                menu={{
                    items: dropdownItems,
                }}
                trigger={['click']}
                arrow
                placement="bottomRight"
                dropdownRender={(menu) => (
                    <div style={contentStyle}>
                        <div className="flex items-center justify-between m-3">
                            <Avatar size={40} src={avatarSrc} alt='user avatar' style={{ marginRight: '15px' }}>
                                {session?.user.fullname?.charAt(0).toUpperCase()}
                            </Avatar>
                            <div>
                                <p className="text-sm text-black font-semibold">Xin chào, {session?.user.fullname}</p>
                                <p className="flex items-center justify-between gap-x-5">
                                    <span className="text-sm text-gray-500">Vai trò: <strong className="text-black font-semibold">{session?.user.roleName}</strong></span>
                                    <span className="text-sm text-gray-500">UID: <strong className="text-black font-semibold">{session?.user.userId}</strong></span>
                                </p>
                            </div>
                        </div>
                        {React.cloneElement(
                            menu as React.ReactElement<{
                                style: React.CSSProperties;
                            }>,
                            { style: { boxShadow: 'none' } },
                        )}
                        <Divider style={{ marginBlock: '0 10px' }} />
                        <Button color='danger' className="w-full" variant="filled" onClick={handleLogout}>
                            <MdLogout />
                            <p className="text-sm">Đăng xuất</p>
                        </Button>
                    </div>
                )}
            >
                <Avatar size={40} src={avatarSrc} alt='user avatar' className='cursor-pointer'>
                    {session?.user.fullname?.charAt(0).toUpperCase()}
                </Avatar>
            </Dropdown >
        </div >
    )
}

export default AppHeader