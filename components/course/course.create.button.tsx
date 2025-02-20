'use client'
import { isValidYouTubeUrl } from "@/helper/create.course.helper";
import { sendRequest } from "@/utils/fetch.api";
import { apiUrl, storageUrl } from "@/utils/url";
import { PlusOutlined, WarningOutlined } from "@ant-design/icons";
import { Button, Checkbox, Input, Modal, notification } from "antd";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { ChangeEvent, useActionState, useEffect, useRef, useState } from "react";
import { validateCreateCourse } from "./action";

const initState: ErrorResponse = {
    error: false,
    value: ''
}
const CourseCreateButton = () => {
    const [subjects, setSubjects] = useState<string[]>([]);
    const [title, setTitle] = useState<ErrorResponse>(initState);
    const [introduction, setIntroduction] = useState<ErrorResponse>(initState);
    const [originPrice, setOriginPrice] = useState<ErrorResponse>(initState);
    const [salePercentPrice, setSalePercentPrice] = useState<ErrorResponse>(initState);
    const [description, setDescription] = useState<ErrorResponse>(initState);
    const [object, setObject] = useState<ErrorResponse>(initState);
    const [lessionName, setLessionName] = useState<ErrorResponse>(initState);
    const [lessionDes, setLessionDes] = useState<ErrorResponse>(initState);
    useEffect(() => {
        const fetchSubjects = async () => {
            try {
                const response = await fetch('http://localhost:8386/api/v1/subjects');
                if (response.ok) {
                    const data = await response.json();
                    console.log(data);
                    if (data.data && Array.isArray(data.data.content)) {
                        setSubjects(data.data.content.map((subject: { subjectName: string }) => subject.subjectName));
                    }
                } else {
                    console.error("API fetch failed");
                }
            } catch (error) {
                console.error("Error fetching subjects:", error);
            }
        };
        fetchSubjects();
    }, []);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const router = useRouter();
    const CheckboxGroup = Checkbox.Group;
    const [checkedList, setCheckedList] = useState<string[]>();

    const { data: session, status } = useSession();

    const inputRef = useRef<HTMLInputElement>(null);
    const formRef = useRef<HTMLFormElement>(null);
    const [thumbnailURL, setThumbnailURL] = useState("");
    const [errorThumbnail, setErrorThumbnail] = useState("");

    const validateCreateCoursePrime = validateCreateCourse.bind(null, setErrorThumbnail);
    const [state, formAction, pending] = useActionState(validateCreateCoursePrime, null);
    const [valid, setValid] = useState({
        introduction: { value: "", error: false }
    });
    const handleCheckIntroduction = (e: any) => {
        const value = e.target.value;
        const isValid = isValidYouTubeUrl(value);
        setValid({
            introduction: {
                value,
                error: !isValid && value.length > 0
            }
        });
    };
    const handleUploadFile = async (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const formData = new FormData();
            formData.set('file', e.target.files[0]);
            formData.set('folder', 'course');

            const imageResponse = await sendRequest<ApiResponse<string>>({
                url: `${apiUrl}/files/image`,
                method: 'POST',
                body: formData
            });

            if (imageResponse.status === 200) {
                setThumbnailURL(imageResponse.data);
                setErrorThumbnail("")
            } else {
                if (inputRef.current) {
                    inputRef.current.value = '';
                }
                setThumbnailURL("");
                setErrorThumbnail(imageResponse.errorMessage);
            }
        }
    }
    useEffect(() => {
        const createCourse = async () => {
            const courseReq: CourseRequest = {
                courseName: state?.courseName.value || "",
                description: state?.description.value || "",
                objectives: state?.objectives.value.split(",") || [],
                thumbnail: thumbnailURL,
                salePrice: Number(state?.salePrice.value || "0"),
                subjects: checkedList || [],
                introduction: state?.introduction.value || "",
                originalPrice: Number(state?.originalPrice.value || "0")
            }
            console.log("Thông tin gửi đến backend: ", courseReq);

            const createResponse = await sendRequest<ApiResponse<CourseResponse>>({
                url: `${apiUrl}/courses`,
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${session?.accessToken}`,
                    "Content-Type": "application/json"
                },
                body: courseReq
            });
            console.log("Thông tin trả về từ backend: ", createResponse);
            setErrorThumbnail("");
            setThumbnailURL("");
            if (createResponse.status === 201) {
                formRef.current?.reset();
                router.refresh();
                notification.success({
                    message: "Thành Công",
                    description: createResponse.message.toString(),
                });
            } else {
                notification.error({
                    message: "Thất Bại",
                    description: createResponse.message.toString(),
                })
            }
        }
        if (state && state.ok && thumbnailURL !== "" && status === "authenticated") {
            createCourse();
        }

    }, [state]);

    const onChange = (list: string[]) => {
        setCheckedList(list);
    };


    console.log(checkedList);
    return (
        <div>
            <div className="flex gap-4" style={{ textAlign: "right" }}>
                <Button
                    type="primary"
                    onClick={() => setIsModalOpen(true)}
                    className="!p-[10px] w-fit ml-[20px]"
                >
                    Tạo mới
                </Button>
            </div>

            <Modal
                open={isModalOpen}
                footer={null}
                className="!w-[50vw]"
                onCancel={() => setIsModalOpen(false)}
            >
                <h1 className="text-center text-2xl font-semibold">Tạo khoá học</h1>
                <form action={formAction} ref={formRef}>
                    <div>
                        <p className="text-base mt-2"><span className="text-red-500 mr-2">*</span>Tên khoá học:</p>
                        <Input
                            status={state?.courseName.error ? 'error' : ''}
                            className="mt-1"
                            placeholder="Nhập tên khoá học"
                            allowClear
                            name="courseName"
                            defaultValue={state?.courseName.value}
                        />
                        {state?.courseName.error && (
                            <p className='text-red-500 text-sm ml-2 flex items-center gap-x-1'>
                                <WarningOutlined />
                                {state.courseName.message}
                            </p>
                        )}
                    </div>
                    <div>
                        <p className="text-base mt-2"><span className="text-red-500 mr-2">*</span>Link giới thiệu khoá học:</p>
                        <Input
                            status={state?.introduction.error ? 'error' : ''}
                            className="mt-1"
                            placeholder="Link giới thiệu khoá học"
                            allowClear
                            name="introduction"
                            defaultValue={state?.introduction.value}
                            onChange={handleCheckIntroduction}
                        />
                        {state?.introduction.error && (
                            <p className='text-red-500 text-sm ml-2 flex items-center gap-x-1'>
                                <WarningOutlined />
                                {state?.introduction.message}
                            </p>
                        )}
                        {valid?.introduction.error && (
                            <p className='text-red-500 text-sm ml-2 flex items-center gap-x-1'>
                                <WarningOutlined />
                                <span className="text-red-500 mt-1 text-sm">Vui lòng nhập URL YouTube hợp lệ!</span>
                            </p>
                        )}

                    </div>
                    <div className="grid grid-cols-2 gap-x-5">
                        <div>
                            <p className="text-base mt-2"><span className="text-red-500 mr-2">*</span>Giá gốc:</p>
                            <Input
                                status={state?.originalPrice.error ? 'error' : ''}
                                className="mt-1"
                                placeholder="Nhập giá gốc khoá học"
                                allowClear
                                name="originalPrice"
                                defaultValue={state?.originalPrice.value}
                            />
                            {state?.originalPrice.error && (
                                <p className='text-red-500 text-sm ml-2 flex items-center gap-x-1'>
                                    <WarningOutlined />
                                    {state?.originalPrice.message}
                                </p>
                            )}
                        </div>
                        <div>
                            <p className="text-base mt-2"><span className="text-red-500 mr-2">*</span>Giá khuyến mãi:</p>
                            <Input
                                status={state?.salePrice.error ? 'error' : ''}
                                className="mt-1"
                                placeholder="Nhập giá khuyến mãi"
                                allowClear
                                name="salePrice"
                                defaultValue={state?.salePrice.value}

                            />
                            {state?.salePrice.error && (
                                <p className='text-red-500 text-sm ml-2 flex items-center gap-x-1'>
                                    <WarningOutlined />
                                    {state?.salePrice.message}
                                </p>
                            )}
                        </div>

                    </div>
                    <div>
                        <p className="text-base mt-2"><span className="text-red-500 mr-2">*</span>Mô tả:</p>
                        <Input
                            status={state?.description.error ? 'error' : ''}
                            className="mt-1"
                            placeholder="Nhập mô tả"
                            allowClear
                            name="description"
                            defaultValue={state?.description.value}

                        />
                        {state?.description.error && (
                            <p className='text-red-500 text-sm ml-2 flex items-center gap-x-1'>
                                <WarningOutlined />
                                {state?.description.message}
                            </p>
                        )}
                    </div>
                    <div>
                        <p className="text-base mt-2"><span className="text-red-500 mr-2">*</span>Mục tiêu:</p>
                        <Input
                            status={state?.objectives.error ? 'error' : ''}
                            className="mt-1"
                            placeholder="Nhập mục tiêu khoá học"
                            allowClear
                            name="objectives"
                            defaultValue={state?.objectives.value}

                        />
                        {state?.objectives.error && (
                            <p className='text-red-500 text-sm ml-2 flex items-center gap-x-1'>
                                <WarningOutlined />
                                {state?.objectives.message}
                            </p>
                        )}
                    </div>

                    <div>
                        <p className="text-base mt-2"><span className="text-red-500 mr-2">*</span>Công nghệ sử dụng trong khoá học:</p>
                        <CheckboxGroup
                            options={subjects.map((subject) => ({
                                label: subject,
                                value: subject,
                            }))}
                            value={checkedList}
                            onChange={onChange}
                            style={{
                                display: 'flex',
                                flexWrap: 'wrap',
                                gap: '8px',
                            }}
                        />
                        {
                            checkedList?.length === 0 && state && (
                                <p className='text-red-500 text-sm ml-2 flex items-center gap-x-1'>
                                    <WarningOutlined />
                                    <span className="mt-1 text-sm">Công nghệ sử dụng không được bỏ trống!</span>
                                </p>
                            )
                        }
                    </div>

                    <div>
                        <p className="text-base mt-2"><span className="text-red-500 mr-2 mb-1">*</span>Ảnh bìa khoá học:</p>
                        <div className="relative w-full">
                            <div className={`flex items-center justify-center w-full h-[300px] ${thumbnailURL === "" && "border border-dashed"} ${errorThumbnail ? "border-red-500" : "border-blue-500"} rounded-lg cursor-pointer`} style={{
                                backgroundColor: 'white',
                                backgroundImage: `${thumbnailURL !== "" ? `url(${storageUrl}/course/${thumbnailURL})` : 'none'}`,
                                backgroundPosition: 'center',
                                backgroundRepeat: 'no-repeat',
                                backgroundSize: 'cover'
                            }}>
                                {thumbnailURL === "" && <PlusOutlined style={{ fontSize: '2.5rem', color: '#adb5bd ' }} />}
                            </div>
                            <input
                                type="file"
                                name="thumbnail"
                                onChange={handleUploadFile}
                                ref={inputRef}
                                style={{
                                    position: 'absolute',
                                    bottom: 0,
                                    left: 0,
                                    whiteSpace: 'nowrap',
                                    width: '100%',
                                    height: '100%',
                                    opacity: 0,
                                    cursor: 'pointer'
                                }}
                            />
                        </div>
                        {errorThumbnail && (
                            <p className='text-red-500 text-sm ml-2 flex items-center gap-x-1'>
                                <WarningOutlined />
                                {errorThumbnail}
                            </p>
                        )}
                    </div>

                    <div className="flex justify-end mt-5">
                        <Button className="mr-4" onClick={() => setIsModalOpen(false)}>Hủy</Button>
                        <Button loading={pending} type="primary" htmlType="submit">Tạo</Button>
                    </div>
                </form>
            </Modal >
        </div >
    )
}

export default CourseCreateButton
