import { storageUrl } from '@/utils/url'
import { DoubleRightOutlined } from '@ant-design/icons'
import { Collapse, Drawer } from 'antd'
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
                    <div className='mb-2'><span className='text-blue-500 text-base mr-2 font-bold'>Id:</span>{subject.subjectId}</div>
                    <div className='mb-2'><span className='text-blue-500 text-base mr-2 font-bold'>Tên môn học: </span>{subject.subjectName}</div>
                    <div className='mb-2'><span className='text-blue-500 text-base mr-2 font-bold'>Mô tả: </span>{subject.description}</div>
                    <div className='mb-2'><span className='text-blue-500 text-base mr-2 font-bold'>
                        Số lượng khóa học: </span>{subject.totalCourses}
                        <Collapse
                            items={[{
                                label: 'Xem chi tiết',
                                children:
                                    <ul className='ml-4'>
                                        {[...subject.listCourses].map((course, index) => (
                                            <ol key={index}><span className='gap-2 mr-2'><DoubleRightOutlined style={{ color: 'green' }} /></span>{course}</ol>
                                        ))}
                                    </ul>
                            }]}
                        />
                    </div>


                    <div className='mb-2'><span className='text-blue-500 text-base mr-2 font-bold'>Ảnh:</span> </div><br />
                    <div className="flex justify-center items-center">
                        <div className="relative">
                            <img className="h-[150px] border-2 rounded-xl shadow-[4px_4px_4px_rgba(0,0,0,0.2)]"
                                src={`${storageUrl}/subject/${subject.thumbnail}`}
                                //@ts-ignore
                                onError={(e) => { e.target.src = `${storageUrl}/other/notfound.png`; }}
                                alt={subject.subjectName}
                            />
                        </div>
                    </div>

                </>
                    :
                    <div>Không có dữ liệu</div>
                }

            </Drawer>
        </>)
}

export default ViewSubjectDetail