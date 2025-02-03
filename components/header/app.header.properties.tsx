import { LogoutOutlined, SettingOutlined, UserOutlined } from "@ant-design/icons";
import { Avatar, Button } from "antd"
import type { MenuProps } from 'antd';
import Link from "next/link";

export const dropdownItems: MenuProps['items'] = [
    {
        key: 'profile',
        label: (
            <Link href={"/profile"} className="flex items-center justify-start my-1 gap-x-3">
                <UserOutlined />
                <p className="text-sm">Thông tin tài khoản</p>
            </Link>
        )
    },
    {
        key: 'setting',
        label: (
            <Link href={"/setting"} className="flex items-center justify-start my-1 gap-x-3">
                <SettingOutlined />
                <p className="text-sm">Cài đặt</p>
            </Link>
        )
    }
]


