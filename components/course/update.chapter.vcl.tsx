'use client'
import { extractVideoId, getYouTubeDuration } from "@/helper/get.youtube.duration.helper";
import { sendRequest } from "@/utils/fetch.api";
// import { validIntroduction, validLessionDes, validLessionName, validObject, validOriginPrice, validSalePercentPrice } from "@/helper/create.course.helper";
import { apiUrl } from "@/utils/url";
import { CloseOutlined, PlusCircleOutlined, SnippetsOutlined, YoutubeOutlined } from "@ant-design/icons";
import MDEditor from "@uiw/react-md-editor";
import { Button, Divider, Form, Input, Modal, notification, Space } from "antd";
import TextArea from "antd/es/input/TextArea";
import { marked } from "marked";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { SetStateAction, useState } from "react";


const initState: ErrorResponse = {
    error: false,
    value: ''
};

const UpdateChapterModal = ({ openUpdateChapter, setOpenUpdateChapter, selectedCourse }: {
    openUpdateChapter: boolean,
    setOpenUpdateChapter: React.Dispatch<SetStateAction<boolean>>,
    selectedCourse: CourseResponse | null
}) => {
    const { data: session, status } = useSession();
    const [form] = Form.useForm();
    const [chapters, setChapters] = useState([{ content: "", correct: false, empty: true }]);
    const [videoUrl, setVideoUrl] = useState("");
    const [videoFile, setVideoFile] = useState(null);
    const router = useRouter()
    const [isSubmitted, setIsSubmitted] = useState(false);

    const [loading, setLoading] = useState(false);
    const [inputMarkdown, setInputMarkdown] = useState("");
    const [content, setContent] = useState<ErrorResponse>(initState);
    const [des, setDes] = useState<ErrorResponse>(initState);
    const [videoDuration, setVideoDuration] = useState<number | null>(null);



    const stripHtml = (html: string) => {
        let doc = new DOMParser().parseFromString(html, 'text/html');
        return doc.body.textContent || "";
    }

    const handleCancel = () => {
        form.resetFields();
        setVideoFile(null); // Xóa file đã chọn
        setVideoUrl(""); // Xóa URL video
        setIsSubmitted(false)
        // setIsModalOpen(false);
        setOpenUpdateChapter(false)
    };

    const onFinish = (values: object) => {
        console.log('Success:', values);
    };
    const handleGetData = async () => {

        if (!selectedCourse) {
            return;
        }
        const formValues = form.getFieldsValue();
        const htmlText = marked(inputMarkdown);

        const payload = await Promise.all(formValues.chapter.map(async (chapter: any) => {
            const videosWithDurations = await Promise.all((chapter.videos || []).map(async (video: any) => {
                const duration = await getYouTubeDuration(extractVideoId(video.videoUrl));  // Chờ kết quả duration
                console.log(duration);
                return {
                    title: video.videoTitle,
                    //@ts-ignore
                    videoUrl: video.videoUrl || (videoFile ? videoFile.name : ""),
                    duration: duration
                };
            }));

            return {
                title: chapter.lessonName,
                description: chapter.descriptionChapter,
                course: {
                    courseId: selectedCourse.courseId
                },
                videos: videosWithDurations,
                documents: (chapter.documents || []).map((doc: any) => ({
                    title: doc.title,
                    content: htmlText.toString(),
                    plainContent: stripHtml(htmlText.toString())
                }))
            };
        }));

        console.log("Payload:", payload);  // Kiểm tra payload
        try {
            const response = await sendRequest<ApiResponse<ChapterResponse[]>>({
                url: `${apiUrl}/chapter`,
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${session?.accessToken}`,
                    "Content-Type": "application/json"
                },
                body: payload
            });

            if (response.status === 201) {
                handleCancel();
                router.refresh();
                notification.success({
                    message: "Thành công",
                    description: "Tạo chương học thành công!",
                });

                setOpenUpdateChapter(false);
            } else {
                notification.error({
                    message: "Thất bại",
                    description: "Tạo chương học thất bại!",
                });
            }
        } catch (error) {
            console.error("Lỗi khi gửi request:", error);
        }
    };

    return (
        <Modal
            open={openUpdateChapter}
            onCancel={handleCancel}
            footer={null}
            width="50vw"
        >
            <h1 className="text-center text-2xl font-semibold">Tạo chương học  </h1>
            <div className="mt-4">

                {chapters.map((_, index) => (
                    <div key={index} className="w-full flex gap-2 mt-2 pl-5">
                        <div className="flex flex-col w-full gap-2">
                            <Form
                                labelCol={{ span: 6 }}
                                wrapperCol={{ span: 18 }}
                                form={form}
                                name="dynamic_form_complex"
                                style={{ maxWidth: 1000 }}
                                autoComplete="off"
                                initialValues={{ chapter: [{ videos: [], documents: [] }] }}
                                onFinish={onFinish}
                            >
                                {/* Form.List cho danh sách chương */}
                                <Form.List name="chapter">
                                    {(chapterField, { add: addChapter, remove: removeChapter }) => (
                                        <div>
                                            {chapterField.map((chapterField) => (
                                                <div key={chapterField.key} style={{ padding: 16 }}>
                                                    <Form.Item
                                                        label="Tên chương học"
                                                        name={[chapterField.name, 'lessonName']}
                                                        rules={[{ required: true, message: 'Tên chương học không được để trống' }]}
                                                        labelCol={{ span: 24 }}
                                                    >
                                                        <Input className="!w-[135%]" placeholder="Nhập tên chương học" />

                                                    </Form.Item>
                                                    <Form.Item
                                                        label="Mô tả chương học"
                                                        name={[chapterField.name, 'descriptionChapter']}
                                                        rules={[{ required: true, message: 'Mô tả chương học không được để trống' }]}
                                                        labelCol={{ span: 24 }}
                                                    >
                                                        <TextArea
                                                            status={des.error ? 'error' : ''}
                                                            className="!w-[135%]"
                                                            placeholder="Nhập mô tả chương học"
                                                            allowClear
                                                            value={des.value}
                                                            onChange={(e) => setDes({ ...des, value: e.target.value, error: false })}
                                                        />

                                                    </Form.Item>


                                                    {/* Form.List cho danh sách video của chương */}
                                                    <Form.List name={[chapterField.name, 'videos']}>
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
                                                                                    onChange={(e) => setVideoUrl(e.target.value)}
                                                                                />
                                                                            </Form.Item>
                                                                            <Form.Item name={[videoField.name, 'duration']} hidden>
                                                                                <Input type="hidden" />
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



                                                    {/* Form.List cho danh sách tài liệu của chương */}
                                                    <Form.List name={[chapterField.name, 'documents']}>
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
                                                    {chapterField.length > 1 && (
                                                        <Divider className="border-t-4 !border-black">
                                                            <Button
                                                                style={{ marginTop: "10px" }}
                                                                type="dashed"
                                                                danger
                                                                onClick={() => removeChapter(chapterField.name)}
                                                            >
                                                                Xóa chương học
                                                            </Button>
                                                        </Divider>

                                                    )}

                                                </div>
                                            ))}
                                            <Button
                                                type="dashed"
                                                onClick={addChapter}
                                                icon={<PlusCircleOutlined />}
                                                className="mt-3 w-full"
                                            >
                                                Thêm chương học
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
                                                    const lessonsData: { videos?: any[]; documents?: any[] }[] = values.chapter || [];
                                                    const hasValidLesson = lessonsData.some((chapter) =>
                                                        (chapter.videos && chapter.videos.length > 0) ||
                                                        (chapter.documents && chapter.documents.length > 0)
                                                    );
                                                    if (!hasValidLesson) {
                                                        notification.error({
                                                            message: 'Lỗi tạo chương học',
                                                            description: 'Chương học cần có ít nhất 1 video hoặc 1 tài liệu.',
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
export default UpdateChapterModal;