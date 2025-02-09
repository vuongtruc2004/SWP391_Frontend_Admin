'use client'
import EmailForm from "@/features/reset-password-step/email.form";
import { useEffect, useState } from "react";
import Link from "next/link";
import OtpForm from "@/features/reset-password-step/otp.form";
import SetPassword from "@/features/reset-password-step/set.password";
import CompleteResetPassword from "./complete.reset.password";
import { Button } from "antd";

const ResetPassword = () => {
    const [code, setCode] = useState("");
    const [email, setEmail] = useState("");
    const [step, setStep] = useState(1);

    return (
        <div style={{
            minHeight: '100vh',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            flexDirection: 'column',
            backgroundColor: '#ebf2fa'
        }}>
            <div className="w-full max-w-[500px] px-5 py-10 relative shadow-md bg-white rounded-md">
                {step === 1 && (
                    <EmailForm setStep={setStep} setEmail={setEmail} />
                )}
                {step === 2 && (
                    <OtpForm setStep={setStep} setCode={setCode} email={email} />
                )}
                {step === 3 && (
                    <SetPassword setStep={setStep} code={code} />
                )}
                {step === 4 && (
                    <CompleteResetPassword />
                )}

                <Link href={"/login"} className="mt-5 flex justify-center">
                    <Button>
                        Về trang đăng nhập
                    </Button>
                </Link>
            </div>
        </div>
    );
};

export default ResetPassword;