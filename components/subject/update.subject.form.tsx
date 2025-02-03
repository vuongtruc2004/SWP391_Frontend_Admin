'use client'
import { useActionState, useEffect } from 'react';
import { UpdateSubjectFieldResponse, validSubject } from './action';
import { Button, Input, notification } from 'antd';
import { WarningOutlined } from '@ant-design/icons';
import { useRouter } from 'next/navigation';
import '@ant-design/v5-patch-for-react-19';
import { sendRequest } from '@/utils/fetch.api';
import { apiUrl } from '@/utils/url';

const initState: UpdateSubjectFieldResponse = {
    subjectName: {
        error: false,
        value: ""
    },
    description: {
        error: false,
        value: ""
    }
}
interface IProps {
    subject: SubjectResponse;
}
const UpdateForm = (props: IProps) => {
    const { subject } = props;
    const validSubjectExpand = validSubject.bind(null, subject?.subjectId!);
    const [state, formAction, pending] = useActionState(validSubjectExpand, initState);
    const router = useRouter();

    useEffect(() => {
        const udpateSubject = async () => {
            const subjectRequest: SubjectRequest = {
                subjectId: subject.subjectId,
                subjectName: state.subjectName.value,
                description: state.description.value,
                thumbnail: subject.thumbnail
            }
            const updateResponse = await sendRequest<ApiResponse<SubjectResponse>>({
                url: `${apiUrl}/subjects/update`,
                method: 'PATCH',
                body: subjectRequest,
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (updateResponse.status === 200) {
                notification.success({
                    message: updateResponse.message.toString(),
                    description: updateResponse.errorMessage,
                });
                router.back();
            } else {
                notification.error({
                    message: updateResponse.message.toString(),
                    description: updateResponse.errorMessage,
                })
            }
        }
        if (!state.description.error && !state.subjectName.error && state.description.value !== "") {
            udpateSubject();
        }
    }, [state]);

    return (
        <form action={formAction} className='bg-white w-full max-w-[500px] px-5 py-10 rounded-md'>
            <div className="mb-3">
                <label className="block text-sm mb-1"><span className='text-red-500 mr-1'>*</span>Mã môn:</label>
                <Input
                    placeholder="Nhập tên môn học"
                    allowClear
                    className="mt-1"
                    disabled
                    name="subjectId"
                    defaultValue={subject.subjectId}
                />
            </div>
            <div className="mb-3">
                <label className="block text-sm mb-1"><span className='text-red-500 mr-1'>*</span>Tên môn học:</label>
                <Input
                    placeholder="Nhập tên môn học"
                    allowClear
                    className="mt-1"
                    defaultValue={subject.subjectName}
                    name="subjectName"
                    status={state.subjectName.error ? 'error' : ''}
                />
                {state.subjectName.error && (
                    <span className="flex items-center gap-x-1 text-red-500 text-sm ml-2">
                        <WarningOutlined />
                        {state?.subjectName.message}
                    </span>
                )}
            </div>
            <div className="mb-3">
                <label className="block text-sm mb-1"><span className='text-red-500 mr-1'>*</span>Mô tả môn học:</label>
                <Input
                    placeholder="Nhập mô tả môn học"
                    allowClear
                    className="mt-1"
                    defaultValue={subject.description}
                    name="description"
                    status={state.description.error ? 'error' : ''}
                />
                {state.description.error && (
                    <span className="flex items-center gap-x-1 text-red-500 text-sm ml-2">
                        <WarningOutlined />
                        {state?.description.message}
                    </span>
                )}
            </div>
            <div className="flex justify-end mt-8 gap-x-2">
                <Button onClick={() => router.back()}>Hủy</Button>
                <Button type="primary" htmlType="submit" loading={pending}>
                    Thay đổi
                </Button>
            </div>
        </form>
    )
}

export default UpdateForm