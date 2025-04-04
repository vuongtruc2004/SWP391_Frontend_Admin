export { };
declare global {
    interface UserResponse {
        userId: number;
        password: string;
        rePassword: string;
        avatar: string;
        roleName: 'USER' | 'ADMIN' | 'MARKETING' | 'EXPERT';
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
        revenue: number;
        students: number;
        orders: number;
        todayRevenue: number;
        todayStudents: number;
        todayOrders: number;
        yesterdayRevenue: number;
        yesterdayStudents: number;
        yesterdayOrders: number;
    }



    interface BlogResponse {
        blogId: number;
        title: string;
        content: string;
        thumbnail: string;
        createdAt: string;
        updatedAt: string;
        pinned: boolean;
        totalLikes: number;
        totalComments: number;
        user: UserResponse;
        hashtags: HashtagResponse[];
        blogStatus: 'DRAFT' | 'PRIVATE' | 'PUBLISH'
    }

    interface HashtagResponse {
        tagId: number;
        tagName: string;
    }

    interface QuestionResponse {
        questionId: number;
        title: string;
        answers: AnswerResponse[];
    }

    interface AnswerResponse {
        answerId: number;
        content: string;
        correct: boolean;
    }

    interface CourseResponse {
        courseId: number;
        courseName: string;
        description: string;
        thumbnail: string;
        objectives: string[];
        price: number;
        totalPurchased: number;
        totalLessons: number;
        totalQuizzes: number;
        createdAt: string;
        updatedAt: string;
        courseStatus: "DRAFT" | "PROCESSING" | "APPROVED" | "REJECTED"
    }

    interface CourseDetailsResponse extends CourseResponse {
        introduction: string;
        expert: ExpertDetailsResponse;
        subjects: SubjectResponse[];
        chapters: ChapterResponse[];
        averageRating: number;
        totalRating: number;
    }

    interface ChapterResponse {
        chapterId: number;
        title: string;
        description: string;
        lessons: LessonResponse[];
        quizInfo: QuizInfoResponse;
    }

    interface QuizInfoResponse {
        quizId: number;
        title: string;
        published: boolean;
        allowSeeAnswers: boolean;
        duration: number;
        description: string;
        updatedAt: string;
        questions: QuestionResponse[];
        chapterId: number;
    }

    interface LessonResponse {
        lessonId: number;
        title: string;
        description: string;
        duration: number;
        createdAt: string;
        updatedAt: string;
        lessonType: "VIDEO" | "DOCUMENT";
        videoUrl: string | null;
        documentContent: string | null;
    }

    interface AgeRangeResponse {
        [key: string]: number;
    }

    interface CourseWeekResponse {
        [key: string]: number;
    }



    interface ExpertResponse {
        expertId: number;
        diploma: string;
        yearOfExperience: number;
        totalCourses: number;
        user: UserResponse;
    }

    interface SubjectResponse {
        subjectId: number;
        subjectName: string;
        description: string;
        thumbnail: string;
        totalCourses: number;
        listCourses: string[];
        createdAt: string;
        updatedAt: string;
    }

    interface MinMaxPriceResponse {
        minPrice: number;
        maxPrice: number;
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
        published: boolean;
        description: string;
        allowSeeAnswers: boolean;
        createdAt: string;
        updatedAt: string;
        questions: QuestionResponse[];
        duration: number;
        chapter: ChapterResponse;
    }

    interface OrderResponse {
        orderId: number;
        orderCode: string;
        createdAt: string;
        paidAt: string;
        user: UserResponse;
        totalPrice: number;
        orderDetails: OrderDetailsResponse[];
        allowSeeAnswers: boolean;
    }

    interface OrderDetailsResponse {
        orderDetailsId: number;
        course: CourseResponse;
    }

    interface NotificationResponse {
        notificationId: number,
        title: string,
        content: string,
        status: string,
        setDate: string,
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

    interface RateResponse {
        rateId: number,
        content: string,
        stars: number,
        createdAt: string,
        updatedAt: string,
        user: UserResponse,
    }


    interface CampaignResponse {
        campaignId: number;
        campaignName: string;
        campaignDescription: string;
        discountPercentage: number;
        discountRange: string;
        thumbnail: string;
        startTime: string;
        endTime: string;
        createdAt: string;
        updatedAt: string;
        courses: CourseResponse[];
    }

    interface CouponResponse {
        couponId: number;
        couponName: string;
        couponDescription: string;
        couponCode: string;
        discountType: 'FIXED' | 'PERCENTAGE';
        discountPercent: number;
        discountAmount: number;
        maxDiscountAmount: number;
        minOrderValue: number;
        maxUses: number;
        usedCount: number;
        startTime: string;
        endTime: string;
    }
}