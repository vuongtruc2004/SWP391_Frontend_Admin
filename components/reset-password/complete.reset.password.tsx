import { CheckOutlined } from "@ant-design/icons"

const CompleteResetPassword = () => {
    return (
        <>
            <div className="flex justify-center mb-2">
                <span className="inline-flex items-center justify-center w-[60px] h-[60px] rounded-[15px] border border-green-500">
                    <CheckOutlined style={{ color: '#22c55e' }} />
                </span>
            </div>

            <h1 className="text-2xl text-center font-semibold">Bạn đã đổi mật khẩu thành công!</h1>
            <p className="text-center text-gray-400 mb-5">Vui lòng quay lại trang đăng nhập thực hiện đăng nhập.</p>
        </>
    )
}

export default CompleteResetPassword