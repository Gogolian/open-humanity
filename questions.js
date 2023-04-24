import backgroundInformationQuestions from './questions/background-information.js';

export async function getQuestions(question_set) {

  switch (question_set) {
    case 'background-information':
      return backgroundInformationQuestions;
    default:
      return [];
  }
  
}