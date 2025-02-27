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
        createdAt: string;
        updatedAt: string;
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

    interface GenderCountResponse {
        femaleCount: number;
        maleCount: number;
        unknownCount: number;
    }

    interface DashboardResponse {
        totalRevenue: number;
        totalStudents: number;
        totalOrders: number;
        todayRevenue: number;
        todayStudents: number;
        todayOrders: number;
        yesterdayRevenue: number;
        yesterdayStudents: number;
        yesterdayOrders: number;
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

    interface HashtagResponse {
        tagId: number;
        tagName: string;
    }

    interface QuestionResponse {
        questionId: number;
        title: string;
        correctAnswer: string[];
        answers: AnswerResponse[];
    }

    interface CourseResponse {
        courseId: number,
        courseName: string,
        description: string,
        thumbnail: string,
        price: number,
        expert: ExpertResponse,
        totalPurchased: number,
        createdAt: string,
        updatedAt: string,
        subjects: SubjectResponse[],
        introduction: string,
        objectives: string[],

    }

    interface AgeRangeResponse {
        [key: string]: number;
    }

    interface CourseWeekResponse {
        [key: string]: number;
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
        diploma: string;
        yearOfExperience: number;
        totalCourses: number;
        user: UserResponse;
    }

    interface VideoResponse {
        videoId: number;
        title: string;
        description: string;
        videoUrl: string;
        createdAt: string;
        updatedAt: string;
    }
    interface ChapterResponse {
        chapterId: number;
        title: string;
        description: string;
        lessons: LessonResponse[];
    }

    interface LessonResponse {
        lessonId: number;
        title: string;
        duration: number;
        lessonType: string;
        videoUrl?: string;
        documentContent?: string;
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
    interface CourseDetailsResponse extends CourseResponse {
        introduction: string,
        objectives: string[],
        accepted: boolean,
        expert: ExpertDetailsResponse,
        subjects: SubjectResponse[],
        lessons: ChapterResponse[],
        totalLikes: number,
        totalComments: number,
    }

    interface ExpertDetailsResponse extends ExpertResponse {
        job: string,
        achievement: string,
        description: string,
        yearOfExperience: number,
        totalCourses: number,
        totalStudents: number
    }

    interface BlogDetailsResponse extends BlogResponse {
        comments: CommentResponse[],
        likes: LikeResponse[],
    }

    interface CommentResponse {
        commentId: number,
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
    interface QuizResponse {

        quizId: number;
        title: string;
        maxAttempts: number;
        published: boolean;
        createdAt: string;
        updatedAt: string;
        startedAt: string;
        endedAt: string;
        lesson: ChapterResponse;
        expert: ExpertResponse;
        questions: QuestionResponse[];
    }

    interface OrderResponse {
        orderId: number;
        orderStatus: string;
        createdAt: string;
        updatedAt: string;
        user: UserResponse;
        orderDetails: OrderDetailsResponse[];
    }

    interface OrderDetailsResponse {
        orderDetailsId: number;
        price: number;
        course: CourseResponse;
    }

    interface NotificationResponse {
        notificationId: number,
        title: string,
        content: string,
        createdAt: string,
        global: boolean,
        userNotifications: UserNotificationResponse[],
    }

    interface UserNotificationResponse {
        userNotificationId: number,
        user: UserResponse,
        notification: NotificationResponse,
        isRead: boolean,
    }

    interface CourseSalesEntryResponse {
        key: string;
        value: number;
    }

}