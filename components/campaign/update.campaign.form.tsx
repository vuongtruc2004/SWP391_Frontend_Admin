'use client'
import { ChangeEvent, useActionState, useEffect, useRef, useState } from 'react';
import { Avatar, Button, Col, DatePicker, Image, Input, Modal, notification, Row, Select, Spin, Tooltip } from 'antd';
import { EyeOutlined, SyncOutlined, UploadOutlined, WarningOutlined } from '@ant-design/icons';
import { useRouter } from 'next/navigation';
import '@ant-design/v5-patch-for-react-19';
import { sendRequest } from '@/utils/fetch.api';
import { apiUrl, storageUrl } from '@/utils/url';
import { validCampaignName, validDescription, validReduceValue } from '@/helper/create.campaign.helper';
import TextArea from 'antd/es/input/TextArea';
import dayjs, { Dayjs } from 'dayjs';


const initState: ErrorResponse = {
    error: false,
    value: ''
}
const UpdateCampaignForm = ({ editingCamnpaign, setEditingCamnpaign, openEditForm, setOpenEditForm }: {
    editingCamnpaign: CampaignResponse | null;
    setEditingCamnpaign: React.Dispatch<React.SetStateAction<CampaignResponse | null>>;
    openEditForm: boolean;
    setOpenEditForm: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
    const [isPreviewVisible, setIsPreviewVisible] = useState(false);
    const [campaignName, setCampaignName] = useState<ErrorResponse>(initState);
    const [description, setDescription] = useState<ErrorResponse>(initState);
    const [reduceValue, setReduceValue] = useState<ErrorResponse>(initState);
    const [errThumbnail, setErrThumbnail] = useState("")
    const [urlThumbnail, setUrlThumbnail] = useState("");
    const [emptyDate, setEmptyDate] = useState("");
    const [global, setGlobal] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(false);
    const router = useRouter();
    const [reduceType, setReduceType] = useState<string>("");
    const [dates, setDates] = useState<[string | null, string | null] | null>(null);
    const { RangePicker } = DatePicker;
    const [applymentType, setApplymentType] = useState<{ error: boolean, tags: number[] }>({ error: false, tags: [] });
    const [allCourse, setAllCourse] = useState<{ value: number, label: string }[]>([])

    useEffect(() => {
        if (editingCamnpaign) {
            setCampaignName({
                error: false,
                value: editingCamnpaign.campaignName
            });
            setDescription({
                error: false,
                value: editingCamnpaign.campaignDescription
            });
            setReduceValue({
                error: false,
                value: String(editingCamnpaign.discountPercentage)
            });


        }
        if (editingCamnpaign?.thumbnail) {
            setUrlThumbnail(editingCamnpaign.thumbnail);
        }
        if (editingCamnpaign?.discountRange) {
            setGlobal(editingCamnpaign.discountRange);
        }
        if (editingCamnpaign?.discountType) {
            setReduceType(editingCamnpaign.discountType);
        }
        if (editingCamnpaign?.startTime && editingCamnpaign?.endTime) {
            setDates([editingCamnpaign.startTime, editingCamnpaign.endTime]);
        }

    }, [editingCamnpaign]);

    const handleOnChangeGlobal = (value: string) => {
        setGlobal(value);
    }

    const handleOnChangeReduceType = (value: string) => {
        setReduceType(value);
    }
    const handleChange = (values: [Dayjs | null, Dayjs | null] | null) => {
        if (values && values[0] && values[1]) {
            setDates([
                values[0].format("YYYY-MM-DDTHH:mm:ssZ"),
                values[1].format("YYYY-MM-DDTHH:mm:ssZ"),
            ]);
        } else {
            setDates(null);
        }
    };

    const handleOk = async () => {
        setLoading(true);

        setTimeout(async () => {
            const isCampaignNameValid = validCampaignName(campaignName, setCampaignName);
            const isDescriptionValid = validDescription(description, setDescription);
            const isReduceValueValid = validReduceValue(reduceValue, setReduceValue);

            if (!isCampaignNameValid || !isDescriptionValid || !isReduceValueValid || dates === null || urlThumbnail === "") {
                setEmptyDate("Thời gian chiến dịch không được bỏ trống!")
                if (dates) {
                    setEmptyDate("")
                    setLoading(false);
                    return
                }
                setLoading(false);
                return
            }

            if (global !== 'ALL' && applymentType.tags.length === 0) {
                setApplymentType(prev => ({ ...prev, error: true }))
                setLoading(false)
                return;
            }

            const campaignRequest: CampaignRequest = {
                campaignId: editingCamnpaign?.campaignId,
                campaignName: campaignName.value.trim(),
                campaignDescription: description.value.trim(),
                thumbnail: urlThumbnail,
                discountType: reduceType,
                discountRange: global,
                startTime: dates?.[0]! ?? null,
                endTime: dates?.[1]! ?? null,
                discountPercentage: Number(reduceValue.value)
            };


            if (global !== "ALL") {
                campaignRequest.courseIds = applymentType.tags
            }

            const updateResponse = await sendRequest<ApiResponse<CampaignResponse>>({
                url: `${apiUrl}/campaigns`,
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: campaignRequest
            });
            console.log(">>>réquest", campaignRequest)

            console.log(">>>ré", updateResponse)

            if (updateResponse.status === 200) {
                handleCancel();
                router.refresh();
                notification.success({
                    message: "Thành công",
                    description: updateResponse.message.toString(),
                    showProgress: true
                });
            } else {
                notification.error({
                    message: "Thất bại",
                    description: updateResponse.message.toString(),
                    showProgress: true
                });
            }
            setLoading(false);
        }, 500);
    };

    const handleCancel = () => {
        setEditingCamnpaign(null)
        setOpenEditForm(false)
        setReduceType("FIXED");
        setUrlThumbnail("");
        setEmptyDate("");
        setDates(null);
        setErrThumbnail("");
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
                headers: {},
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
                url: `${apiUrl}/courses/all-inpagination`,
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
        <Modal title="Cập nhật chiến dịch"
            open={openEditForm}
            footer={null}
            onCancel={handleCancel}
            width='50%'
        >
            <Spin spinning={loading}>
                <Row gutter={24} className="mb-2">
                    <span className="text-red-500 mr-2">*</span>Tên chiến dịch:
                    <Input
                        status={campaignName.error ? 'error' : ''}
                        className="mt-1"
                        placeholder="Nhập tên chiến dịch"
                        allowClear
                        value={campaignName.value}
                        onChange={(e) => {
                            setCampaignName({
                                ...campaignName,
                                value: e.target.value,
                                error: false
                            })

                        }}

                    />
                    {campaignName.error && (
                        <p className='text-red-500 text-sm ml-2 flex items-center gap-x-1'>
                            <WarningOutlined />
                            {campaignName.message}
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
                    <Col span={12} className="!pl-0">
                        <span className="text-red-500 mr-2">*</span>Loại giảm giá:
                        <br />
                        <Select
                            className="w-full !mt-1"
                            onChange={handleOnChangeReduceType}
                            value={reduceType}
                            options={[
                                { value: 'FIXED', label: 'Tiền tươi' },
                                { value: 'PERCENTAGE', label: 'Phần trăm' },
                            ]}
                        />
                    </Col>

                    <Col span={12} className="!p-0">
                        <span className="text-red-500 mr-2">*</span>Giá trị giảm:
                        <Input
                            status={reduceValue.error ? 'error' : ''}
                            className="mt-1"
                            placeholder="Nhập giá trị giảm"
                            suffix={<span>{reduceType === 'FIXED' ? 'VND' : '%'}</span>}
                            value={reduceValue.value}
                            onChange={(e) => {
                                setReduceValue({
                                    ...reduceValue,
                                    value: e.target.value,
                                    error: false
                                })
                            }}
                        />
                        {reduceValue.error && (
                            <p className='text-red-500 text-sm ml-2 flex items-center gap-x-1'>
                                <WarningOutlined />
                                {reduceValue.message}
                            </p>
                        )}

                        {reduceType === 'PERCENTAGE' && (Number(reduceValue?.value) > 100 || Number(reduceValue?.value) < 0) && (
                            <p className='text-red-500 text-sm ml-2 flex items-center gap-x-1'>
                                <WarningOutlined />
                                Phần trăm giảm giá phải trong khoảng từ 0% đến 100%
                            </p>
                        )}

                    </Col>

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
                            disabledDate={(current) => current && current.isBefore(dayjs(), 'day')}
                            disabledTime={(current) => {
                                const now = dayjs();
                                if (!current) return {};
                                if (current.isSame(now, "day")) {
                                    return {
                                        disabledHours: () =>
                                            Array.from({ length: now.hour() }, (_, i) => i),
                                        disabledMinutes: (hour) =>
                                            hour === now.hour()
                                                ? Array.from({ length: now.minute() }, (_, i) => i)
                                                : [],
                                    };
                                }
                                return {};
                            }}
                        />
                    </Col>

                    {emptyDate !== "" && !dates && (
                        <p className='text-red-500 text-sm ml-2 flex items-center gap-x-1'>
                            <WarningOutlined />
                            {emptyDate}
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
                                { value: "ALL", label: "Toàn bộ khóa học" },
                                { value: "COURSES", label: "Giới hạn khóa học" },
                            ]}
                        />
                    </Col>
                </Row>

                {global !== "ALL" && (
                    <Row gutter={24} className="mb-2">
                        <Col span={24}>
                            <p><span className='text-red-600 mr-2'>*</span>Khóa học:</p>
                            <Select
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
                            {applymentType.error === true && (
                                <p className="text-red-600 text-sm ml-2 flex items-center gap-x-1">
                                    <WarningOutlined />
                                    Vui lòng thêm khóa học áp dụng chiến dịch
                                </p>
                            )}
                        </Col>
                    </Row>
                )}

                <Row gutter={24} className="mb-2">
                    <Col span={24} className="!p-0">
                        <span className="text-red-500 mr-2">*</span>Ảnh:
                        <div>
                            <div className="flex items-end w-full">
                                <div className="h-[120px] w-[210px]">
                                    <Image
                                        className="h-full w-full object-contain"
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
                    <Button loading={loading} type="primary" onClick={() => handleOk()}>Cập nhật</Button>
                </div>
            </Spin>

        </Modal>

    )
}

export default UpdateCampaignForm