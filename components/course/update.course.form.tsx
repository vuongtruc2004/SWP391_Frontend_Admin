'use client'
import { validDes, validIntroduction, validOriginPrice, validTitle } from '@/helper/create.course.helper';
import { sendRequest } from '@/utils/fetch.api';
import { apiUrl, storageUrl } from '@/utils/url';
import { EyeOutlined, MinusCircleOutlined, PlusCircleOutlined, SyncOutlined, WarningOutlined } from '@ant-design/icons';
import '@ant-design/v5-patch-for-react-19';
import { Button, Checkbox, Image, Input, Modal, notification } from 'antd';
import TextArea from 'antd/es/input/TextArea';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { ChangeEvent, useEffect, useRef, useState } from 'react';


const initState: ErrorResponse = {
    error: false,
    value: ''
}
const UpdateCourseForm = (props: {
    editingCourse: CourseResponse | null;
    setEditingCourse: React.Dispatch<React.SetStateAction<CourseResponse | null>>;
    openEditForm: boolean;
    setOpenEditForm: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
    const { editingCourse, setEditingCourse, openEditForm, setOpenEditForm } = props;
    const [isPreviewVisible, setIsPreviewVisible] = useState(false);
    const [errThumbnail, setErrThumbnail] = useState("")
    const [urlThumbnail, setUrlThumbnail] = useState("");
    const CheckboxGroup = Checkbox.Group;
    const [emptySubject, setEmptySubject] = useState("");
    const [subjects, setSubjects] = useState<string[]>([]);
    const [title, setTitle] = useState<ErrorResponse>(initState);
    const [introduction, setIntroduction] = useState<ErrorResponse>(initState);
    const [price, setPrice] = useState<ErrorResponse>(initState);
    const [des, setDes] = useState<ErrorResponse>(initState);
    const { data: session, status } = useSession();
    const fileInputRef = useRef<HTMLInputElement>(null)
    const [subjectChecked, setSubjectChecked] = useState<string[]>(editingCourse?.subjects?.map(s => s.subjectName) || [])
    const [objects, setObjects] = useState<{ content: string; empty: boolean }[]>([
        { content: "", empty: true }
    ]);
    const [errorMessage, setErrorMessage] = useState("");
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    useEffect(() => {
        if (editingCourse?.subjects) {
            setSubjectChecked(editingCourse.subjects.map(s => s.subjectName));
        }
        if (editingCourse?.thumbnail) {
            setUrlThumbnail(editingCourse?.thumbnail)
        }
        if (editingCourse) {
            setTitle({
                error: false,
                value: editingCourse.courseName
            });
            setIntroduction({
                error: false,
                value: editingCourse.introduction
            });
            setPrice({
                error: false,
                value: editingCourse?.price?.toString()
            });
            setDes({
                error: false,
                value: editingCourse.description
            });

            const mappedObjects = editingCourse.objectives.map(object => ({
                content: object || "",
                empty: object.trim() === "" ? true : false
            }));

            setObjects(mappedObjects);
        }

    }, [editingCourse]);
    useEffect(() => {
        const fetchSubjects = async () => {
            try {
                const response = await fetch(`${apiUrl}/subjects/all-inpagination`);
                if (response.ok) {
                    const data = await response.json();
                    console.log("data", data)
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


    const handleCheckboxChange = (checkedValues: string[]) => {
        setSubjectChecked(checkedValues);
    };

    const handleSyncClick = () => {
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
            fileInputRef.current.click();
        }
    };

    const handleUploadFile = async (e: ChangeEvent<HTMLInputElement>) => {
        setErrThumbnail("")
        if (e.target.files && e.target.files[0]) {
            const formData = new FormData();
            formData.set('file', e.target.files[0]);
            formData.set('folder', 'course');

            const imageResponse = await sendRequest<ApiResponse<string>>({
                url: `${apiUrl}/files/image`,
                method: 'POST',
                headers: {},
                body: formData
            });


            if (imageResponse.status === 200) {
                setUrlThumbnail(imageResponse.data)
            } else {
                setErrThumbnail(imageResponse.errorMessage)
            }
        }
    }
    const handleOk = async () => {

        setIsSubmitted(true);
        setLoading(true);
        const isTitleValid = validTitle(title, setTitle);
        const isIntroduction = validIntroduction(introduction, setIntroduction);
        const isOriginPrice = validOriginPrice(price, setPrice);
        const isDes = validDes(des, setDes);
        if (!isTitleValid || !isIntroduction || !isOriginPrice || !isDes || !subjectChecked || subjectChecked.length === 0) {
            setEmptySubject("Vui lòng chọn ít nhất một lĩnh vực sử dụng trong khóa học!")
            if (subjectChecked.length !== 0) {
                setEmptySubject("")
            }
            if (urlThumbnail !== "") {
                setErrThumbnail("")
                setLoading(false);
                return
            }
            setLoading(false);
            return;
        }

        if (objects.some(object => object.empty)) {
            if (subjectChecked.length !== 0) {
                setEmptySubject("")
            }
            setLoading(false);
            return;
        }

        const courseRequest: CourseRequest = {
            courseId: editingCourse?.courseId,
            courseName: title.value,
            description: des.value,
            thumbnail: urlThumbnail,
            objectives: objects.map(obj => obj.content),
            subjects: subjectChecked,
            price: Number(price.value),
            introduction: introduction.value,
        }

        const createResponse = await sendRequest<ApiResponse<CourseResponse>>({
            url: `${apiUrl}/courses`,
            method: 'PUT',
            headers: {
                Authorization: `Bearer ${session?.accessToken}`,
                "Content-Type": "application/json"
            },
            body: courseRequest
        });



        if (createResponse.status === 200) {
            handleCancel();
            setErrThumbnail("")
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
        setEditingCourse(null);
        setOpenEditForm(false);
        setEmptySubject("");
        setUrlThumbnail("");
    };

    // Thêm Mục tiêu mới
    const addObject = () => {
        setObjects([...objects, { content: "", empty: true }]);
    };

    // Xóa Mục tiêu
    const removeObject = (index: number) => {
        setObjects(objects.filter((_, i) => i !== index));
    };

    // Cập nhật nội dung Mục tiêu
    const updateObject = (index: number, content: string) => {
        const newObjects = [...objects];
        newObjects[index].content = content;
        newObjects[index].empty = content.trim() === ""; // Kiểm tra rỗng
        setObjects(newObjects);
    };

    return (
        <Modal title="Cập nhật khóa học" open={openEditForm} footer={null} width={700} onCancel={handleCancel}>
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
                            {objects.length > 1 && (
                                <MinusCircleOutlined style={{ color: 'red' }} className="text-lg cursor-pointer" onClick={() => removeObject(index)} />
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
                <Button type="dashed" onClick={addObject} icon={<PlusCircleOutlined />} className="mt-3 w-full">
                    Thêm Mục tiêu
                </Button>
            </div>
            <div>
                <span className="text-red-500 mr-2">*</span>Lĩnh vực sử dụng trong khóa học:
                <CheckboxGroup
                    options={subjects.map((subject) => ({
                        label: subject,
                        value: subject,
                    }))}
                    onChange={handleCheckboxChange}
                    value={subjectChecked}
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
            <span className="text-red-500 mr-2">*</span>Ảnh:
            <div className="w-fit rounded-lg">
                <div className="flex items-end">
                    <div className="h-full w-full">
                        <Image
                            className={`${errThumbnail !== "" ? "border-red-500 border-2 w-fit rounded-lg" : "h-full w-full object-contain"}`}
                            width="100%"
                            height="100%"
                            preview={{
                                visible: isPreviewVisible,
                                mask: <span><EyeOutlined className='mr-2' />Xem</span>,
                                onVisibleChange: (visible) => setIsPreviewVisible(visible),
                            }}
                            src={
                                urlThumbnail === ""
                                    ? `${storageUrl}/course/${editingCourse?.thumbnail}`
                                    : `${storageUrl}/course/${urlThumbnail}`
                            }

                            alt="Xem trước"
                        />
                    </div>
                    <SyncOutlined style={{ color: 'blue' }} className="text-lg ml-6" onClick={handleSyncClick} />
                    <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleUploadFile}
                        className="hidden"
                    />
                </div>
            </div>
            {
                errThumbnail !== "" && (
                    <p className='text-red-500 text-sm ml-2 flex items-center gap-x-1'>
                        <WarningOutlined />
                        {errThumbnail}
                    </p>
                )
            }
            <div className="flex justify-end mt-5">
                <Button className="mr-4" onClick={() => handleCancel()}>Hủy</Button>
                <Button loading={loading} type="primary" onClick={() => handleOk()}>Cập nhật</Button>
            </div>

        </Modal >
    )
}

export default UpdateCourseForm