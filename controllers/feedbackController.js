const { addFeedback, getAllFeedback, getFeedbackByPredefinedAnswers, getFeedbackByExtensionId } = require('../schemas/feedback');

const createFeedback = async (event) => {
    try {
      const body = JSON.parse(event.body);
      const feedback = await addFeedback(body);
      return {
        statusCode: 201,
        body: JSON.stringify({feedback}),
        
      };
    } catch (err) {
      return {
        statusCode: 500,
        body: JSON.stringify({ message: 'something is wrong', error:err.message }),
      };
    }
  };

const findAllFeedback = async () => {
  try {
    const feedback = await getAllFeedback();
    return {
      statusCode: 200,
      body: JSON.stringify(feedback),
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ message: err.message }),
    };
  }
};

const findFeedbackByPredefinedAnswers = async (event) => {
  try {
    const { predefinedAnswers } = event.queryStringParameters;
    const feedback = await getFeedbackByPredefinedAnswers(predefinedAnswers);
    return {
      statusCode: 200,
      body: JSON.stringify(feedback),
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ message: err.message }),
    };
  }
};

const getFeedback = async (event) => {
  try {
    const { extId } = event.pathParameters;
    const feedback = await getFeedbackByExtensionId(extId);
    return {
      statusCode: 200,
      body: JSON.stringify(feedback),
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ message: err.message }),
    };
  }
};

module.exports = { createFeedback, findAllFeedback, findFeedbackByPredefinedAnswers, getFeedback };