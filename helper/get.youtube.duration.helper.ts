
export const YOUTUBE_API_KEY = "AIzaSyCiy4PmXGIyuabMzmmdQOGit_tfQq_UzdE";

//@ts-ignore
export const extractVideoId = (url) => {
    const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
    return match ? match[1] : null;
};

export const calculateReadingTime = (content: string) => {
    const wordsPerMinute = 200;
    const wordCount = content.split(/\s+/).length;
    const readingTime = Math.ceil(wordCount / wordsPerMinute);
    return readingTime;
}

export const parseYouTubeDuration = (duration: string): number => {
    const match = duration.match(/PT(\d+H)?(\d+M)?(\d+S)?/);
    if (!match) return 0;

    const hours = match[1] ? parseInt(match[1]) : 0;
    const minutes = match[2] ? parseInt(match[2]) : 0;
    const seconds = match[3] ? parseInt(match[3]) : 0;
    return (hours * 3600 + minutes * 60 + seconds) - 1;
};

export const getYouTubeDuration = async (videoId: number) => {
    const url = `https://www.googleapis.com/youtube/v3/videos?id=${videoId}&part=contentDetails&key=${YOUTUBE_API_KEY}`;
    try {
        const response = await fetch(url);
        const data = await response.json();

        console.log(">>>", data);
        if (data.items.length > 0) {
            const duration = data.items[0].contentDetails.duration;

            return parseYouTubeDuration(duration);
        }
    } catch (error) {
        console.error("Error fetching YouTube video duration:", error);
    }
    return 0;
};
