
const { dynamoDB, PutCommand, ScanCommand } = require('../config/aws');
const { v4: uuidv4 } = require('uuid');
const TABLE_NAME = 'Feedback';

const addFeedback = async (item) => {
    const id = uuidv4();
    const timestamp = new Date().toISOString();
    const rating = item.rating;
    if (rating === undefined || rating < 1 || rating > 5) {
      throw new Error('Rating must be a number between 1 and 5.');
    }
    const predefinedAnswers = item.predefinedAnswers || [];
    if (!Array.isArray(predefinedAnswers)) {
      throw new Error('predefinedAnswers must be an array');
    }
  
    predefinedAnswers.forEach((question, index) => {
      if (!question.questionId || !question.question || !question.options) {
        throw new Error(`Invalid structure for question at index ${index}`);
      }
    });

  const params = {
    TableName: TABLE_NAME,
    Item: {
      id,
      predefinedAnswers, 
      customReason: item.customReason || '',
      rating: item.rating,
      createdAt: timestamp,
    },
  };
    const command = new PutCommand(params); 
    await dynamoDB.send(command); 
    return item;
  };

const getAllFeedback = async () => {
  const params = {
    TableName: TABLE_NAME,
  };

  const command = new ScanCommand(params);
  const result = await dynamoDB.send(command);
  return result.Items;
};

const getFeedbackByPredefinedAnswers = async (predefinedAnswers) => {
  try{
    const params = {
        TableName: TABLE_NAME,
        FilterExpression: 'contains(predefinedAnswers, :answer)',
        ExpressionAttributeValues: {
          ':answer': predefinedAnswers,
        },
      };
    
      const command = new ScanCommand(params);
      const result = await dynamoDB.send(command);
      return result.Items;
  }catch(err){
    console.error('DynamoDB Error:', err);
    throw err;
  }
}; 



const getFeedbackByExtensionId = async (extId) => {
  const params = {
    TableName: TABLE_NAME,
    KeyConditionExpression: 'id = :extId',
    ExpressionAttributeValues: {
      ':extId': extId,
    },
  };
  const result = await dynamoDB.query(params);
  return result.Items;
};

module.exports = { addFeedback, getAllFeedback, getFeedbackByPredefinedAnswers, getFeedbackByExtensionId };