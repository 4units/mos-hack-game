import apiClient from './apiClient';

export type QuizQuestionResponse = {
  id: string;
  question: string;
  answer: string[];
  answer_description?: string;
  info_link?: string;
};

export type QuizAnswerRequest = {
  id: string;
  answer: number;
};

export type QuizAnswerResponse = {
  soft_currency: number;
};

export const getQuizQuestion = async (): Promise<QuizQuestionResponse> => {
  const { data } = await apiClient.get<QuizQuestionResponse>('/game/quiz');
  return data;
};

export const submitQuizAnswer = async (payload: QuizAnswerRequest): Promise<QuizAnswerResponse> => {
  const { data } = await apiClient.post<QuizAnswerResponse>('/game/quiz/answer', payload);
  return data;
};

const quizApi = {
  getQuizQuestion,
  submitQuizAnswer,
};

export default quizApi;
