'use client'
import { isValidCouponCode, isValidCouponDescription, isValidCouponName, isValidDiscountValue, isValidMaxAmount, isValidMaxUsed, isValidMinOrderValue } from '@/helper/create.coupon.helper';
import { sendRequest } from '@/utils/fetch.api';
import { apiUrl } from '@/utils/url';
import { WarningOutlined } from '@ant-design/icons';
import '@ant-design/v5-patch-for-react-19';
import { Button, Checkbox, DatePicker, Input, Modal, notification, Select, Space } from 'antd';
import TextArea from 'antd/es/input/TextArea';
import dayjs from 'dayjs';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';


const initState: ErrorResponse = {
    error: false,
    value: ''
}
const UpdateCouponForm = (props: {
    editingCoupon: CouponResponse | null;
    setEditingCoupon: React.Dispatch<React.SetStateAction<CouponResponse | null>>;
    openEditForm: boolean;
    setOpenEditForm: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
    const { RangePicker } = DatePicker;
    const { editingCoupon, setEditingCoupon, openEditForm, setOpenEditForm } = props;
    const CheckboxGroup = Checkbox.Group;
    const [emptySubject, setEmptySubject] = useState("");
    const [couponName, setCouponName] = useState<ErrorResponse>(initState);
    const [couponCode, setCouponCode] = useState<ErrorResponse>(initState);
    const [maxUses, setMaxUses] = useState<ErrorResponse>(initState);
    const [couponDescription, setDescription] = useState<ErrorResponse>(initState);
    const { data: session, status } = useSession();
    const [discountValue, setDiscountValue] = useState<ErrorResponse>(initState);
    const [minOrderValue, setMinOrderValue] = useState<ErrorResponse>(initState);
    const [maxDiscountAmount, setMaxDiscountAmount] = useState<ErrorResponse>(initState);
    const [courses, setCourses] = useState<string[]>([]);
    const [discountType, setDiscountType] = useState('FIXED');
    const [startTime, setStartTime] = useState<ErrorResponse>(initState);
    const [endTime, setEndTime] = useState<ErrorResponse>(initState);
    const [selectedCourses, setSelectedCourses] = useState<string[]>();
    const [selectedRange, setSelectedRange] = useState('ALL');
    const [errorMessage, setErrorMessage] = useState("");
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const [emptyDate, setEmptyDate] = useState("");
    const [emptyCourse, setEmptyCourse] = useState("");

    useEffect(() => {
        if (editingCoupon?.discountType) {
            setDiscountType(editingCoupon.discountType);
        }
    }, [editingCoupon]);

    useEffect(() => {
        if (editingCoupon?.startTime && editingCoupon?.endTime) {
            setEndTime(editingCoupon.endTime);
            setStartTime(editingCoupon.startTime);
        }
    }, [editingCoupon]);
    useEffect(() => {
        if (selectedRange === 'COURSES' && Array.isArray(editingCoupon?.courseName)) {
            setSelectedCourses(editingCoupon.courseName);
        }
    }, [selectedRange, editingCoupon]);

    useEffect(() => {
        if (editingCoupon) {
            setCouponName({
                error: false,
                value: editingCoupon.couponName
            });
            setCouponCode({
                error: false,
                value: editingCoupon.couponCode
            });
            setMaxUses({
                error: false,
                value: editingCoupon?.maxUses?.toString()
            });
            setDescription({
                error: false,
                value: editingCoupon.couponDescription
            });
            setDiscountValue({
                error: false,
                value: editingCoupon.discountValue?.toString()
            })
            setMinOrderValue({
                error: false,
                value: editingCoupon.minOrderValue?.toString()
            })
            setMaxDiscountAmount({
                error: false,
                value: editingCoupon.maxDiscountAmount?.toString()
            })
            setEndTime({
                error: false,
                value: editingCoupon.endTime
            })
            setStartTime({
                error: false,
                value: editingCoupon.startTime
            })

        }

    }, [editingCoupon]);
    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const response = await fetch(`${apiUrl}/courses/all-inpagination`);
                if (response.ok) {
                    const data = await response.json();
                    if (Array.isArray(data.data) && data.data) {
                        setCourses(data.data.map((course: { courseName: string }) => course.courseName));
                    } else {
                        console.log("No data")
                    }
                } else {
                    console.error("API fetch failed");
                }
            } catch (error) {
                console.error("Error fetching subjects:", error);
            }
        };
        fetchCourses();
    }, []);

    const handleDateChange = (dates: any, dateStrings: any) => {
        if (dates) {
            setStartTime({ value: dayjs(dates[0]).format('YYYY-MM-DD HH:mm:ss'), error: false });
            setEndTime({ value: dayjs(dates[1]).format('YYYY-MM-DD HH:mm:ss'), error: false });
        }
    };

    const handleOk = async () => {
        const isValidName = isValidCouponName(couponName, setCouponName);
        const isValidCode = isValidCouponCode(couponCode, setCouponCode);
        const validMaxUsed = isValidMaxUsed(maxUses, setMaxUses);
        const isValidDescription = isValidCouponDescription(couponDescription, setDescription);
        const isValidOrderValue = isValidMinOrderValue(minOrderValue, setMinOrderValue);
        const isValidMax = isValidMaxAmount(maxDiscountAmount, setMaxDiscountAmount);
        const isValidDisValue = isValidDiscountValue(minOrderValue, discountType, discountValue, setDiscountValue);
        let checkAll = true;
        if (!isValidName || !isValidCode || !validMaxUsed || !isValidDescription || !isValidOrderValue || !isValidMax || !isValidDisValue
        ) {
            checkAll = false;
        }
        if (!selectedCourses || selectedCourses.length === 0) {
            if (selectedRange === 'COURSES') {
                setEmptyCourse("Vui lòng chọn ít nhất 1 khoá học!");
                checkAll = false;
            }
        }
        if (!startTime.value && !endTime.value) {
            setEmptyDate("Ngày áp dụng không để rỗng!")
            checkAll = false;
        }
        if (!checkAll) return;


        const couponRequest: CouponRequest = {
            couponId: editingCoupon?.couponId,
            couponName: couponName.value || "",
            couponDescription: couponDescription.value || "",
            couponCode: couponCode.value || "",
            discountType: discountType || "",
            discountValue: Number(discountValue.value || 0),
            maxDiscountAmount: Number(maxDiscountAmount.value || 0),
            minOrderValue: Number(minOrderValue.value || 0),
            maxUses: Number(maxUses.value || 0),
            startTime: startTime.value,
            endTime: endTime.value,
            courses: selectedCourses!,
        };
        const createResponse = await sendRequest<ApiResponse<CouponResponse>>({
            url: `${apiUrl}/coupons`,
            method: 'PUT',
            headers: {
                Authorization: `Bearer ${session?.accessToken}`,
                "Content-Type": "application/json"
            },
            body: couponRequest
        });
        if (createResponse.status === 200) {
            handleCancel();
            router.refresh();
            notification.success({
                message: "Thành công",
                description: createResponse.message.toString(),
            });
        } else {
            setErrorMessage(createResponse.message.toString());
            notification.error({
                message: "Thất bại",
                description: createResponse.message.toString(),
            });
        }
        setLoading(false);

    };


    const handleCancel = () => {
        setEditingCoupon(null);
        setOpenEditForm(false);
        setEmptySubject("");
    };

    const handleRangeChange = (value: any) => {
        setSelectedRange(value);
        if (value !== 'COURSES') {
            setSelectedCourses([]);
        }
    };
    const handleCourseChange = (selectedValues: any) => {
        setSelectedCourses(selectedValues);
        if (selectedValues.length === 0) {
            setEmptyCourse("Bạn chưa chọn khoá học nào");
        } else {
            setEmptyCourse("");
        }
    };
    return (
        <Modal
            title={
                <div style={{ fontSize: '24px', textAlign: 'center', width: '100%', display: 'block' }}>
                    Cập nhật coupon
                </div>
            }
            open={openEditForm}
            footer={null}
            width={700}
            onCancel={handleCancel}
        >
            <div>
                <span className="text-red-500 mr-2">*</span>
                <span className="text-lg">Tên coupon:</span>
                <Input
                    status={couponName.error ? 'error' : ''}
                    className="mt-1 mb-3"
                    placeholder="Nhập tên coupon"
                    allowClear
                    value={couponName.value}
                    onChange={(e) => setCouponName({ ...couponName, value: e.target.value, error: false })}
                />
                {couponName.error && (
                    <p className='text-red-500 text-sm ml-2 flex items-center gap-x-1'>
                        <WarningOutlined />
                        {couponName.message}
                    </p>
                )}
            </div>


            <div className="flex items-center space-x-4">
                <div className="flex-1">
                    <span className="text-red-500 mr-2">*</span>
                    <span className="text-lg">Mã coupon:</span>
                    <Input
                        status={couponCode.error ? 'error' : ''}
                        className="mt-1 mb-3"
                        placeholder="Nhập mã coupon"
                        allowClear
                        value={couponCode.value}
                        onChange={(e) => setCouponCode({ ...couponCode, value: e.target.value, error: false })}
                        suffix={
                            <span
                                className={`text-sm ${couponCode.value.length > 5 ? 'text-red-500' : 'text-gray-500'}`}
                            >
                                {couponCode.value.length}/5
                            </span>
                        }
                    />
                    {couponCode.error && (
                        <p className='text-red-500 text-sm ml-2 flex items-center gap-x-1'>
                            <WarningOutlined />
                            {couponCode.message}
                        </p>
                    )}

                </div>

                <div className="flex-1">
                    <span className="text-red-500 mr-2">*</span>
                    <span className="text-lg">Số lượt dùng tối đa:</span>
                    <Input
                        status={maxUses.error ? 'error' : ''}
                        className="mt-1 mb-3"
                        placeholder="Nhập số lượng coupon"
                        allowClear
                        value={maxUses.value}
                        onChange={(e) => setMaxUses({ ...maxUses, value: e.target.value, error: false })}
                    />
                    {maxUses.error && (
                        <p className='text-red-500 text-sm ml-2 flex items-center gap-x-1'>
                            <WarningOutlined />
                            {maxUses.message}
                        </p>
                    )}
                </div>
            </div>

            <div>
                <span className="text-red-500 mr-2">*</span>
                <span className="text-lg">Thời gian áp dụng:</span>
                <div className="mt-2">
                    <Space direction="vertical" size={12}>
                        <RangePicker
                            showTime
                            placeholder={['Ngày bắt đầu', 'Ngày kết thúc']}
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
                            value={editingCoupon ? [dayjs(editingCoupon.startTime), dayjs(editingCoupon.endTime)] : null}
                            onChange={handleDateChange}
                        />
                    </Space>
                </div>
                {emptyDate !== "" && (
                    <p className='text-red-500 text-sm ml-2 flex items-center gap-x-1'>
                        <WarningOutlined />
                        {emptyDate}
                    </p>
                )}
            </div>



            <div>
                <span className="text-red-500 mr-2">*</span>
                <span className="text-lg ">Mô tả:</span>
                <TextArea
                    status={couponDescription.error ? 'error' : ''}
                    className="mt-1 mb-3"
                    placeholder="Nhập mô tả coupon"
                    allowClear
                    value={couponDescription.value}
                    onChange={(e) => setDescription({ ...couponDescription, value: e.target.value, error: false })}
                />
                {couponDescription.error && (
                    <p className='text-red-500 text-sm ml-2 flex items-center gap-x-1'>
                        <WarningOutlined />
                        {couponDescription.message}
                    </p>
                )}
            </div>

            <div className="flex items-center gap-x-4">

                <div className="flex-1">
                    <span className="text-red-500 mr-2">*</span>
                    <span className="text-lg">Hình thức giảm giá:</span>
                    <Select
                        placeholder="Chọn hình thức giảm giá"
                        loading={loading}
                        style={{
                            width: '100%',
                            border: '1px solid black',
                            borderRadius: '8px',
                        }}
                        value={discountType}
                        onChange={(value) => {
                            setDiscountType(value);
                        }}
                    >
                        <Select.Option key={`fixed`} value="FIXED"
                        >
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                <span>Giảm giá cố định</span>
                            </div>
                        </Select.Option>
                        <Select.Option key={`percentage`} value="PERCENTAGE">
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                <span>Giảm giá theo tỷ lệ phần trăm</span>
                            </div>
                        </Select.Option>
                    </Select>



                </div>
                <div className="flex-1">
                    <span className="text-red-500 mr-2">*</span>
                    <span className="text-lg ">Giá trị giảm:</span>
                    <Input
                        suffix={
                            <span className="text-sm text-gray-500 bg-gray-200 px-2 py-1 rounded">
                                {discountType === 'FIXED' ? "VND" : "%"}
                            </span>
                        }
                        status={discountValue.error ? 'error' : ''}
                        className="mt-1 w-full"
                        placeholder="Nhập giá trị giảm"
                        allowClear
                        value={discountValue.value}
                        onChange={(e) => setDiscountValue({ ...discountValue, value: e.target.value, error: false })}
                    />
                    {discountValue.error && (
                        <p className='text-red-500 text-sm ml-2 flex items-center gap-x-1'>
                            <WarningOutlined />
                            {discountValue.message}
                        </p>
                    )}
                </div>
            </div>
            <div className="flex items-center gap-x-4">
                {/* Áp dụng cho đơn hàng từ */}
                <div className="flex-1">
                    <span className="text-red-500 mr-2">*</span>
                    <span className="text-lg ">Áp dụng cho đơn hàng từ:</span>
                    <Input
                        suffix={
                            <span className="text-sm text-gray-500 bg-gray-200 px-2 py-1 rounded">
                                VND
                            </span>
                        }
                        status={minOrderValue.error ? 'error' : ''}
                        className="mt-1 mb-3"
                        placeholder="Nhập số tiền áp dụng tối thiểu"
                        allowClear
                        value={minOrderValue.value}
                        onChange={(e) => setMinOrderValue({ ...minOrderValue, value: e.target.value, error: false })}
                    />
                    {minOrderValue.error && (
                        <p className='text-red-500 text-sm ml-2 flex items-center gap-x-1'>
                            <WarningOutlined />
                            {minOrderValue.message}
                        </p>
                    )}
                </div>
                <div className="flex-1">
                    <span className="text-lg ">Số tiền giảm giá tối đa:</span>
                    <Input
                        suffix={
                            <span className="text-sm text-gray-500 bg-gray-200 px-2 py-1 rounded">
                                VND
                            </span>
                        }
                        status={maxDiscountAmount.error ? 'error' : ''}
                        className="mt-1 mb-3"
                        placeholder="Nhập số tiền giảm giá tối đa"
                        allowClear
                        value={maxDiscountAmount.value}
                        onChange={(e) => setMaxDiscountAmount({ ...maxDiscountAmount, value: e.target.value, error: false })}
                    />
                    {maxDiscountAmount.error && (
                        <p className='text-red-500 text-sm ml-2 flex items-center gap-x-1'>
                            <WarningOutlined />
                            {maxDiscountAmount.message}
                        </p>
                    )}
                </div>
            </div>
            <div className="flex justify-end mt-5">
                <Button className="mr-4" onClick={() => handleCancel()}>Hủy</Button>
                <Button loading={loading} type="primary" onClick={() => handleOk()}>Tạo</Button>
            </div>

        </Modal >
    )
}

export default UpdateCouponForm