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
        salePrice?: number;
        originalPrice?: number;
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
    }

    interface NotificationRequest {
        title: string;
        content: string;
        global: boolean;
        fullname: string[];
    }

    interface OrderRequest {
        userId: number;
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
}