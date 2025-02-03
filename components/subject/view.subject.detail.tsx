import { storageUrl } from '@/utils/url'
import { Drawer } from 'antd'
import React, { SetStateAction } from 'react'

interface IProps {
    subject: SubjectResponse | null
    openDraw: any
    setOpenDraw: any
    setSubject: React.Dispatch<SetStateAction<SubjectResponse | null>>
}
const ViewSubjectDetail = (props: IProps) => {

    const { subject, openDraw, setOpenDraw } = props

    const onClose = () => {
        setOpenDraw(false);
    };

    return (
        <>
            <Drawer title="THÔNG TIN CHI TIẾT" onClose={onClose} open={openDraw}>
                {subject ? <>
                    <p className='mb-2'><span className='text-blue-500 text-base mr-2 font-bold'>Id:</span>{subject.subjectId}</p>
                    <p className='mb-2'><span className='text-blue-500 text-base mr-2 font-bold'>Tên môn học: </span>{subject.subjectName}</p>
                    <p className='mb-2'><span className='text-blue-500 text-base mr-2 font-bold'>Mô tả: </span>{subject.description}</p>
                    <p className='mb-2'><span className='text-blue-500 text-base mr-2 font-bold'>Số lượng khóa học: </span>{subject.totalCourses}</p>
                    <p className='mb-2'><span className='text-blue-500 text-base mr-2 font-bold'>Ảnh:</span> </p><br />
                    <div>
                        <input type="file" id='avatar-file' hidden />
                        <img className='h-34'
                            src={`${storageUrl}/subject/${subject.thumbnail}`}
                            alt={subject.thumbnail}
                        />
                    </div>
                </>
                    :
                    <p>Không có dữ liệu</p>
                }

            </Drawer>
        </>)
}

export default ViewSubjectDetail