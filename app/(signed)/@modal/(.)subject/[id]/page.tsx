import UpdateForm from '@/components/subject/update.subject.form';
import { sendRequest } from '@/utils/fetch.api';
import { apiUrl } from '@/utils/url';

const SubjectDetailPage = async ({
    params,
}: {
    params: Promise<{ id: string }>
}) => {
    const id = (await params).id;
    const subjectResponse = await sendRequest<ApiResponse<SubjectResponse>>({
        url: `${apiUrl}/subjects/${id}`
    });
    return (
        <div className='w-full min-h-screen flex items-center justify-center z-10 absolute top-0 left-0' style={{
            backgroundColor: 'rgba(0,0,0,0.2)'
        }}>
            <UpdateForm subject={subjectResponse.data} />
        </div>
    )
}

export default SubjectDetailPage