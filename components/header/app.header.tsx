'use client'
import { AlignLeftOutlined } from "@ant-design/icons";
import { MdLogout } from "react-icons/md";
import { Avatar, Button, Divider, Dropdown, theme } from "antd"
import React from "react";
import { dropdownItems } from "./app.header.properties";
import { useCollapseContext } from "../wrapper/collapse-sidebar/collapse.sidebar.wrapper";

const { useToken } = theme;
const AppHeader = () => {
    const { collapsed, setCollapsed } = useCollapseContext();
    const { token } = useToken();

    const contentStyle: React.CSSProperties = {
        backgroundColor: token.colorBgElevated,
        borderRadius: token.borderRadiusLG,
        boxShadow: token.boxShadowSecondary,
        padding: '10px'
    }

    return (
        <div className="flex justify-between items-center px-5 py-3 bg-white" style={{ boxShadow: '3px 2px 5px rgba(0,0,0,0.2)' }}>
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
                            <Avatar size={42} style={{ backgroundColor: '#60a5fa', marginRight: '15px' }}>
                                N
                            </Avatar>
                            <div>
                                <p className="text-sm text-black font-semibold">Xin chào, Nguyen Vuong Truc</p>
                                <p className="flex items-center justify-between gap-x-5">
                                    <span className="text-sm text-gray-500">Vai trò: <strong className="text-black font-semibold">Admin</strong></span>
                                    <span className="text-sm text-gray-500">UID: <strong className="text-black font-semibold">1</strong></span>
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
                        <Button color='danger' className="w-full" variant="filled">
                            <MdLogout />
                            <p className="text-sm">Đăng xuất</p>
                        </Button>
                    </div>
                )}
            >
                <Avatar size={40} style={{ backgroundColor: '#60a5fa', cursor: 'pointer' }}>
                    N
                </Avatar>
            </Dropdown >
        </div >
    )
}

export default AppHeader