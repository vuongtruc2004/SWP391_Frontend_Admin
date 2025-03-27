import { BarChartOutlined, CodeOutlined, NotificationOutlined, QuestionCircleOutlined, TeamOutlined } from '@ant-design/icons';
import { RxDashboard } from "react-icons/rx";
import { LuNewspaper } from "react-icons/lu";
import { BiBookReader } from "react-icons/bi";
import { IoTicketOutline } from "react-icons/io5";
import { FaRegPaperPlane } from "react-icons/fa";
import type { MenuProps } from 'antd';
import Link from 'next/link';
import { BsClipboardData } from "react-icons/bs";

type MenuItem = Required<MenuProps>['items'][number];

export const sidebarItemsAdmin: MenuItem[] = [
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
        label: 'Quản lý',
        type: 'group',
        children: [
            {
                key: 'user',
                label: <Link href="/user">Quản lý tài khoản</Link>,
                icon: <TeamOutlined />
            },
            {
                key: 'blog',
                label: <Link href="/blog">Quản lý bài viết</Link>,
                icon: <FaRegPaperPlane />
            },
            {
                key: 'subject',
                label: <Link href="/subject">Quản lý lĩnh vực</Link>,
                icon: <CodeOutlined />

            },
            {
                key: 'order',
                label: <Link href="/order">Quản lý hóa đơn</Link>,
                icon: <BarChartOutlined />

            },
            {
                key: 'notification',
                label: <Link href="/notification">Quản lý thông báo</Link>,
                icon: <NotificationOutlined />

            },
            {
                key: 'course',
                label: <Link href="/course">Quản lý khóa học</Link>,
                icon: <BiBookReader />,
            },
            {
                key: 'coupon',
                label: <Link href="/coupon">Quản lý coupon</Link>,
                icon: <IoTicketOutline />,
            },
            {
                key: 'quiz',
                label: <Link href="/quiz">Quản lý bài kiểm tra</Link>,
                icon: <LuNewspaper />,
            },
            {
                key: 'question',
                label: <Link href="/question">Quản lý câu hỏi</Link>,
                icon: <QuestionCircleOutlined />,
            },
            {
                key: 'campaign',
                label: <Link href="/campaign">Quản lý chiến dịch</Link>,
                icon: <BsClipboardData />,
            },
        ]
    }
];

export const sidebarItemsMarketing: MenuItem[] = [
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
        label: 'Quản lý',
        type: 'group',
        children: [
            {
                key: 'blog',
                label: <Link href="/blog">Quản lý bài viết</Link>,
                icon: <FaRegPaperPlane />
            },
            {
                key: 'order',
                label: <Link href="/order">Quản lý hóa đơn</Link>,
                icon: <BarChartOutlined />
            },
            {
                key: 'notification',
                label: <Link href="/notification">Quản lý thông báo</Link>,
                icon: <NotificationOutlined />
            },
            {
                key: 'course',
                label: <Link href="/course">Quản lý khóa học</Link>,
                icon: <BiBookReader />,
            },
            {
                key: 'coupon',
                label: <Link href="/coupon">Quản lý coupon</Link>,
                icon: <IoTicketOutline />,
            },
            {
                key: 'campaign',
                label: <Link href="/campaign">Quản lý chiến dịch</Link>,
                icon: <BsClipboardData />,
            },
        ]
    }
];

export const sidebarItemsExpert: MenuItem[] = [
    {
        label: 'Quản lý',
        type: 'group',
        children: [
            {
                key: 'blog',
                label: <Link href="/blog">Quản lý bài viết</Link>,
                icon: <FaRegPaperPlane />
            },
            {
                key: 'subject',
                label: <Link href="/subject">Quản lý lĩnh vực</Link>,
                icon: <CodeOutlined />

            },
            {
                key: 'notification',
                label: <Link href="/notification">Quản lý thông báo</Link>,
                icon: <NotificationOutlined />

            },
            {
                key: 'course',
                label: <Link href="/course">Quản lý khóa học</Link>,
                icon: <BiBookReader />,
            },
            {
                key: 'quiz',
                label: <Link href="/quiz">Quản lý bài kiểm tra</Link>,
                icon: <LuNewspaper />,
            },
            {
                key: 'question',
                label: <Link href="/question">Quản lý câu hỏi</Link>,
                icon: <QuestionCircleOutlined />,
            },
        ]
    }
];
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
        label: 'Quản lý',
        type: 'group',
        children: [
            {
                key: 'blog',
                label: <Link href="/blog">Quản lý bài viết</Link>,
                icon: <FaRegPaperPlane />
            },
            {
                key: 'subject',
                label: <Link href="/subject">Quản lý lĩnh vực</Link>,
                icon: <CodeOutlined />

            },
            {
                key: 'order',
                label: <Link href="/order">Quản lý hóa đơn</Link>,
                icon: <BarChartOutlined />

            },
            {
                key: 'notification',
                label: <Link href="/notification">Quản lý thông báo</Link>,
                icon: <NotificationOutlined />

            },
            {
                key: 'course',
                label: <Link href="/course">Quản lý khóa học</Link>,
                icon: <BiBookReader />,
            },
            {
                key: 'coupon',
                label: <Link href="/coupon">Quản lý coupon</Link>,
                icon: <IoTicketOutline />,
            },
            {
                key: 'quiz',
                label: <Link href="/quiz">Quản lý bài kiểm tra</Link>,
                icon: <LuNewspaper />,
            },
            {
                key: 'question',
                label: <Link href="/question">Quản lý câu hỏi</Link>,
                icon: <QuestionCircleOutlined />,
            },
            {
                key: 'campaign',
                label: <Link href="/campaign">Quản lý chiến dịch</Link>,
                icon: <BsClipboardData />,
            },
        ]
    }
];
