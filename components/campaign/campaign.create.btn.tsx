'use client'

import { validCampaignName, validDescription, validReduceValue } from "@/helper/create.campaign.helper";
import { sendRequest } from "@/utils/fetch.api";
import { apiUrl, storageUrl } from "@/utils/url";
import { EyeOutlined, PlusOutlined, SyncOutlined, UploadOutlined, WarningOutlined } from "@ant-design/icons";
import { Avatar, Button, Col, DatePicker, Image, Input, Modal, notification, Row, Select, Spin, Tooltip } from "antd";
import TextArea from "antd/es/input/TextArea";
import dayjs, { Dayjs } from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import { ChangeEvent, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(isSameOrBefore);
const initState: ErrorResponse = {
    error: false,
    value: ''
}
const CampaignCreateBtn = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isPreviewVisible, setIsPreviewVisible] = useState(false);
    const [isRotated, setIsRotated] = useState(false);
    const [emptyDate, setEmptyDate] = useState("");
    const [errThumbnail, setErrThumbnail] = useState("");
    const [urlThumbnail, setUrlThumbnail] = useState("");
    const [loading, setLoading] = useState(false);
    const [campaigntName, setCampaigntName] = useState<ErrorResponse>(initState);
    const [description, setDescription] = useState<ErrorResponse>(initState);
    const [reduceValue, setReduceValue] = useState<ErrorResponse>(initState);
    const { RangePicker } = DatePicker;

    const [global, setGlobal] = useState<"ALL" | "COURSES">("ALL");
    const [dates, setDates] = useState<[string | null, string | null] | null>(null);
    const router = useRouter()
    const [allCourse, setAllCourse] = useState<{ value: number, label: string }[]>([])
    const [applymentType, setApplymentType] = useState<{ error: boolean, tags: number[] }>({ error: false, tags: [] });
    const { data: session, status } = useSession();

    const showModal = () => {
        setIsRotated(!isRotated);
        setIsModalOpen(true);
    };

    const handleOnChangeGlobal = (value: string) => {
        setGlobal(value as "ALL" | "COURSES");
    }

    const handleChange = (values: [Dayjs | null, Dayjs | null] | null) => {
        if (values && values[0] && values[1]) {
            setDates([
                values[0].format("YYYY-MM-DD HH:mm:ss"),
                values[1].format("YYYY-MM-DD HH:mm:ss"),
            ]);
        } else {
            setDates(null);
        }
    };

    const handleOk = async () => {
        setLoading(true);

        setTimeout(async () => {

            const isCampaignNameValid = validCampaignName(campaigntName, setCampaigntName);
            const isReduceValueValid = validReduceValue(reduceValue, setReduceValue);
            const isDescriptionValid = validDescription(description, setDescription);

            if (!isCampaignNameValid || !isDescriptionValid || !isReduceValueValid || dates === null || urlThumbnail === "") {
                setErrThumbnail("Ảnh không được để rỗng!")
                if (urlThumbnail !== "") {
                    setErrThumbnail("")
                    setLoading(false);
                    return
                }
                setEmptyDate("Thời gian chiến dịch không được bỏ trống!")
                if (dates) {
                    setEmptyDate("")
                    setLoading(false);
                    return
                }
                setLoading(false);
                return
            }


            if (campaigntName.value.split(/\s+/).length > 100) {
                notification.error({
                    message: "Thất bại",
                    description: "Tên chiến dịch không được quá 100 từ!",
                    showProgress: true
                });
                setLoading(false)
                return
            }

            if (description.value.split(/\s+/).length > 1000) {
                notification.error({
                    message: "Thất bại",
                    description: "Mô tả không được quá 1000 từ!",
                    showProgress: true
                });
                setLoading(false)
                return
            }

            if (global !== 'ALL' && applymentType.tags.length === 0) {
                setApplymentType(prev => ({ ...prev, error: true }))
                setLoading(false)
                return;
            }

            if ((Number(reduceValue?.value) > 99 || Number(reduceValue?.value) < 0)) {
                setLoading(false)
                return;
            }

            const campaignRequest: CampaignRequest = {
                campaignName: campaigntName.value.trim(),
                campaignDescription: description.value.trim(),
                thumbnailUrl: urlThumbnail,
                discountRange: global,
                startTime: dates[0]!,
                endTime: dates[1]!,
                discountPercentage: Number(reduceValue.value)
            }

            if (global !== "ALL") {
                campaignRequest.courseIds = applymentType.tags
            }

            if (dates && dates[1] && dayjs(dates[1]).isSameOrBefore(dayjs())) {
                setLoading(false);
                return;
            }

            const createResponse = await sendRequest<ApiResponse<CampaignResponse>>({
                url: `${apiUrl}/campaigns`,
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${session?.accessToken}`,
                    'Content-Type': 'application/json'
                },
                body: campaignRequest
            });

            if (createResponse.status === 200) {
                handleCancel();
                router.refresh();
                notification.success({
                    message: "Thành công",
                    description: createResponse.message.toString(),
                    showProgress: true
                });
            } else {
                notification.error({
                    message: "Thất bại",
                    description: createResponse.message.toString(),
                    showProgress: true
                });
            }
            setLoading(false);
        }, 500);

    };

    const handleCancel = () => {
        setCampaigntName(initState);
        setDescription(initState);
        setReduceValue(initState);
        setIsModalOpen(false);
        setErrThumbnail("");
        setUrlThumbnail("");
        setEmptyDate("");
        setDates(null);
        setApplymentType({ error: false, tags: [] })
        setGlobal("ALL")
    };

    const handleUploadFile = async (e: ChangeEvent<HTMLInputElement>) => {
        setErrThumbnail("")
        if (e.target.files && e.target.files[0]) {
            const formData = new FormData();
            formData.set('file', e.target.files[0]);
            formData.set('folder', 'campaign');

            const imageResponse = await sendRequest<ApiResponse<string>>({
                url: `${apiUrl}/subjects/thumbnail`,
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${session?.accessToken}`,
                },
                body: formData
            });

            if (imageResponse.status === 200) {
                setUrlThumbnail(imageResponse.data)

            } else {
                setErrThumbnail(imageResponse.message.toString())
            }
        }
    }

    useEffect(() => {

        const getDataUser = async () => {
            const dataRes = await sendRequest<ApiResponse<CourseResponse[]>>({
                url: `${apiUrl}/courses/all-notin-campaign`,
                method: 'GET',
                headers: { 'content-type': 'application/json' },
            });

            const courses = Array.isArray(dataRes?.data) ? dataRes.data.map((course: CourseResponse) => ({
                key: course.courseId,
                value: course.courseId,
                label: course.courseName,
            })) : [];

            setAllCourse(courses);
        };

        getDataUser();
    }, [global]);

    return (
        <>
            <div className="flex justify-between items-center mb-4 px-6">
                <div className="mt-[-11vh] ml-[140vh]">
                    <Button
                        type="primary"
                        onClick={showModal}
                        className="w-fit !pt-2 !pb-2"
                        icon={
                            <PlusOutlined
                                className={`transition-transform duration-300 ${isRotated ? 'rotate-180' : ''}`}
                            />
                        }
                    >
                        Tạo mới
                    </Button>
                </div>

            </div>
            <Modal
                title="Tạo chiến dịch"
                open={isModalOpen}
                footer={null}
                onCancel={handleCancel}
                width='50%'
            >
                <Spin spinning={loading}>
                    <Row gutter={24} className="mb-2">
                        <span className="text-red-500 mr-2">*</span>Tên chiến dịch:
                        <Input
                            status={campaigntName.error ? 'error' : ''}
                            className="mt-1"
                            placeholder="Nhập tên chiến dịch"
                            allowClear
                            value={campaigntName.value}
                            onChange={(e) => {
                                setCampaigntName({
                                    ...campaigntName,
                                    value: e.target.value,
                                    error: false
                                })

                            }}

                        />
                        {campaigntName.error && (
                            <p className='text-red-500 text-sm ml-2 flex items-center gap-x-1'>
                                <WarningOutlined />
                                {campaigntName.message}
                            </p>
                        )}
                    </Row>

                    <Row gutter={24} className="mb-2">
                        <span className="text-red-500 mr-2">*</span>Mô tả:
                        <TextArea
                            status={description.error ? 'error' : ''}
                            className="mt-1 h-[15vh]"
                            placeholder="Nhập mô tả chiến dịch"
                            allowClear
                            value={description.value}
                            onChange={(e) => {
                                setDescription({
                                    ...description,
                                    value: e.target.value,
                                    error: false
                                })

                            }}
                        />
                        {description.error && (
                            <p className='text-red-500 text-sm ml-2 flex items-center gap-x-1'>
                                <WarningOutlined />
                                {description.message}
                            </p>
                        )}
                    </Row>

                    <Row gutter={24} className="mb-2">
                        <span className="text-red-500 mr-2">*</span>Phần trăm giảm giá:
                        <Input
                            status={reduceValue.error ? 'error' : ''}
                            className="mt-1"
                            placeholder="Nhập phần trăm giảm giá"
                            value={reduceValue.value}
                            suffix={'%'}
                            onChange={(e) => {
                                setReduceValue({
                                    ...reduceValue,
                                    value: e.target.value,
                                    error: false
                                })
                            }}
                        />

                        {(Number(reduceValue?.value) > 99 || Number(reduceValue?.value) < 0) && (
                            <p className='text-red-500 text-sm ml-2 flex items-center gap-x-1'>
                                <WarningOutlined />
                                Phần trăm giảm giá phải trong khoảng từ 0% đến 99%
                            </p>
                        )}

                    </Row>

                    <Row gutter={24} className="mb-2">
                        <Col span={24} className="!p-0">
                            <span className="text-red-500 mr-2">*</span>Thời gian diễn ra:
                            <RangePicker
                                showTime
                                placeholder={['Ngày bắt đầu', 'Ngày kết thúc']}
                                value={dates ? [dates[0] ? dayjs(dates[0]) : null, dates[1] ? dayjs(dates[1]) : null] : null}
                                onChange={handleChange}
                                className={`${emptyDate !== "" ? "!border-red-500 w-full" : " w-full"}`}
                            />
                        </Col>


                        {emptyDate !== "" && !dates && (
                            <p className='text-red-500 text-sm ml-2 flex items-center gap-x-1'>
                                <WarningOutlined />
                                {emptyDate}
                            </p>
                        )}

                        {dates && dates[1] && dayjs(dates[1]).isSameOrBefore(dayjs()) && (
                            <p className='text-red-500 text-sm ml-2 flex items-center gap-x-1'>
                                <WarningOutlined />
                                Không được để thời gian kết thúc bé hơn thời gian hiện tại
                            </p>
                        )}

                    </Row>


                    <Row gutter={24} className="mb-2">
                        <Col span={24} className="!p-0">
                            <span className="text-red-500 mr-2">*</span>Hình thức:
                            <Select
                                value={global}
                                className="w-full"
                                onChange={handleOnChangeGlobal}
                                options={[
                                    { value: "ALL", label: "Tất cả khóa học chưa được áp dụng chiến dịch" },
                                    { value: "COURSES", label: "Giới hạn khóa học" },
                                ]}
                            />
                        </Col>
                    </Row>

                    {global === 'COURSES' && (
                        <Row gutter={24} className="mb-2">
                            <Col span={24}>
                                <p><span className='text-red-600 mr-2'>*</span>Khóa học:</p>
                                <Select
                                    className={`${applymentType.error && applymentType.tags.length === 0 ? "!border-red-600 !border !rounded-md" : ""}`}
                                    value={applymentType.tags.map(String)}
                                    mode="tags"
                                    style={{ width: "100%" }}
                                    placeholder="Nhập tên khóa học"
                                    onChange={(value) => setApplymentType({
                                        ...applymentType,
                                        tags: value.map(Number),
                                    })}
                                    filterOption={(input, option) =>
                                        String(option?.label ?? "").toLowerCase().includes(input.toLowerCase())
                                    }
                                    notFoundContent="Không có khóa học nào chưa được áp dụng chiến dịch!"
                                    options={allCourse.map(course => ({
                                        value: String(course.value),
                                        label: course.label,
                                    }))} />
                                {applymentType.error === true && applymentType.tags.length === 0 && (
                                    <p className="text-red-600 text-sm ml-2 flex items-center gap-x-1">
                                        <WarningOutlined />
                                        Vui lòng thêm khóa học áp dụng chiến dịch
                                    </p>
                                )}
                            </Col>
                        </Row>
                    )}

                    <Row gutter={24} className="mb-2">
                        <Col span={24}>
                            <span className="text-red-500 mr-2">*</span>Ảnh:
                            <div>
                                {urlThumbnail === "" ? (
                                    <div className={`${errThumbnail !== "" ? "border-red-500 border-2 w-fit rounded-lg " : "relative w-fit"}`}>
                                        <Avatar
                                            shape="square"
                                            size={140}
                                            icon={<PlusOutlined />}
                                            alt="avatar"
                                        />
                                        <input
                                            type="file"
                                            onChange={handleUploadFile}
                                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                            style={{ maxWidth: "120px", maxHeight: "120px" }}
                                            title="Chưa chọn file"
                                        />
                                    </div>

                                ) : (
                                    <div className="flex items-end">
                                        <div className="h-[120px] w-[120px]">
                                            <Image
                                                className="h-full w-full object-contain"
                                                width="100%"
                                                height="100%"
                                                preview={{
                                                    visible: isPreviewVisible,
                                                    mask: <span><EyeOutlined className='mr-2' />Xem</span>,
                                                    onVisibleChange: (visible) => setIsPreviewVisible(visible),
                                                }}
                                                src={`${storageUrl}/campaign/${urlThumbnail}`}
                                                alt="Preview"
                                            />
                                        </div>

                                        <Tooltip title='Thay đổi ảnh' color="blue" placement="topLeft">
                                            <UploadOutlined
                                                style={{ color: 'blue' }}
                                                className="text-lg ml-6 cursor-pointer"
                                                onClick={() => document.getElementById("chooseFile")?.click()}
                                            />
                                        </Tooltip>


                                        <input
                                            type="file"
                                            id="chooseFile"
                                            onChange={handleUploadFile}
                                            className="!hidden"
                                        />
                                    </div>

                                )}
                            </div>
                            {errThumbnail !== "" && (
                                <p className='text-red-500 text-sm ml-2 flex items-center gap-x-1'>
                                    <WarningOutlined />
                                    {errThumbnail}
                                </p>
                            )}
                        </Col>

                    </Row>

                    <div className="flex justify-end mt-5">
                        <Button className="mr-4" onClick={() => handleCancel()}>Hủy</Button>
                        <Button loading={loading} type="primary" onClick={() => handleOk()}>Tạo</Button>
                    </div>
                </Spin >

            </Modal >
        </>
    );
};

export default CampaignCreateBtn;
