import { CodeOutlined, TeamOutlined } from '@ant-design/icons';
import { RxDashboard } from "react-icons/rx";
import { LuNewspaper } from "react-icons/lu";
import { BiBookReader } from "react-icons/bi";
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
                label: <Link href="/subject">Quản lí công nghệ</Link>,
                icon: <CodeOutlined />

            },
            {
                key: 'course_group',
                label: 'Quản lí khóa học',
                icon: <BiBookReader />,
                children: [
                    { key: 'course', label: <Link href="/course">Khóa học</Link> },
                    { key: 'lesson', label: <Link href="/lesson">Bài giảng</Link> }
                ],
            },
            {
                key: 'exam_group',
                label: 'Quản lí bài kiểm tra',
                icon: <LuNewspaper />,
                children: [
                    { key: 'exam', label: <Link href="/exam">Bài kiểm tra</Link> },
                    { key: 'question', label: <Link href="/question">Câu hỏi</Link> },
                ],
            },
        ]
    }
];