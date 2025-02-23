'use client'
import { getNavigateLink } from '@/helper/authorization.helper';
import { WarningOutlined } from '@ant-design/icons';
import '@ant-design/v5-patch-for-react-19';
import type { FormProps } from 'antd';
import { Button, Form, Input } from 'antd';
import { getSession, signIn } from 'next-auth/react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

const LoginForm = () => {
    const [errorMessage, setErrorMessage] = useState<string | null | undefined>(null);
    const router = useRouter();

    const onFinish: FormProps<CredentialsLoginRequest>['onFinish'] = async (values) => {
        let emailInput = values.email;
        if (emailInput && !emailInput.includes("@")) {
            emailInput += "@gmail.com";
        }
        const loginResponse = await signIn("credentials", {
            email: emailInput,
            password: values.password,
            redirect: false
        });

        if (!loginResponse || !loginResponse.ok) {
            setErrorMessage(loginResponse?.error);
            return;
        }

        const session = await getSession();
        if (!session || !session.user?.roleName) {
            setErrorMessage("Không lấy được thông tin quyền hạn.");
            return;
        }

        const roleName = session.user.roleName;
        router.push(getNavigateLink(roleName));
    };

    return (
        <Form
            layout="vertical"
            onFinish={onFinish}
            autoComplete="off"
        >
            <Form.Item<CredentialsLoginRequest>
                label="Email"
                name="email"
                rules={[{ required: true, message: 'Vui lòng không để trống email!' }]}
            >
                <Input autoComplete='email' placeholder='Nhập email' />
            </Form.Item>

            <Form.Item<CredentialsLoginRequest>
                label="Mật khẩu"
                name="password"
                rules={[{ required: true, message: 'Vui lòng không để trống mật khẩu!' }]}
            >
                <Input.Password autoComplete='password' placeholder='••••••••' />
            </Form.Item>

            <div className='flex justify-end'>
                <Link href={"/forgot/password"}>
                    Quên mật khẩu?
                </Link>
            </div>

            <Form.Item label={null}>
                <Button type="primary" htmlType="submit">
                    Đăng nhập
                </Button>
            </Form.Item>

            {errorMessage && (
                <p className='text-red-500 text-sm mt-2 flex items-center gap-x-1'>
                    <WarningOutlined />
                    {errorMessage}
                </p>
            )}
        </Form>
    );
}

export default LoginForm;