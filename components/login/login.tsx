import LoginForm from "@/features/login/login.form"

const Login = () => {
    return (
        <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            width: '100%',
            height: '100vh',
            backgroundColor: '#ebf2fa'
        }}>
            <div className="w-full max-w-[500px] shadow-md bg-white p-5 rounded-md">
                <h1 className="font-semibold text-lg text-center mb-3">Đăng Nhập</h1>
                <LoginForm />
            </div>
        </div>
    )
}

export default Login