import { isValidYouTubeUrl } from "./create.course.helper";
import { sendRequest } from "@/utils/fetch.api";

export const getVideoDurationFromLocalhostLink = (link: string): Promise<number> => {
    return new Promise((resolve) => {
        const video = document.createElement("video");
        video.preload = "metadata";
        video.src = link;

        video.onloadedmetadata = () => {
            resolve(Math.round(video.duration));
            URL.revokeObjectURL(video.src);
        };

        video.onerror = () => {
            resolve(0);
        };
    });
};

export const extractVideoId = (link: string) => {
    const match = link.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
    return match ? match[1] : null;
};

export const calculateReadingTime = (content: string) => {
    const wordsPerMinute = 200;
    const wordCount = content.split(/\s+/).length;
    const readingTime = Math.ceil(wordCount / wordsPerMinute);
    return readingTime * 60;
}

export const getVideoDurationFromYoutubeLink = async (link: string): Promise<number> => {
    if (!isValidYouTubeUrl(link)) return 0;
    const videoId = extractVideoId(link);
    if (!videoId) return 0;

    try {
        const response = await sendRequest<any>({
            url: `https://www.googleapis.com/youtube/v3/videos?id=${videoId}&part=contentDetails&key=AIzaSyDHLaOVc-hmgJ5r-bWL8U0Eb2OfLwj6VpI`
        });

        if (response.items.length > 0) {
            const duration = response.items[0].contentDetails.duration;
            const match = duration.match(/PT(\d+H)?(\d+M)?(\d+S)?/);

            if (!match) return 0;

            const hours = match[1] ? parseInt(match[1]) : 0;
            const minutes = match[2] ? parseInt(match[2]) : 0;
            const seconds = match[3] ? parseInt(match[3]) : 0;
            return hours * 3600 + minutes * 60 + seconds;
        }
    } catch {
        return 0;
    }
    return 0;
};