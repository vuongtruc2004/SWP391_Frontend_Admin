'use client'
// import { validIntroduction, validLessionDes, validLessionName, validObject, validOriginPrice, validSalePercentPrice } from "@/helper/create.course.helper";
import { apiUrl } from "@/utils/url";
import { CloseOutlined, PlusCircleOutlined, SnippetsOutlined, YoutubeOutlined } from "@ant-design/icons";
import MDEditor from "@uiw/react-md-editor";
import { Button, Divider, Form, Input, Modal, notification, Space } from "antd";
import { marked } from "marked";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { SetStateAction, useState } from "react";


const initState: ErrorResponse = {
    error: false,
    value: ''
};

const UpdateLessonModal = ({ openUpdateLesson, setOpenUpdateLesson, selectedCourse }: {
    openUpdateLesson: boolean,
    setOpenUpdateLesson: React.Dispatch<SetStateAction<boolean>>,
    selectedCourse: CourseResponse | null
}) => {
    const { data: session, status } = useSession();
    const [form] = Form.useForm();
    const [lessions, setLessions] = useState([{ content: "", correct: false, empty: true }]); // Mảng câu trả lời
    const [videoUrl, setVideoUrl] = useState("");
    const [videoFile, setVideoFile] = useState(null);
    const [videoUrls, setVideoUrls] = useState({});
    const [videoFiles, setVideoFiles] = useState({});
    const router = useRouter()
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [loading, setLoading] = useState(false);
    const [inputMarkdown, setInputMarkdown] = useState("");
    const [content, setContent] = useState<ErrorResponse>(initState);

    const [checkUploadVideo, setCheckUploadVideo] = useState(false);
    if (!selectedCourse) {
        return null; // Nếu chưa có dữ liệu, không render gì cả
    }


    const stripHtml = (html: string) => {
        let doc = new DOMParser().parseFromString(html, 'text/html');
        return doc.body.textContent || "";
    }


    // Xóa câu trả lời
    const removeLessions = (index: number) => {
        setLessions(lessions.filter((_, i) => i !== index));
    };

    // Thêm câu trả lời mới
    const addLession = () => {
        setLessions([...lessions, { content: "", correct: false, empty: true }]);
    };

    const handleCancel = () => {
        form.resetFields();
        setVideoFile(null); // Xóa file đã chọn
        setVideoUrl(""); // Xóa URL video
        setIsSubmitted(false)
        // setIsModalOpen(false);
        setOpenUpdateLesson(false)
    };

    const onFinish = (values: object) => {
        console.log('Success:', values);
    };
    const handleGetData = async () => {

        const formValues = form.getFieldsValue();
        const htmlText = marked(inputMarkdown);

        const payload = formValues.lessons.map((lesson: any) => ({
            title: lesson.lessonName,
            course: {
                courseId: selectedCourse.courseId
            },
            videos: (lesson.videos || []).map((video: any) => ({
                title: video.videoTitle,
                //@ts-ignore
                videoUrl: video.videoUrl || (videoFile ? videoFile.name : ""), // Lấy tên file nếu có
            })),
            documents: (lesson.documents || []).map((doc: any) => ({
                title: doc.title,
                content: htmlText.toString(),
                plainContent: stripHtml(htmlText.toString())
            }))
        }));




        try {
            const response = await fetch(`${apiUrl}/lessons`, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${session?.accessToken}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(payload)
            });

            const result = await response.json();
            console.log(">>check res", result)
            if (response.ok) {
                handleCancel();
                router.refresh();
                notification.success({
                    message: "Thành công",
                    description: "Tạo bài giảng thành công!",
                });



                setOpenUpdateLesson(false); // Đóng modal sau khi tạo thành công
            } else {
                notification.error({
                    message: "Thất bại",
                    description: "Tạo bài giảng thất bại!",
                });
            }
        } catch (error) {
            console.error("Lỗi khi gửi request:", error);
        }
    };


    return (
        <Modal

            open={openUpdateLesson}
            onCancel={handleCancel}
            footer={null}
            width="50vw"
        >
            <h1 className="text-center text-2xl font-semibold">Tạo bài giảng  </h1>
            <div className="mt-4">

                {lessions.map((answer, index) => (
                    <div key={index} className="w-full flex gap-2 mt-2 pl-5">
                        {/* Cột chứa icon trừ */}
                        {/* {lessions.length > 1 && (
                            <div className="flex flex-col items-center gap-2 pt-6">
                                <MinusCircleOutlined
                                    style={{ color: 'red' }}
                                    className="text-lg cursor-pointer"
                                    onClick={() => removeLessions(index)}
                                />
                            </div>
                        )} */}
                        {/* Cột chứa input */}
                        <div className="flex flex-col w-full gap-2">
                            <Form
                                labelCol={{ span: 6 }}
                                wrapperCol={{ span: 18 }}
                                form={form}
                                name="dynamic_form_complex"
                                style={{ maxWidth: 1000 }}
                                autoComplete="off"
                                initialValues={{ lessons: [{ videos: [], documents: [] }] }}
                                onFinish={onFinish}
                            >
                                {/* Form.List cho danh sách bài giảng */}
                                <Form.List name="lessons">
                                    {(lessonFields, { add: addLesson, remove: removeLesson }) => (
                                        <div>
                                            {lessonFields.map((lessonField) => (
                                                <div key={lessonField.key} style={{ padding: 16 }}>
                                                    <Form.Item
                                                        label="Tên bài giảng "
                                                        name={[lessonField.name, 'lessonName']}
                                                        rules={[{ required: true, message: 'Tên bài giảng không được để trống' }]}
                                                        labelCol={{ span: 24 }}
                                                    >

                                                        <Input className="!w-[135%]" placeholder="Nhập tên bài giảng" />
                                                    </Form.Item>

                                                    {/* Form.List cho danh sách video của bài giảng */}
                                                    <Form.List name={[lessonField.name, 'videos']}>
                                                        {(videoFields, { add: addVideo, remove: removeVideo }) => (
                                                            <div style={{ display: 'flex', flexDirection: 'column', rowGap: 16 }}>
                                                                {videoFields.map((videoField, index) => (
                                                                    <Space key={videoField.key} direction="vertical" style={{ width: "100%" }}>
                                                                        <div className="w-full">
                                                                            <span style={{ fontWeight: "normal" }}>
                                                                                Video {index + 1}
                                                                                <CloseOutlined className="ml-4" onClick={() => {
                                                                                    removeVideo(videoField.name);
                                                                                }} />
                                                                            </span>

                                                                            <Form.Item
                                                                                name={[videoField.name, 'videoTitle']}
                                                                                style={{ width: "123%", marginLeft: '30px' }}
                                                                                rules={[{ required: true, message: 'Tiêu đề video không được để trống' }]}
                                                                            >
                                                                                <Input placeholder="Tiêu đề video" />
                                                                            </Form.Item>

                                                                            <Form.Item
                                                                                name={[videoField.name, 'videoUrl']}
                                                                                style={{ width: "123%", marginLeft: '30px' }}
                                                                                rules={
                                                                                    [
                                                                                        {
                                                                                            required: true,
                                                                                            message: 'Video url có định dạng không hợp lệ'
                                                                                        },
                                                                                        {
                                                                                            pattern: /^(https?:\/\/)?(www\.)?(youtube\.com\/watch\?v=|youtu\.be\/)[a-zA-Z0-9_-]{11}(\S*)?$/,
                                                                                            message: 'Chỉ chấp nhận URL YouTube!',
                                                                                        },
                                                                                    ]

                                                                                }
                                                                            >
                                                                                <Input
                                                                                    placeholder="Video URL"
                                                                                    value={videoUrl}
                                                                                />
                                                                            </Form.Item>


                                                                        </div>
                                                                    </Space>
                                                                ))}

                                                                <Button type="primary" onClick={addVideo} className="mt-3 w-fit p-3">
                                                                    <YoutubeOutlined className="text-xl" />
                                                                </Button>
                                                            </div>
                                                        )}
                                                    </Form.List>



                                                    {/* Form.List cho danh sách tài liệu của bài giảng */}
                                                    <Form.List name={[lessonField.name, 'documents']}>
                                                        {(documentFields, { add: addDocument, remove: removeDocument }) => (
                                                            <div style={{ display: 'flex', flexDirection: 'column', rowGap: 16 }}>
                                                                {documentFields.map((documentField, index) => (
                                                                    <Space key={documentField.key} direction="vertical" style={{ width: "100%" }}>

                                                                        <div className="w-full mt-4">
                                                                            <span style={{ fontWeight: "normal", minWidth: "70px", textAlign: "right" }}>
                                                                                Tài liệu {index + 1}
                                                                                <CloseOutlined className="ml-4" onClick={() => removeDocument(documentField.name)} />
                                                                            </span>
                                                                            <Form.Item
                                                                                name={[documentField.name, 'title']}
                                                                                style={{ width: "123%", marginLeft: '30px', marginTop: '20px' }}
                                                                                rules={[{ required: true, message: 'Tiêu đề tài liệu không được để trống' }]}
                                                                            >
                                                                                <Input placeholder="Tiêu đề tài liệu" />
                                                                            </Form.Item>
                                                                            <Form.Item
                                                                                name={[documentField.name, 'content']}
                                                                                style={{ width: "123%", marginLeft: '30px' }}
                                                                                dependencies={[documentField.name, 'content']}
                                                                                rules={[{ required: true, message: 'Nội dung tài liệu không được để trống' }]}
                                                                            >
                                                                                <MDEditor
                                                                                    value={inputMarkdown}
                                                                                    onChange={(event) => {
                                                                                        setInputMarkdown(event ? event : "")
                                                                                        setContent({
                                                                                            ...content,
                                                                                            value: event ? event : ""
                                                                                        })
                                                                                        console.log(event)
                                                                                    }}
                                                                                    preview="edit"
                                                                                    commandsFilter={(cmd) => (cmd.name && ["preview", "live", "fullscreen"].includes(cmd.name)) ? false : cmd}
                                                                                    style={{
                                                                                        background: '#e9ecef',
                                                                                        color: 'black'
                                                                                    }}
                                                                                />
                                                                            </Form.Item>
                                                                        </div>
                                                                    </Space>
                                                                ))}
                                                                <Button
                                                                    type="default"
                                                                    onClick={addDocument}
                                                                    className={`w-fit !bg-green-500 !text-white p-3 ${documentFields.length > 0 ? "ml-0" : "ml-[65px] mt-[-31px]"}  `}
                                                                >
                                                                    <SnippetsOutlined className="text-xl" />
                                                                </Button>


                                                            </div>
                                                        )}
                                                    </Form.List>
                                                    {lessonFields.length > 1 && (
                                                        <Divider className="border-t-4 !border-black">
                                                            <Button
                                                                style={{ marginTop: "10px" }}
                                                                type="dashed"
                                                                danger
                                                                onClick={() => removeLesson(lessonField.name)}
                                                            >
                                                                Xóa bài giảng
                                                            </Button>
                                                        </Divider>

                                                    )}

                                                </div>
                                            ))}
                                            <Button
                                                type="dashed"
                                                onClick={addLesson}
                                                icon={<PlusCircleOutlined />}
                                                className="mt-3 w-full"
                                            >
                                                Thêm bài giảng
                                            </Button>

                                        </div>
                                    )}
                                </Form.List>
                                <div className="text-end mt-5">
                                    <Button className="mr-4" onClick={() => handleCancel()}>Hủy</Button>
                                    <Button
                                        loading={loading}
                                        type="primary"
                                        onClick={() => {
                                            form.validateFields()
                                                .then(values => {
                                                    const lessonsData: { videos?: any[]; documents?: any[] }[] = values.lessons || [];
                                                    const hasValidLesson = lessonsData.some((lesson) =>
                                                        (lesson.videos && lesson.videos.length > 0) ||
                                                        (lesson.documents && lesson.documents.length > 0)
                                                    );
                                                    if (!hasValidLesson) {
                                                        notification.error({
                                                            message: 'Lỗi',
                                                            description: 'Mỗi bài giảng cần có ít nhất 1 video hoặc tài liệu.',
                                                        });
                                                        return;
                                                    }
                                                    handleGetData();
                                                })
                                                .catch(errorInfo => console.log("Validation failed:", errorInfo));
                                        }}

                                    >
                                        Tạo
                                    </Button>
                                </div>


                            </Form>


                        </div>
                    </div >
                ))}

            </div >

        </Modal >
    );
};
export default UpdateLessonModal;