import { sendRequest } from '@/utils/fetch.api'
import { apiUrl, storageUrl } from '@/utils/url'
import { DoubleRightOutlined } from '@ant-design/icons'
import { Collapse, Drawer } from 'antd'
import React, { SetStateAction, useEffect, useState } from 'react'

interface IProps {
    user: UserResponse | null
    openDraw: any
    setOpenDraw: any
    setUser: React.Dispatch<SetStateAction<UserResponse | null>>
}
const ViewUserDetail = (props: IProps) => {

    const { user, openDraw, setOpenDraw } = props

    const onClose = () => {
        setOpenDraw(false);
    };
    const [expertDetailsResponse, setExpertDetailResponse] = useState<ExpertDetailsResponse | null>(null);
    const [showDescription, setShowDescription] = useState(false);
    useEffect(() => {
        const fetchApi = async () => {
            const expertDetailResponse = await sendRequest<ApiResponse<ExpertDetailsResponse>>({
                url: `${apiUrl}/experts/${user?.userId}`
            });
            if (expertDetailResponse.status === 200) {
                setExpertDetailResponse(expertDetailResponse.data);
            }
        }
        if (user?.roleName === 'EXPERT') {
            fetchApi();
        }



    }, [user])
    return (
        <>
            <Drawer title="THÔNG TIN CHI TIẾT" onClose={onClose} open={openDraw}>
                {user ? <>
                    <div className='mb-2'><span className='text-blue-500 text-base mr-2 font-bold'>Tên người dùng: </span>{user.fullname}</div>
                    <div className='mb-2'><span className='text-blue-500 text-base mr-2 font-bold'>Email: </span>{user.email}</div>
                    <div className='mb-2'><span className='text-blue-500 text-base mr-2 font-bold'>Giới tính: </span>{user.gender ? (user.gender === "MALE" ? 'Nam' : 'Nữ') : 'Chưa thiết lập'}</div>
                    <div className='mb-2'><span className='text-blue-500 text-base mr-2 font-bold'>Vai trò: </span>{user.roleName}</div>
                    <div className='mb-2'><span className='text-blue-500 text-base mr-2 font-bold'>Ngày sinh: </span>{user.dob == null ? 'Chưa cung cấp ngày sinh' : user.dob}</div>
                    <div className='mb-2'><span className='text-blue-500 text-base mr-2 font-bold'>Loại tài khoản: </span>{user.accountType}</div>

                    {user.roleName === 'EXPERT' ? <>
                        <div className='mb-2'><span className='text-blue-500 text-base mr-2 font-bold'>Thành tựu: </span>{expertDetailsResponse?.achievement}</div>
                        <div className={`mb-2 ${!showDescription && 'line-clamp-3 cursor-pointer '}`} onClick={() => setShowDescription(prev => !prev)}> <span className=' text-blue-500 text-base mr-2 font-bold' >Mô tả: </span>{expertDetailsResponse?.description}</div>
                        <div className='mb-2'><span className='text-blue-500 text-base mr-2 font-bold'>Công việc: </span>{expertDetailsResponse?.job}</div>
                        <div className='mb-2'><span className='text-blue-500 text-base mr-2 font-bold'>Số lượng học viên: </span>{expertDetailsResponse?.totalStudents}</div>
                        <div className='mb-2'><span className='text-blue-500 text-base mr-2 font-bold'>Số lượng khóa học: </span>{expertDetailsResponse?.totalCourses}</div>
                    </> : ''
                    }





                    <div className='mb-2'><span className='text-blue-500 text-base mr-2 font-bold'>Ảnh:</span> </div><br />
                    <div className="flex justify-center items-center">
                        <div className="relative">
                            <img className="h-[150px] border-2 rounded-xl shadow-[4px_4px_4px_rgba(0,0,0,0.2)]"
                                src={`${storageUrl}/avatar/${user.avatar}`}
                                //@ts-ignore
                                onError={(e) => { e.target.src = `${storageUrl}/other/notfound.png`; }}
                                alt={user.fullname}
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

export default ViewUserDetail