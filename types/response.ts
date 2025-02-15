export { };
declare global {
    interface UserResponse {
        userId: number;
        password: string;
        rePassword: string;
        avatar: string;
        roleName: string;
        fullname: string;
        email: string;
        gender: string;
        dob: string;
        locked: boolean;
        accountType: string;
    }
    interface ApiResponse<T> {
        status: number;
        errorMessage: string;
        message: object;
        data: T;
    }

    interface ErrorResponse {
        error: boolean;
        value: string;
        message?: string;
    }

    interface LoginResponse {
        user: UserResponse;
        accessToken: string;
        expireAt: string;
        refreshToken: string;
    }

    interface PageDetailsResponse<T> {
        currentPage: number;
        pageSize: number;
        totalPages: number;
        totalElements: number;
        content: T;
    }

    interface AnswerResponse {
        answerId: number;
        content: string;
        correct: boolean;
    }

    interface BlogResponse {
        blogId: number;
        title: string;
        content: string;
        thumbnail: string;
        createdAt: string;
        updatedAt: string;
        published: boolean;
        accepted: boolean;
        totalLikes: number;
        totalComments: number;
        user: UserResponse;
        hashtags: HashtagResponse[];
    }

    interface BlogDetailsResponse extends BlogResponse {
        comments: CommentResponse[],
        likes: LikeResponse[],
    }

    interface HashtagResponse {
        tagId: number;
        tagName: string;
    }

    interface QuestionResponse {
        questionId: number;
        title: string;
        answers: AnswerResponse[];
        quizzes: string[];
        correctAnswers: string[];
    }

    interface CourseResponse {
        courseId: number,
        courseName: string,
        description: string,
        thumbnail: string,
        originalPrice: number,
        salePrice: number,
        expert: ExpertResponse,
        totalPurchased: number,
        createdAt: string,
        updatedAt: string,
    }

    interface CourseDetailsResponse extends CourseResponse {
        introduction: string,
        objectives: string[],
        accepted: boolean,
        expert: ExpertDetailsResponse,
        subjects: SubjectResponse[],
        lessons: LessonResponse[],
        totalLikes: number,
        totalComments: number,
    }

    interface DocumentResponse {
        documentId: number;
        title: string
        content: string
        plainContent: string;
        createdAt: string;
        updatedAt: string;
    }

    interface ExpertResponse {
        expertId: number;
        user: UserResponse;
    }

    interface ExpertDetailsResponse extends ExpertResponse {
        job: string,
        achievement: string,
        description: string,
        yearOfExperience: number,
        totalCourses: number,
        totalStudents: number
    }

    interface VideoResponse {
        videoId: number;
        title: string;
        description: string;
        videoUrl: string;
        createdAt: string;
        updatedAt: string;
    }
    interface LessonResponse {
        lessonId: number;
        title: string;
        description: string;
        videos: VideoResponse[];
        documents: DocumentResponse[];
    }

    interface SubjectResponse {
        subjectId: number;
        subjectName: string;
        description: string;
        thumbnail: string;
        totalCourses: number;
        listCourses: string[];
    }

    interface MinMaxPriceResponse {
        minPrice: number;
        maxPrice: number;
    }

    interface CommentResponse {
        content: string,
        createdAt: string,
        updatedAt: string,
        user: UserResponse,
        parentComment: CommentResponse,
        replies: CommentResponse[],
        likes: LikeResponse[],
        blog: BlogResponse,
        course: CourseResponse,

    }

    interface LikeResponse {
        user: UserResponse,
        blog: BlogResponse,
        course: CourseResponse,
        comment: CommentResponse,
        createdAt: string,
    }
}