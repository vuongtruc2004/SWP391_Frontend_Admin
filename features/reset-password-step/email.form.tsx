import { SetStateAction, useState } from "react";
import { Button, Form, FormProps, Input } from "antd";
import { sendRequest } from "@/utils/fetch.api";
import { apiUrl } from "@/utils/url";
import { WarningOutlined } from "@ant-design/icons";
import '@ant-design/v5-patch-for-react-19';
import './overwrite.style.scss';

type FieldType = {
    email?: string;
};
const EmailForm = ({ setStep, setEmail }: {
    setStep: React.Dispatch<SetStateAction<number>>,
    setEmail: React.Dispatch<SetStateAction<string>>
}) => {
    const [pending, setPending] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const onFinish: FormProps<FieldType>['onFinish'] = async (values) => {
        setPending(true);
        const emailResponse = await sendRequest<ApiResponse<void>>({
            url: `${apiUrl}/users/request_change_password`,
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: {
                email: values.email
            }
        });

        setPending(false);
        if (emailResponse.status === 200) {
            setStep(prev => prev + 1);
            setEmail(values.email || "");
        } else {
            setErrorMessage("Không gửi được mã OTP, vui lòng kiểm tra email của bạn!");
        }
    };

    return (
        <>
            <h1 className="text-xl text-center font-semibold mb-3">Quên mật khẩu?</h1>
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

                <Form.Item label={null}>
                    <Button type="primary" htmlType="submit" loading={pending} className="continue">
                        Tiếp tục
                    </Button>
                </Form.Item>
                {errorMessage && (
                    <p className='text-red-500 text-sm mt-2 flex items-center gap-x-1'>
                        <WarningOutlined />
                        {errorMessage}
                    </p>
                )}
            </Form>
        </>
    )
}

export default EmailForm