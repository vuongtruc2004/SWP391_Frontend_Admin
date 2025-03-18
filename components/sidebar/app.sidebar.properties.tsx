import { BarChartOutlined, CodeOutlined, NotificationOutlined, TeamOutlined } from '@ant-design/icons';
import { RxDashboard } from "react-icons/rx";
import { LuNewspaper } from "react-icons/lu";
import { BiBookReader } from "react-icons/bi";
import { IoTicketOutline } from "react-icons/io5";
import { FaRegPaperPlane } from "react-icons/fa";
import type { MenuProps } from 'antd';
import Link from 'next/link';

type MenuItem = Required<MenuProps>['items'][number];

export const sidebarItems: MenuItem[] = [
    {
        type: 'group',
        label: 'Tổng quan',
        children: [
            {
                key: 'dashboard',
                label: <Link href="/dashboard">Thống kê</Link>,
                icon: <RxDashboard />,
            },
        ]
    },
    {
        label: 'Quản lí',
        type: 'group',
        children: [
            {
                key: 'user',
                label: <Link href="/user">Quản lí tài khoản</Link>,
                icon: <TeamOutlined />
            },
            {
                key: 'blog',
                label: <Link href="/blog">Quản lí bài viết</Link>,
                icon: <FaRegPaperPlane />
            },
            {
                key: 'subject',
                label: <Link href="/subject">Quản lí lĩnh vực</Link>,
                icon: <CodeOutlined />

            },
            {
                key: 'order',
                label: <Link href="/order">Quản lí hóa đơn</Link>,
                icon: <BarChartOutlined />

            },
            {
                key: 'notification',
                label: <Link href="/notification">Quản lí thông báo</Link>,
                icon: <NotificationOutlined />

            },
            {
                key: 'course',
                label: <Link href="/course">Quản lí khóa học</Link>,
                icon: <BiBookReader />,
            },
            {
                key: 'coupon',
                label: <Link href="/coupon">Quản lí coupon</Link>,
                icon: <IoTicketOutline />,
            },
            {
                key: 'quiz',
                label: <Link href="/quiz">Quản lí bài kiểm tra</Link>,
                icon: <LuNewspaper />,
            },
        ]
    }
];

export const sidebarItemsExpert: MenuItem[] = [
    {
        type: 'group',
        label: 'Tổng quan',
        children: [
            {
                key: 'dashboard',
                label: <Link href="/dashboard">Thống kê</Link>,
                icon: <RxDashboard />,
            },
        ]
    },
    {
        label: 'Quản lí',
        type: 'group',
        children: [
            {
                key: 'blog',
                label: <Link href="/blog">Quản lí bài viết</Link>,
                icon: <FaRegPaperPlane />
            },
            {
                key: 'subject',
                label: <Link href="/subject">Quản lí lĩnh vực</Link>,
                icon: <CodeOutlined />

            },
            {
                key: 'order',
                label: <Link href="/order">Quản lí hóa đơn</Link>,
                icon: <BarChartOutlined />

            },
            {
                key: 'notification',
                label: <Link href="/notification">Quản lí thông báo</Link>,
                icon: <NotificationOutlined />

            },
            {
                key: 'course',
                label: <Link href="/course">Quản lí khóa học</Link>,
                icon: <BiBookReader />,
            },
            {
                key: 'coupon',
                label: <Link href="/coupon">Quản lí coupon</Link>,
                icon: <IoTicketOutline />,
            },
            {
                key: 'quiz',
                label: <Link href="/quiz">Quản lí bài kiểm tra</Link>,
                icon: <LuNewspaper />,
            },
        ]
    }
];