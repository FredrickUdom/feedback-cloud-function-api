// app.js
const { createFeedback, findAllFeedback, findFeedbackByPredefinedAnswers, getFeedback } = require('./controllers/feedbackController');

exports.handler = async (event, context) => {
  let response;

  try {
    switch (event.httpMethod) {
        case 'POST':
            if (event.path === '/feedback') {
              response = await createFeedback(event);
            }
            break;
      case 'GET':
        if (event.path === '/feedback/get-all') {
          response = await findAllFeedback();
        } else if (event.path === '/feedback/search') {
          response = await findFeedbackByPredefinedAnswers(event);  // Pass the event object
        } else if (event.pathParameters && event.pathParameters.extId) {
          const { extId } = event.pathParameters;
          response = await getFeedback(extId);
        }
        break;
      default:
        response = {
          statusCode: 404,
          body: JSON.stringify({ message: 'Not Found' }),
        };
    }
  } catch (err) {
    console.log(err);
    response = {
      statusCode: 500,
      body: JSON.stringify({ message: err.message }),
    };
  }

  return {
    ...response,
    headers: {
      'Content-Type': 'application/json',
    },
  };
};