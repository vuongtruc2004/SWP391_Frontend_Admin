'use client'

import { sendRequest } from "@/utils/fetch.api";
import { apiUrl, storageUrl } from "@/utils/url";
import { StarFilled } from "@ant-design/icons";
import { Button, Empty, Pagination, Typography } from "antd";
import { useEffect, useState } from "react";
import SingleCourseRate from "./single.course.rate";

const CourseRate = (props: { courseDetail: CourseDetailsResponse }) => {
    const { courseDetail } = props;
    const [rateCount, setRateCount] = useState<Record<number, number>>({});
    const [listRate, setListRate] = useState<RateResponse[]>([]);
    const [starsFilter, setStarsFilter] = useState<number>(0);
    const [totalPages, setTotalPages] = useState(0);

    const handleStarsFilter = (stars: number) => {
        setStarsFilter(stars);
        setPage(1);
    }

    const [page, setPage] = useState(1);
    useEffect(() => {
        const fetchRatingCounts = async () => {
            const ratingCountsResponse = await sendRequest<ApiResponse<Record<number, number>>>({
                url: `${apiUrl}/rates/levels`,
                queryParams: {
                    courseId: courseDetail.courseId
                }
            });
            if (ratingCountsResponse.status === 200) {
                setRateCount(ratingCountsResponse.data);
            }
        }
        fetchRatingCounts();
    }, []);

    useEffect(() => {
        const fetchRatePage = async () => {
            const ratePageResponse = await sendRequest<ApiResponse<PageDetailsResponse<RateResponse[]>>>({
                url: `${apiUrl}/rates`,
                queryParams: {
                    page: page,
                    size: 5,
                    sort: 'stars,desc',
                    filter: `${starsFilter !== 0 ? `stars : ${starsFilter} and ` : ""}course.courseId : ${courseDetail.courseId}`
                }
            });

            if (ratePageResponse.status === 200) {
                setListRate(ratePageResponse.data.content);
                setPage(ratePageResponse.data.currentPage);
                setTotalPages(ratePageResponse.data.totalPages);
            }
        }
        fetchRatePage();
    }, [page, starsFilter]);
    return (
        <div>
            <div>
                <strong>
                    <StarFilled style={{ color: '#ffb703' }} />
                    {courseDetail.averageRating.toFixed(1)}
                </strong>
                <span> xếp hạng khóa học • </span>
                <strong>
                    {courseDetail.totalRating}
                </strong>
                <span> đánh giá</span>
            </div>
            <div className="mt-3 flex gap-3">
                <Button type={starsFilter === 0 ? 'primary' : undefined} size="middle" onClick={() => handleStarsFilter(0)}>
                    Tất cả
                </Button>
                {Array.from({ length: 5 }).map((_, index) => {
                    const star = 5 - index
                    const count = rateCount[star] || 0
                    return (
                        <Button size="middle" key={star}
                            type={starsFilter === star ? 'primary' : undefined}
                            onClick={() => handleStarsFilter(star)}
                        >{star} sao ({count})</Button>
                    )
                })}
            </div>
            {listRate.length ? (
                <div className='bg-white rounded-lg shadow-[0_0_5px_rgba(0,0,0,0.3)] px-9 py-9 mt-3'>
                    {listRate.map((rate, index) => {
                        const avatarSource = rate?.user?.avatar?.startsWith("http") ?
                            rate?.user?.avatar : `${storageUrl}/avatar/${rate?.user?.avatar}`;
                        return (
                            <SingleCourseRate rate={rate} index={index} avatarSource={avatarSource} key={index} />
                        )
                    })}
                </div>
            ) : (
                <div className="bg-white rounded-lg shadow-[0_0_5px_rgba(0,0,0,0.3)] px-9 py-9 mt-3">
                    <Empty
                        styles={{ image: { height: 60 }, }}
                        style={{
                            marginTop: '30px'
                        }}
                        description={
                            <Typography.Text>
                                Không có đánh giá
                            </Typography.Text>
                        }
                    />
                </div>

            )}
            <Pagination
                align="end"
                current={page}
                total={totalPages * 5} // Số lượng đánh giá thực tế
                pageSize={5} // Số đánh giá trên mỗi trang
                onChange={(newPage) => setPage(newPage)}
                showSizeChanger={false} // Không cho phép chọn số lượng đánh giá trên mỗi trang
                style={{ marginTop: "20px", textAlign: "right" }}
            />

        </div>
    )
}

export default CourseRate
