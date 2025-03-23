export { };
declare global {
    interface UserRequest {
        userId?: number;
        password?: string;
        rePassword?: string;
        phone?: string;
        roleName: string;
        avatar?: string;
        fullname?: string;
        email?: string;
        gender?: string;
        dob?: string;
        job?: string;
        achievement?: string;
        description?: string;
        yearOfExperience?: number;
    }

    interface SubjectRequest {
        subjectId?: number;
        subjectName?: string;
        description?: string;
        thumbnail?: string;
    }

    interface CourseRequest {
        courseId?: number;
        price?: number;
        courseName?: string;
        description?: string;
        thumbnail?: string;
        introduction?: string;
        objectives?: string[];
        subjects?: string[];
    }



    interface UpdateUserRequest {
        userId: number,
        fullname: string,
        dob: string | null,
        gender: string | null,
    }

    interface CredentialsLoginRequest {
        email: string;
        password: string;
    }

    interface SocialsLoginRequest {
        fullname: string;
        avatar: string;
        email: string;
        accountType: string;
    }

    interface ChangePasswordRequest {
        code: string;
        password: string;
        rePassword: string;
    }

    interface EmailRequest {
        email: string;
    }

    interface RegisterRequest {
        fullname: string;
        email: string;
        password: string;
    }

    interface BlogRequest {
        title: string;
        content: string;
        plainContent: string;
        thumbnail: string;
        pinned: boolean;
        hashtags: string[];
    }

    interface NotificationRequest {
        title: string;
        content: string;
        status?: string;
        global: boolean;
        userIds: number[];
        setDate: string;
    }

    interface OrderRequest {
        userId: number;
        email: string;
        fullname: string;
        gender: string;
        courses: CourseOrder[];
    }

    interface CourseOrder {
        courseId: number;
        courseName: string;
        thumbnail: string;
        expertName: string;
        price: number;
    }

    interface CreateOrderRequest {
        userId: number;
        courseOrders: {
            courseId: number;
            price: number;
        }[];
    }

    interface QuizRequest {
        quizId?: number;
        title: string;
        published: boolean;
        allowSeeAnswers: boolean;
        description: string;
        duration: number;
        chapterId: number;
        bankQuestionIds: number[];
        newQuestions: QuestionRequest[];


    }

    interface QuestionRequest {
        // questionId?: number;
        title?: string;
        answers: {
            content: string;
            correct: boolean;
        }[];
    }

    interface ChapterRequest {
        title: string;
        description: string;
        courseId: number;
        lessons: LessonRequest[];
    }

    interface LessonRequest {
        title: string;
        lessonType: "VIDEO" | "DOCUMENT";
        videoUrl?: string;
        documentContent?: string;
        duration?: number;
    }

    interface CampaignRequest {
        campaignId?: number;
        campaignName: string;
        campaignDescription: string;
        discountPercentage: number;
        discountRange: "ALL" | "COURSES";
        thumbnailUrl: string;
        startTime: string;
        endTime: string;
        courseIds?: number[];
    }
}