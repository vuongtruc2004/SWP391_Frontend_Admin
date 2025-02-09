import { storageUrl } from '@/utils/url'
import { DoubleRightOutlined } from '@ant-design/icons'
import { Collapse, Drawer } from 'antd'
import React, { SetStateAction } from 'react'

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

    return (
        <>
            <Drawer title="THÔNG TIN CHI TIẾT" onClose={onClose} open={openDraw}>
                {user ? <>
                    <div className='mb-2'><span className='text-blue-500 text-base mr-2 font-bold'>Id:</span>{user.userId}</div>
                    <div className='mb-2'><span className='text-blue-500 text-base mr-2 font-bold'>Tên người dùng: </span>{user.fullname}</div>
                    <div className='mb-2'><span className='text-blue-500 text-base mr-2 font-bold'>Email: </span>{user.email}</div>
                    <div className='mb-2'><span className='text-blue-500 text-base mr-2 font-bold'>Giới tính: </span>{user.gender ? 'Nam' : 'Nữ'}</div>
                    <div className='mb-2'><span className='text-blue-500 text-base mr-2 font-bold'>Ngày sinh: </span>{user.dob == null ? 'Chưa cung cấp ngày sinh' : user.dob}</div>
                    <div className='mb-2'><span className='text-blue-500 text-base mr-2 font-bold'>Loại tài khoản: </span>{user.accountType}</div>
                    {/* 
                    <div className='mb-2'><span className='text-blue-500 text-base mr-2 font-bold'>
                        Số lượng khóa học: </span>{user.totalCourses}
                        <Collapse
                            items={[{
                                label: 'Xem chi tiết',
                                children:
                                    <ul className='ml-4'>
                                        {[...user.listCourses].map((course, index) => (
                                            <ol key={index}><span className='gap-2 mr-2'><DoubleRightOutlined style={{ color: 'green' }} /></span>{course}</ol>
                                        ))}
                                    </ul>
                            }]}
                        />
                    </div> */}


                    <div className='mb-2'><span className='text-blue-500 text-base mr-2 font-bold'>Ảnh:</span> </div><br />
                    <div className="flex justify-center items-center">
                        <div className="relative">
                            <img className="h-[150px] border-2 rounded-xl shadow-[4px_4px_4px_rgba(0,0,0,0.2)]"
                                src={`${storageUrl}/avatar/${user.avatar}`}
                                //@ts-ignore
                                onError={(e) => { e.target.src = `${storageUrl}/user/notfound.png`; }}
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