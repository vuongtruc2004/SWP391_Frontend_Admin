'use client'

import { storageUrl } from "@/utils/url";
import { Drawer } from "antd";

const ViewPurchaserDetail = (props: {
    setOpenDraw: any,
    openDraw: any,
    userDetail: UserResponse | null
}) => {
    const { userDetail, openDraw, setOpenDraw } = props

    const onClose = () => {
        setOpenDraw(false);
    };

    return (
        <>
            <Drawer title="THÔNG TIN CHI TIẾT" onClose={onClose} open={openDraw}>
                {userDetail ? <>
                    <div className='mb-2'><span className='text-blue-500 text-base mr-2 font-bold'>Tên người dùng: </span>{userDetail.fullname}</div>
                    <div className='mb-2'><span className='text-blue-500 text-base mr-2 font-bold'>Email: </span>{userDetail.email}</div>
                    <div className='mb-2'><span className='text-blue-500 text-base mr-2 font-bold'>Giới tính: </span>{userDetail.gender ? (userDetail.gender === "MALE" ? 'Nam' : 'Nữ') : 'Chưa thiết lập'}</div>
                    <div className='mb-2'><span className='text-blue-500 text-base mr-2 font-bold'>Vai trò: </span>{userDetail.roleName}</div>
                    <div className='mb-2'><span className='text-blue-500 text-base mr-2 font-bold'>Ngày sinh: </span>{userDetail.dob == null ? 'Chưa cung cấp ngày sinh' : userDetail.dob}</div>
                    <div className='mb-2'><span className='text-blue-500 text-base mr-2 font-bold'>Loại tài khoản: </span>{userDetail.accountType}</div>
                    <div className='mb-2'><span className='text-blue-500 text-base mr-2 font-bold'>Ngày tạo: </span>{userDetail.createdAt == null ? 'Không có dữ liệu' : userDetail.createdAt}</div>
                    <div className='mb-2'><span className='text-blue-500 text-base mr-2 font-bold'>Ngày cập nhật: </span>{userDetail.updatedAt == null ? 'Không có dữ liệu' : userDetail.updatedAt}</div>


                    <div className='mb-2'><span className='text-blue-500 text-base mr-2 font-bold'>Ảnh:</span> </div><br />
                    <div className="flex justify-center items-center">
                        <div className="relative">
                            <img className="h-[150px] border-2 rounded-xl shadow-[4px_4px_4px_rgba(0,0,0,0.2)]"
                                src={`${storageUrl}/avatar/${userDetail.avatar}`}
                                //@ts-ignore
                                onError={(e) => { e.target.src = `${storageUrl}/other/notfound.png`; }}
                                alt={userDetail.fullname}
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

export default ViewPurchaserDetail;
