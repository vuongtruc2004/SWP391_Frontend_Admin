import { formatDate } from '@/helper/create.blog.helper';
import { Avatar, Divider, Rate } from 'antd'
import React from 'react'

const SingleCourseRate = (props: {
    rate: RateResponse;
    index: number;
    avatarSource: string;
}) => {
    const { rate, index, avatarSource } = props
    return (
        <>
            <div className='py-3'>
                <div className='flex items-center gap-x-3 justify-between pr-3'>
                    <div className='flex items-center gap-x-3'>
                        <Avatar src={avatarSource} style={{
                            width: '40px',
                            height: '40px'
                        }}> {rate?.user?.fullname.charAt(0).toUpperCase()}</Avatar>
                        <div>
                            <p className="font-semibold line-clamp-1 text-sm">{rate?.user?.fullname}</p>
                            <p className="text-sm text-gray-600">{formatDate(rate.updatedAt)}</p>
                        </div>
                    </div>
                </div>
                <p className="text-gray-700 mt-3 line-clamp-3">{rate.content}</p>
                <div className='flex gap-3'>
                    <p className="flex items-center gap-x-1 mt-1 ml-1 text-[17px] text-gray-600">Đã đánh giá</p>
                    <Rate disabled defaultValue={rate.stars} style={{ fontSize: '20px', alignSelf: 'center', paddingTop: '5px' }} />
                </div>
            </div>
            <Divider />
        </>
    )
}

export default SingleCourseRate
