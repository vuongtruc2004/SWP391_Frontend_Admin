import { sendRequest } from "@/utils/fetch.api";
import { apiUrl, storageUrl } from "@/utils/url";
import MDEditor, { getCommands, ICommand } from "@uiw/react-md-editor";
import { Dispatch, SetStateAction } from "react";

const DocumentEditor = ({ inputMarkdown, setInputMarkdown }: { inputMarkdown: string, setInputMarkdown: Dispatch<SetStateAction<string>> }) => {

    const uploadImageCommand: ICommand = {
        name: "upload-file",
        keyCommand: "upload-file",
        buttonProps: { "aria-label": "Tải lên hình ảnh" },
        icon: <span>Tải lên hình ảnh</span>,
        execute: () => {
            const input = document.createElement("input");
            input.type = "file";
            input.accept = "image/jpg, image/jpeg, image/png";
            input.onchange = async (event) => {
                const file = (event.target as HTMLInputElement);
                if (file.files && file.files[0]) {
                    const formData = new FormData();
                    formData.set("file", file.files[0]);
                    formData.set("folder", "lesson");

                    const imageRes = await sendRequest<ApiResponse<string>>({
                        url: `${apiUrl}/files/image`,
                        method: "POST",
                        body: formData,
                    });

                    const imageMarkdown = `![image](${storageUrl}/lesson/${imageRes.data})`;
                    setInputMarkdown((prev) => prev + `\n ${imageMarkdown} \n`);
                }
            };
            input.click();
        },
    };

    const uploadFileCommand: ICommand = {
        name: "upload-file",
        keyCommand: "upload-file",
        buttonProps: { "aria-label": "Tải lên file" },
        icon: <span>Tải lên file</span>,
        execute: () => {
            const input = document.createElement("input");
            input.type = "file";
            input.accept = ".pdf, .doc, .docx, .xls, .xlsx";
            input.onchange = async (event) => {
                const file = (event.target as HTMLInputElement);
                if (file.files && file.files[0]) {
                    const formData = new FormData();
                    formData.set("file", file.files[0]);
                    formData.set("folder", "lesson");

                    const fileRes = await sendRequest<ApiResponse<string>>({
                        url: `${apiUrl}/files/document`,
                        method: "POST",
                        body: formData,
                    });

                    const fileMarkdown = `[Tải xuống ${file.files[0].name}](${storageUrl}/lesson/${fileRes.data})`;
                    setInputMarkdown((prev) => prev + `\n ${fileMarkdown} \n`);
                }
            };
            input.click();
        },
    };

    const customCommands = [...getCommands(), uploadImageCommand, uploadFileCommand];

    return (
        <MDEditor
            value={inputMarkdown}
            onChange={(event) => { setInputMarkdown(event || "") }}
            preview="edit"
            commandsFilter={(cmd) => (cmd.name && ["preview", "live", "fullscreen"].includes(cmd.name)) ? false : cmd}
            style={{
                background: '#e9ecef',
                color: 'black'
            }}
            commands={customCommands}
        />
    )
}

export default DocumentEditor