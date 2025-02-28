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

    interface QuestionRequest {
        questionId?: number;
        title?: string;
        answersId?: number[];
        answers?: AnswerResponse[];
        quizzes?: string[];
        correctAnswers?: string[];
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
        hashtag: string[];
    }

    interface NotificationRequest {
        title: string;
        content: string;
        global: boolean;
        emails: string[];
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
        title?: string;
        maxAttempts?: number;
        published?: boolean;
        startedAt: string;
        endedAt: string;
        questions: string[];
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
}