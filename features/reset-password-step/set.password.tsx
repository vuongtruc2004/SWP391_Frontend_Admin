import { sendRequest } from '@/utils/fetch.api';
import { apiUrl } from '@/utils/url';
import { WarningOutlined } from '@ant-design/icons';
import type { FormProps } from 'antd';
import { Button, Form, Input } from 'antd';
import { SetStateAction, useState } from 'react';

type FieldType = {
    password?: string;
    rePassword?: string;
};

const SetPassword = ({ setStep, code }: { setStep: React.Dispatch<SetStateAction<number>>, code: string }) => {
    const [errorMessage, setErrorMessage] = useState("");

    const onFinish: FormProps<FieldType>['onFinish'] = async (values) => {
        const password = values.password || "";
        const rePassword = values.rePassword || "";
        const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;

        if (!passwordRegex.test(password)) {
            setErrorMessage("Mật khẩu phải chứa ít nhất 8 kí tự và phải bao gồm số và chữ cái!");
            return;
        }
        if (password !== rePassword) {
            setErrorMessage("Mật khẩu không trùng khớp!");
            return;
        }
        const changePasswordRequest: ChangePasswordRequest = {
            code: code,
            password: password,
            rePassword: rePassword
        }
        const sendChangePasswordResponse = await sendRequest<ApiResponse<void>>({
            url: `${apiUrl}/users/change_password`,
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: changePasswordRequest
        });

        if (sendChangePasswordResponse.status === 200) {
            setStep(prev => prev + 1);
        } else {
            setErrorMessage(sendChangePasswordResponse.message.toString());
        }
    };

    return (
        <Form
            layout='vertical'
            onFinish={onFinish}
            autoComplete="off"
        >
            <Form.Item<FieldType>
                label="Mật khẩu"
                name="password"
                rules={[{ required: true, message: 'Vui lòng không để trống mật khẩu!' }]}
            >
                <Input.Password autoComplete='password' placeholder='••••••••' />
            </Form.Item>

            <Form.Item<FieldType>
                label="Nhập lại mật khẩu"
                name="rePassword"
                rules={[{ required: true, message: 'Vui lòng không để trống mật khẩu!' }]}
            >
                <Input.Password autoComplete='rePassword' placeholder='••••••••' />
            </Form.Item>

            <Form.Item label={null}>
                <Button type="primary" htmlType="submit">
                    Thay Đổi
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

export default SetPassword;