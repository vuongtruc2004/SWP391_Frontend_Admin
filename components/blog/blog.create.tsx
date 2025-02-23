import { validContent } from "@/helper/create.blog.helper";
import { validTitle } from "@/helper/create.question.helper";
import { sendRequest } from "@/utils/fetch.api";
import { apiUrl, storageUrl } from "@/utils/url";
import { EyeOutlined, PlusOutlined, SyncOutlined, WarningOutlined } from "@ant-design/icons";
import MDEditor from "@uiw/react-md-editor";
import { Avatar, Form, Image, Input, Modal, notification } from "antd";
import { error } from "console";
import { marked } from "marked";
import { getSession, useSession } from "next-auth/react";
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
    const [title, setTitle] = useState<ErrorResponse>(initState);
    const [content, setContent] = useState<ErrorResponse>(initState);
    const [urlThumbnail, setUrlThumbnail] = useState("");
    const [errThumbnail, setErrThumbnail] = useState("");
    const [inputMarkdown, setInputMarkdown] = useState("");
    const [isPreviewVisible, setIsPreviewVisible] = useState(false);
    const [plainContent, setPlainContent] = useState("");
    const { data: session, status } = useSession();
    const router = useRouter();

    //another function
    const stripHtml = (html: string) => {
        let doc = new DOMParser().parseFromString(html, 'text/html');
        return doc.body.textContent || "";
    }



    //function handle
    const handleOnOk = async () => {

        const isValidTitle = validTitle(title, setTitle);
        const isValidContent = validContent(content, setContent);

        if (!isValidTitle || !isValidContent) {
            return
        }

        const htmlText = marked(inputMarkdown);


        const blogRequest: BlogRequest = {
            title: title.value,
            content: htmlText.toString(),
            plainContent: stripHtml(htmlText.toString()),
            thumbnail: urlThumbnail,
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
        console.log(createBlog.message)
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
            })
            router.refresh()
        } else {
            notification.error({
                message: "Thất bại!",
                description: "Tạo bài viết thất bại"
            })
        }



    }

    //useEffect
    useEffect(() => {
        if (openFormCreate) {
            console.log("form open")
            setTitle(initState);
            setContent(initState);
            setPlainContent("");
            setInputMarkdown("");
            setUrlThumbnail("");
            setErrThumbnail("");
        }
    }, [openFormCreate]);

    console.log(title)

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
            console.log(formData)
            const uploadImage = await sendRequest<ApiResponse<string>>({
                url: `${apiUrl}/blogs/up-thumbnail`,
                method: 'POST',
                headers: {},
                body: formData
            });
            console.log("Upload Response:", uploadImage);

            if (uploadImage.status === 200) {
                setUrlThumbnail(uploadImage.data);
            } else {
                setErrThumbnail("Ảnh không hợp lệ!");
            }
        }



    }


    return (
        <>
            <Modal title="Tạo Bài Viết Mới" open={openFormCreate}
                onOk={handleOnOk}
                onCancel={handleOnCancel}
                okText="Tạo"
                cancelText="Hủy"
                width={1000}

            >
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
                                    console.log(title.value)
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
                                    console.log(event)
                                }}
                                preview="edit"
                                commandsFilter={(cmd) => (cmd.name && ["preview", "live", "fullscreen"].includes(cmd.name)) ? false : cmd}
                                style={{
                                    background: '#e9ecef',
                                    color: 'black'
                                }}
                            />
                            {content.error && content.value === '' && (
                                <p className="text-red-600 text-sm ml-2 flex items-center gap-x-1">
                                    <WarningOutlined />
                                    {content.message}
                                </p>
                            )}
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

                                    <SyncOutlined className="text-blue-500 text-lg ml-6" onClick={() => document.getElementById("chooseFile")?.click()} />

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
            </Modal >
        </>
    )
};

export default BlogCreate;