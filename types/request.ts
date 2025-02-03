export { }
declare global {
    interface UserRequest {
        userId?: number;
        username: string;
        password?: string;
        rePassword?: string;
        phone?: string;
        avatar?: string;
        fullname: string;
        email: string;
        gender?: string;
        dob?: string;
    }

    interface CredentialsLoginRequest {
        username: string;
        password: string;
    }

    interface SocialsLoginRequest {
        username: string;
        fullname: string;
        avatar: string;
        email: string;
        accountType: string;
    }

    interface SubjectRequest {
        subjectId: number;
        subjectName: string;
        description: string;
        thumbnail: string;
    }
}