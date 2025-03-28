import { validContent } from "@/helper/create.blog.helper";
import { validTitle } from "@/helper/create.question.helper";
import { sendRequest } from "@/utils/fetch.api";
import { apiUrl, storageUrl } from "@/utils/url";
import { EyeOutlined, LoadingOutlined, PlusOutlined, SyncOutlined, UploadOutlined, WarningOutlined } from "@ant-design/icons";
import MDEditor, { getCommands, ICommand } from "@uiw/react-md-editor";
import { Avatar, Button, Checkbox, Form, Image, Input, Modal, notification, Select, Spin, Tooltip } from "antd";
import { marked } from "marked";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { ChangeEvent, useEffect, useState } from "react";


interface IProps {
    openFormCreate: boolean,
    setOpenFormCreate: React.Dispatch<React.SetStateAction<boolean>>
}

const initState: ErrorResponse = {
    error: false,
    value: '',
}
const BlogCreate = (props: IProps) => {
    const { openFormCreate, setOpenFormCreate } = props;
    const CheckboxGroup = Checkbox.Group;
    const [title, setTitle] = useState<ErrorResponse>(initState);
    const [content, setContent] = useState<ErrorResponse>(initState);
    const [urlThumbnail, setUrlThumbnail] = useState("");
    const [errThumbnail, setErrThumbnail] = useState("");
    const [inputMarkdown, setInputMarkdown] = useState("");
    const [isPreviewVisible, setIsPreviewVisible] = useState(false);
    const [plainContent, setPlainContent] = useState("");
    const [getSubjects, setGetSubjects] = useState<string[]>();
    const [pinned, setPinned] = useState<boolean>(false);
    const [checkList, setCheckList] = useState<{ error: boolean, value: string[] }>({ error: false, value: [] });
    const [loading, setLoading] = useState<boolean>(false);
    const { data: session, status } = useSession();
    const router = useRouter();

    const uploadImageCommand: ICommand = {
        name: "upload-file",
        keyCommand: "upload-file",
        buttonProps: { "aria-label": "Tải hình ảnh lên" },
        icon: <span>Tải hình ảnh lên</span>, // Icon hiển thị
        execute: () => {
            const input = document.createElement("input");
            input.type = "file";
            input.accept = "image/jpg, image/jpeg, image/png";
            input.onchange = async (event) => {
                const file = (event.target as HTMLInputElement);
                if (file.files && file.files[0]) {
                    const formData = new FormData();
                    formData.set("file", file.files[0]);
                    formData.set("folder", "blog");

                    // Gửi request upload ảnh
                    const imageRes = await sendRequest<ApiResponse<string>>({
                        url: `${apiUrl}/blogs/up-thumbnail`,
                        method: "POST",
                        body: formData,
                    });

                    // Chèn Markdown vào editor
                    const imageMarkdown = `![image](${storageUrl}/blog/${imageRes.data})`;
                    setInputMarkdown((prev) => prev + `\n ${imageMarkdown} \n`);
                }
            };
            input.click();
        },
    };

    // Thêm command vào danh sách
    const customCommands = [...getCommands(), uploadImageCommand];
    //another function
    const stripHtml = (html: string) => {
        let doc = new DOMParser().parseFromString(html, 'text/html');
        return doc.body.textContent || "";
    }

    //function handle
    const handlOnChange = (list: string[]) => {
        setCheckList(prev => ({
            ...prev,
            value: list
        }));
    }
    const handleOnOk = async () => {
        setLoading(true);

        setTimeout(async () => {
            const isValidTitle = validTitle(title, setTitle);
            const isValidContent = validContent(content, setContent);

            if (urlThumbnail === "") {
                setErrThumbnail("Ảnh không được để trống!");
                setLoading(false);
                return;
            }

            if (!isValidTitle || !isValidContent) {
                setLoading(false);
                return
            }

            if (title.value.split(/\s+/).length > 100) {
                notification.error({
                    message: 'Thất bại!',
                    description: 'Tiêu đề không được quá 100 từ!',
                    showProgress: true,
                })
                setLoading(false);
                return;
            }

            if (checkList && checkList.value.length === 0) {
                setCheckList(prev => ({ ...prev, error: true }));
                setLoading(false);
                return;
            }
            const htmlText = marked(inputMarkdown);

            const blogRequest: BlogRequest = {
                title: title.value,
                content: htmlText.toString(),
                plainContent: stripHtml(htmlText.toString()),
                thumbnail: urlThumbnail,
                hashtags: checkList.value ? checkList.value : [],
                pinned: pinned,
            }

            const createBlog = await sendRequest<ApiResponse<BlogResponse>>({
                url: `${apiUrl}/blogs/create-blog`,
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${session?.accessToken}`,
                    'Content-Type': 'application/json'
                },
                body: blogRequest,
            })

            if (createBlog.status === 201) {
                setTitle(initState);
                setContent(initState);
                setPlainContent("");
                setInputMarkdown("");
                setUrlThumbnail("");
                setOpenFormCreate(false);
                notification.success({
                    message: "Thành công!",
                    description: "Tạo bài viết mới thành công!",
                    showProgress: true,
                })
                router.refresh()
            } else {
                notification.error({
                    message: "Thất bại!",
                    description: "Tạo bài viết thất bại",
                    showProgress: true,
                })
            }
            setLoading(false);
        }, 1500)

    }

    const handleSaveDraft = async () => {
        setLoading(true);

        setTimeout(async () => {
            const isValidTitle = validTitle(title, setTitle);
            const isValidContent = validContent(content, setContent);

            if (urlThumbnail === "") {
                setErrThumbnail("Ảnh không được để trống!");
                setLoading(false);
                return;
            }

            if (!isValidTitle || !isValidContent) {
                setLoading(false);
                return
            }

            if (title.value.split(/\s+/).length > 100) {
                notification.error({
                    message: 'Thất bại!',
                    description: 'Tiêu đề không được quá 100 từ!',
                    showProgress: true,
                })
                setLoading(false);
                return;
            }

            if (checkList && checkList.value.length === 0) {
                setCheckList(prev => ({ ...prev, error: true }));
                setLoading(false);
                return;
            }
            const htmlText = marked(inputMarkdown);

            const blogRequestDraft: BlogRequest = {
                title: title.value,
                content: htmlText.toString(),
                plainContent: stripHtml(htmlText.toString()),
                thumbnail: urlThumbnail,
                hashtags: checkList.value ? checkList.value : [],
                pinned: pinned,
            }

            const saveDraftBlog = await sendRequest<ApiResponse<BlogResponse>>({
                url: `${apiUrl}/blogs/save-draft`,
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${session?.accessToken}`,
                    'Content-Type': 'application/json'
                },
                body: blogRequestDraft,
            })

            if (saveDraftBlog.status === 201) {
                setTitle(initState);
                setContent(initState);
                setPlainContent("");
                setInputMarkdown("");
                setUrlThumbnail("");
                setOpenFormCreate(false);
                notification.success({
                    message: "Thành công!",
                    description: "Bài viết đã được lưu dưới dạng bản nháp!",
                    showProgress: true,
                })
                router.refresh()
            } else {
                notification.error({
                    message: "Thất bại!",
                    description: "Lưu nháp bài viết thất bại!",
                    showProgress: true,
                })
            }
            setLoading(false);
        }, 1500)
    }



    const handleOnCancel = () => {
        setUrlThumbnail("");
        setErrThumbnail("");
        setContent(initState);
        setTitle({
            ...title,
            value: ""
        })
        setInputMarkdown("")
        setOpenFormCreate(false);
    }

    const handleUploadFile = async (e: ChangeEvent<HTMLInputElement>) => {
        setErrThumbnail("");
        if (e.target.files && e.target.files[0]) {
            const formData = new FormData();
            formData.set("file", e.target.files[0]);
            formData.set("folder", "blog");
            const uploadImage = await sendRequest<ApiResponse<string>>({
                url: `${apiUrl}/blogs/up-thumbnail`,
                method: 'POST',
                headers: {},
                body: formData
            });

            if (uploadImage.status === 200) {
                setUrlThumbnail(uploadImage.data);
            } else {
                setErrThumbnail("Ảnh không hợp lệ!");
            }
        }
    }

    //useEffect
    useEffect(() => {
        if (openFormCreate) {
            setTitle(initState);
            setContent(initState);
            setPlainContent("");
            setInputMarkdown("");
            setUrlThumbnail("");
            setErrThumbnail("");
            setCheckList({ error: false, value: [] });
        }
    }, [openFormCreate]);

    useEffect(() => {

        const getAllSubjects = async () => {
            try {
                const getAllSub = await sendRequest<ApiResponse<SubjectResponse>>({
                    url: `${apiUrl}/hashtags/all`,
                    method: 'GET',
                });
                console.log(getAllSub.data);
                if (getAllSub.data && Array.isArray(getAllSub.data)) {
                    setGetSubjects(getAllSub.data.map((hashTag: { tagName: string }) => hashTag.tagName));
                }
            } catch {
                console.error("Error fetching subjects");
            }
        };
        getAllSubjects()

    }, []);

    const handleChangePinned = (pinned: boolean) => {
        setPinned(pinned);
    }

    return (
        <>
            <Modal title="Tạo Bài Viết Mới" open={openFormCreate}
                onOk={handleOnOk}
                onCancel={handleOnCancel}
                okText="Tạo"
                cancelText="Hủy"
                width={1000}
                footer={(_, { OkBtn, CancelBtn }) => (
                    <>
                        <CancelBtn />
                        <Button type="primary" onClick={handleSaveDraft}>Lưu nháp</Button>
                        <OkBtn />
                    </>
                )}
            >
                <Spin size="large" spinning={loading}>
                    <Form>
                        <div>
                            <h4 className="mb-3"><span className="text-red-600">*</span>Tiêu đề bài viết:</h4>
                            <Form.Item>
                                <Input
                                    value={title.value}
                                    placeholder="Tiêu đề"
                                    status={title.error ? "error" : ""}
                                    type="text"
                                    onChange={(e) => {
                                        setTitle((prev) => ({
                                            ...prev,
                                            value: e.target.value
                                        }))
                                    }}
                                />
                                {title.error && title.value === '' && (
                                    <p className="text-red-600 text-sm ml-2 flex items-center gap-x-1">
                                        <WarningOutlined />
                                        {title.message}
                                    </p>
                                )}
                            </Form.Item>
                        </div>
                        <div>
                            <h4 className="mb-3"><span className="text-red-600">*</span>Nội dung:</h4>
                            <Form.Item>
                                <MDEditor
                                    value={inputMarkdown}
                                    onChange={(event) => {
                                        setInputMarkdown(event ? event : "")
                                        setContent({
                                            ...content,
                                            value: event ? event : ""
                                        })
                                    }}
                                    preview="edit"
                                    commandsFilter={(cmd) => (cmd.name && ["preview", "live", "fullscreen"].includes(cmd.name)) ? false : cmd}
                                    style={{
                                        background: '#e9ecef',
                                        color: 'black'
                                    }}
                                    commands={customCommands}
                                />
                                {content.error && content.value === '' && (
                                    <p className="text-red-600 text-sm ml-2 flex items-center gap-x-1">
                                        <WarningOutlined />
                                        {content.message}
                                    </p>
                                )}
                            </Form.Item>
                        </div>
                        <div className="mb-5">
                            <h4><span className="text-red-600">*</span> Chủ đề:</h4>
                            <CheckboxGroup
                                options={getSubjects?.map((subject) => ({
                                    label: subject,
                                    value: subject,
                                }))}
                                value={checkList.value}
                                onChange={handlOnChange}
                                style={{
                                    display: 'flex',
                                    flexWrap: 'wrap',
                                    gap: '8px',
                                }}
                            />
                            {checkList.error && checkList.value.length === 0 && (
                                <p className="text-red-600 text-sm ml-2 flex items-center gap-x-1">
                                    <WarningOutlined />
                                    Vui lòng thêm chủ đề bài viết
                                </p>
                            )}
                        </div>
                        <div>
                            <p><span className='text-red-600'>*</span>Ghim bài viết:</p>
                            <Form.Item>
                                <Select
                                    value={pinned}
                                    style={{ width: 470 }}
                                    onChange={handleChangePinned}
                                    options={[
                                        { value: true, label: "Có" },
                                        { value: false, label: "Không" },
                                    ]}
                                />
                            </Form.Item>
                        </div>
                        <div>
                            <span className="text-red-500 mr-2 mb-3">*</span>Ảnh:
                            <div className={`${errThumbnail !== "" ? "border-red-500 border-2 w-fit rounded-lg" : ""}`}>
                                {urlThumbnail === "" ? (
                                    <div className="relative w-fit">
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
                                            style={{ maxWidth: "120px", maxHeight: "120px" }} // Giới hạn kích thước input file
                                        />
                                    </div>

                                ) : (
                                    <div className="flex items-end">
                                        <div className="h-[120px] w-[200px]">
                                            <Image
                                                className="h-full w-full object-contain"
                                                width="100%"
                                                height="100%"
                                                preview={{
                                                    visible: isPreviewVisible,
                                                    mask: <span><EyeOutlined className='mr-2' />Xem</span>,
                                                    onVisibleChange: (visible) => setIsPreviewVisible(visible),
                                                }}
                                                src={`${storageUrl}/blog/${urlThumbnail}`}
                                                alt="Preview"
                                            />
                                        </div>
                                        <Tooltip placement="bottom" title={"Tải lên ảnh khác"}>
                                            <UploadOutlined className="text-blue-500 text-lg ml-6" onClick={() => document.getElementById("chooseFile")?.click()} />
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
                        </div>
                    </Form>
                </Spin>

            </Modal >
        </>
    )
};

export default BlogCreate;