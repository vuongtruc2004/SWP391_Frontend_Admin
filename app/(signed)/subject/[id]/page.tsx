import UpdateForm from '@/components/subject/update.subject.form';
import { sendRequest } from '@/utils/fetch.api';
import { apiUrl } from '@/utils/url';
import React from 'react'

const SingleSubjectPage = async ({
    params,
}: {
    params: Promise<{ id: string }>
}) => {
    const id = (await params).id;
    const subjectResponse = await sendRequest<ApiResponse<SubjectResponse>>({
        url: `${apiUrl}/subjects/${id}`
    });
    return (
        <div className='w-full flex items-center justify-center'>
            <UpdateForm subject={subjectResponse.data} />
        </div>
    )
}

export default SingleSubjectPage