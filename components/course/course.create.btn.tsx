'use client'

import { validDes, validIntroduction, validOriginPrice } from "@/helper/create.course.helper";
import { validTitle } from "@/helper/create.question.helper";
import { sendRequest } from "@/utils/fetch.api";
import { apiUrl, storageUrl } from "@/utils/url";
import { EyeOutlined, MinusCircleOutlined, PlusCircleOutlined, PlusOutlined, SyncOutlined, WarningOutlined } from "@ant-design/icons";
import { Avatar, Button, Checkbox, Image, Input, Modal, notification, Tooltip } from "antd";
import TextArea from "antd/es/input/TextArea";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { ChangeEvent, useEffect, useRef, useState } from "react";

const initState: ErrorResponse = {
    error: false,
    value: ''
};

const CourseCreateBtn = (props: { coursePageResponse: PageDetailsResponse<CourseResponse[]> }) => {
    const router = useRouter();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isRotated, setIsRotated] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [emptySubject, setEmptySubject] = useState("");
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [loading, setLoading] = useState(false);
    const [title, setTitle] = useState<ErrorResponse>(initState);
    const [introduction, setIntroduction] = useState<ErrorResponse>(initState);
    const [price, setPrice] = useState<ErrorResponse>(initState);
    const [des, setDes] = useState<ErrorResponse>(initState);
    const [objects, setObjects] = useState([{ content: "", empty: true }]);
    const CheckboxGroup = Checkbox.Group;
    const [subjects, setSubjects] = useState<string[]>([]);
    const [checkedList, setCheckedList] = useState<string[]>();
    const [errThumbnail, setErrThumbnail] = useState("");
    const [urlThumbnail, setUrlThumbnail] = useState("");
    const [thumbnail, setThumbnail] = useState("");
    const [isPreviewVisible, setIsPreviewVisible] = useState(false);
    const { data: session, status } = useSession();
    const [titleWordCount, setTitleWordCount] = useState("");
    const fileInputRef = useRef<HTMLInputElement>(null)


    useEffect(() => {
        const fetchSubjects = async () => {
            try {
                const response = await fetch(`${apiUrl}/subjects/all-inpagination`);
                if (response.ok) {
                    const data = await response.json();
                    if (data.data && Array.isArray(data.data)) {
                        setSubjects(data.data.map((subject: { subjectName: string }) => subject.subjectName));
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

    const handleUploadFile = async (e: ChangeEvent<HTMLInputElement>) => {
        setErrThumbnail("")
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
                setUrlThumbnail(imageResponse.data)
            } else {
                setErrThumbnail(imageResponse.message.toString())
            }
        }
    }

    const onChange = (list: string[]) => {
        setCheckedList(list);
    };

    const showModal = () => {
        setIsRotated(!isRotated);
        setIsModalOpen(true);
    };

    const handleOk = async () => {
        setIsSubmitted(true);
        setLoading(true);
        const isTitleValid = validTitle(title, setTitle);
        const isIntroduction = validIntroduction(introduction, setIntroduction);
        const isOriginPrice = validOriginPrice(price, setPrice);
        const isDes = validDes(des, setDes);
        if (!isTitleValid || !isIntroduction || !isOriginPrice || !isDes || !checkedList || checkedList.length === 0 || urlThumbnail === "") {
            setErrThumbnail("Ảnh không được để rỗng!")
            setEmptySubject("Vui lòng chọn ít nhất một lĩnh vực sử dụng trong khóa học!")
            if (checkedList && checkedList.length > 0) {
                setEmptySubject("")
            }
            if (urlThumbnail !== "") {
                setErrThumbnail("")
            }
            setLoading(false);
            return
        }

        if (objects.some(answer => answer.empty)) {
            setLoading(false);
            return;
        }


        const courseRequest: CourseRequest = {
            courseName: title.value,
            description: des.value,
            thumbnail: urlThumbnail,
            objectives: objects.map(obj => obj.content),
            subjects: checkedList,
            price: Number(price.value),
            introduction: introduction.value,
        }

        const createResponse = await sendRequest<ApiResponse<CourseDetailsResponse>>({
            url: `${apiUrl}/courses`,
            method: 'POST',
            headers: {
                Authorization: `Bearer ${session?.accessToken}`,
                "Content-Type": "application/json"
            },
            body: courseRequest
        });

        console.log("Check response", createResponse)

        if (createResponse.status === 201) {
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

    const handleSyncClick = () => {
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
            fileInputRef.current.click();
        }
    };

    const handleCancel = () => {
        setTitle(initState);
        setIntroduction(initState)
        setPrice(initState)
        setDes(initState)
        setIsSubmitted(false)
        setObjects([{ content: "", empty: true }]);
        setIsModalOpen(false);
        setUrlThumbnail("")
        setErrThumbnail("")
        setCheckedList([])
        setEmptySubject("")
    };

    // Thêm câu trả lời mới
    const addAnswer = () => {
        setObjects([...objects, { content: "", empty: true }]);
    };

    // Xóa câu trả lời
    const removeAnswer = (index: number) => {
        setObjects(objects.filter((_, i) => i !== index));
    };

    // Cập nhật nội dung câu trả lời
    const updateObject = (index: number, content: string) => {
        const newObjects = [...objects];
        newObjects[index].content = content;
        newObjects[index].empty = content.trim() === ""; // Kiểm tra rỗng
        setObjects(newObjects);
    };

    console.log(">> check thumbnail", thumbnail)
    return (
        <>
            <div>
                {session?.user.roleName && session.user.roleName === "EXPERT" && (
                    <Button
                        type="primary"
                        onClick={showModal}
                        className="w-fit"
                        icon={<PlusOutlined className={`transition-transform duration-300 ${isRotated ? 'rotate-180' : ''}`} />}
                    >
                        Tạo mới
                    </Button>
                )}

            </div>

            <Modal
                title="Tạo khoá học"
                open={isModalOpen}
                footer={null}
                width={700}
                onCancel={handleCancel}
            >
                <div>
                    <span className="text-red-500 mr-2">*</span>Tên khóa học:
                    <Input
                        status={title.error ? 'error' : ''}
                        className="mt-1"
                        placeholder="Nhập tên khóa học"
                        allowClear
                        value={title.value}
                        onChange={(e) => setTitle({ ...title, value: e.target.value, error: false })}
                    />
                    {title.error && (
                        <p className='text-red-500 text-sm ml-2 flex items-center gap-x-1'>
                            <WarningOutlined />
                            {title.message}
                        </p>
                    )}

                </div>

                <div className="flex items-center gap-x-4">
                    {/* Link giới thiệu khóa học */}
                    <div className="flex-1">
                        <span className="text-red-500 mr-2">*</span>Link giới thiệu khóa học:
                        <Input
                            status={introduction.error ? 'error' : ''}
                            className="mt-1 w-full"
                            placeholder="Nhập link giới thiệu khóa học"
                            allowClear
                            value={introduction.value}
                            onChange={(e) => setIntroduction({ ...introduction, value: e.target.value, error: false })}
                        />
                        {introduction.error && (
                            <p className='text-red-500 text-sm ml-2 flex items-center gap-x-1'>
                                <WarningOutlined />
                                {introduction.message}
                            </p>
                        )}
                    </div>

                    {/* Giá gốc */}
                    <div className="flex-1">
                        <span className="text-red-500 mr-2">*</span>Giá gốc:
                        <Input
                            status={price.error ? 'error' : ''}
                            className="mt-1 w-full"
                            placeholder="Nhập giá gốc khóa học"
                            allowClear
                            value={price.value}
                            onChange={(e) => setPrice({ ...price, value: e.target.value, error: false })}
                        />
                        {price.error && (
                            <p className='text-red-500 text-sm ml-2 flex items-center gap-x-1'>
                                <WarningOutlined />
                                {price.message}
                            </p>
                        )}
                    </div>
                </div>


                <div>
                    <span className="text-red-500 mr-2">*</span>Mô tả:
                    <TextArea
                        status={des.error ? 'error' : ''}
                        className="mt-1"
                        placeholder="Nhập mô tả khóa học"
                        allowClear
                        value={des.value}
                        onChange={(e) => setDes({ ...des, value: e.target.value, error: false })}
                    />
                    {des.error && (
                        <p className='text-red-500 text-sm ml-2 flex items-center gap-x-1'>
                            <WarningOutlined />
                            {des.message}
                        </p>
                    )}
                </div>


                <div className="mt-4">
                    <span className="text-red-500 mr-2">*</span>Mục tiêu:
                    {objects.map((object, index) => (
                        <div key={index} className="w-full flex flex-col gap-1 mt-2">
                            <div className="flex items-center gap-2">
                                <Input
                                    className={`w-full ${isSubmitted && object.empty ? "border-red-500" : ""}`}
                                    placeholder={`Mục tiêu ${index + 1}`}
                                    value={object.content}
                                    onChange={(e) => updateObject(index, e.target.value)}
                                    allowClear
                                />
                                <Tooltip title='Thêm mục tiêu' color="blue">
                                    <PlusCircleOutlined onClick={addAnswer} className="text-lg cursor-pointer" style={{ color: 'blue' }} />
                                </Tooltip>
                                {objects.length > 1 && (
                                    <Tooltip title='Xóa mục tiêu' color="red">
                                        <MinusCircleOutlined style={{ color: 'red' }} className="text-lg cursor-pointer" onClick={() => removeAnswer(index)} />
                                    </Tooltip>
                                )}
                            </div>
                            {isSubmitted && object.empty && (
                                <p className='text-red-500 text-sm ml-2 flex items-center gap-x-1'>
                                    <WarningOutlined />
                                    Vui lòng không để trống mục tiêu
                                </p>
                            )}
                        </div>
                    ))
                    }

                </div>

                <div>
                    <span className="text-red-500 mr-2">*</span>Lĩnh vực sử dụng trong khóa học:
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
                </div>
                {emptySubject !== "" && (
                    <p className='text-red-500 text-sm ml-2 flex items-center gap-x-1'>
                        <WarningOutlined />
                        {emptySubject}
                    </p>
                )}

                <div>
                    <span className="text-red-500 mr-2">*</span>Ảnh:
                    <div>
                        {urlThumbnail === "" ? (
                            <div className={`${errThumbnail !== "" ? "border-red-500 border-2 w-fit rounded-lg relative" : "relative w-fit"}`}>
                                <Avatar
                                    shape="square"
                                    size={120}
                                    icon={<PlusOutlined />}
                                    alt="avatar"
                                />
                                <input
                                    type="file"
                                    onChange={handleUploadFile}
                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                    style={{ maxWidth: "120px", maxHeight: "120px" }}
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
                                        src={`${storageUrl}/course/${urlThumbnail}`}
                                        alt="Preview"
                                    />
                                </div>

                                <SyncOutlined className="text-blue-500 text-lg ml-6"
                                    onClick={handleSyncClick}
                                />

                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    onChange={handleUploadFile}
                                    className="hidden"
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
                </div>

                <div className="flex justify-end mt-5">
                    <Button className="mr-4" onClick={() => handleCancel()}>Hủy</Button>
                    <Button loading={loading} type="primary" onClick={() => handleOk()}>Tạo</Button>
                </div>

            </Modal>

        </>
    );
};

export default CourseCreateBtn;
