import { IBooleanQuestion, IMultipleChoiceQuestion } from "../questions-test/questions-test.types";

export interface IQuestionsForm {
    fullName: string | null;
    email: string | null;
    numberOfQuestions: string | null;
    difficulty: string | null;
    type: string | null;
}

export interface IResponse {
    response_code: number;
    results: IMultipleChoiceQuestion[] | IBooleanQuestion[];
    success: boolean;
}