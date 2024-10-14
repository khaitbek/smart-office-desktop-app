export interface SignInDto {
    username: string;
    password: string;
}

export interface SignInSuccessResponseDto {
    accessToken: string;
    refreshToken: string;
}

export interface SignInErrorResponseDto {
    message: string;
}